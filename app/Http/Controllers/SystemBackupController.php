<?php

namespace App\Http\Controllers;

use App\Models\Backup;
use App\Traits\HttpResponses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use ZipArchive;

class SystemBackupController extends Controller
{
    use HttpResponses;

    public function backup()
    {
        // --- 1. CONFIGURATION ---
        $dbName = env('DB_DATABASE', 'ori_system');
        $dbUser = env('DB_USERNAME', 'root');
        $dbPass = env('DB_PASSWORD', '');

        // ADJUST THIS PATH IF USING LARAGON: 'C:/laragon/bin/mysql/mysql-8.x/bin/mysqldump.exe'
        $mysqldumpPath = 'C:/xampp/mysql/bin/mysqldump.exe';

        $date = now()->format('Y-m-d-H-i-s');
        $tempDir = storage_path("app/temp_backup_{$date}");
        $sqlFile = "mysql-{$dbName}.sql";
        $zipFileName = "{$date}.zip";

        // FIX 1: Let Laravel tell us EXACTLY where the 'backup' disk points
        $backupDir = Storage::disk('backup')->path('');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }
        $zipPath = rtrim($backupDir, '\\/') . '/' . $zipFileName;

        // Create Temp Directory for SQL dump
        if (!File::exists($tempDir)) {
            File::makeDirectory($tempDir, 0755, true);
        }

        try {
            // --- 2. DUMP DATABASE ---
            $command = "\"{$mysqldumpPath}\" --user=\"{$dbUser}\" --password=\"{$dbPass}\" {$dbName} > \"{$tempDir}/{$sqlFile}\"";

            $output = null;
            $resultCode = null;
            exec($command, $output, $resultCode);

            if ($resultCode !== 0) {
                throw new \Exception("mysqldump failed. Exit code: {$resultCode}");
            }

            // --- 3. CREATE ZIP ARCHIVE ---
            $zip = new ZipArchive;

            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {

                $zip->addFile("{$tempDir}/{$sqlFile}", "db-dumps/{$sqlFile}");

                $files = File::allFiles(storage_path('app/public'));
                foreach ($files as $file) {
                    $relativePath = 'storage/' . $file->getRelativePathname();
                    $zip->addFile($file->getRealPath(), $relativePath);
                }

                $zip->close();
            } else {
                throw new \Exception("Failed to create ZIP file.");
            }

            // --- 4. CLEANUP & SAVE ---
            File::deleteDirectory($tempDir);

            // Register in Database
            Backup::create([
                'file_path' => $zipFileName,
                'file_name' => $zipFileName
            ]);

            // FIX 2: Generate the exact signed URL expected by your web.php route
            $url = URL::temporarySignedRoute(
                'backup.download',
                now()->addMinutes(10),
                ['path' => $zipFileName]
            );

            // Ensure localhost links have the correct port
            if (Str::contains($url, 'localhost') && !Str::contains($url, ':8000')) {
                $url = str_replace('localhost', 'localhost:8000', $url);
            }

            return $this->success($url, null, 201);

        } catch (\Exception $e) {
            if (File::exists($tempDir)) {
                File::deleteDirectory($tempDir);
            }
            return $this->error(null, "Backup failed: " . $e->getMessage(), 500);
        }
    }

    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|string',
        ]);

        $backupPath = Storage::disk('backup')->path($request->backup_file);
        $localPath = storage_path('app/' . $request->backup_file);

        $fullPath = null;

        if (File::exists($backupPath)) {
            $fullPath = $backupPath;
        } elseif (File::exists($localPath)) {
            $fullPath = $localPath;
        } else {
            return $this->error(null, "Backup file not found.", 404);
        }

        $validationResult = $this->validateBackupZip($fullPath);
        if ($validationResult !== true) {
            return $this->error($validationResult, "Invalid backup file structure.", 403);
        }

        $restorationResult = $this->restoreBackup($fullPath);
        if ($restorationResult !== true) {
            return $this->error($restorationResult, "Error restoring backup.", 403);
        }

        return $this->success(null, "System successfully restored!", 200);
    }

    private function validateBackupZip($fullPath)
    {
        $zip = new ZipArchive;
        if (!file_exists($fullPath)) {
             return response()->json(['error' => 'Backup file not found at path.'], 404);
        }

        if ($zip->open($fullPath) === TRUE) {
            $hasDatabase = false;

            for ($i = 0; $i < $zip->numFiles; $i++) {
                $entry = $zip->getNameIndex($i);
                if (str_contains($entry, 'db-dumps/') && str_ends_with($entry, '.sql')) {
                    $hasDatabase = true;
                    break;
                }
            }
            $zip->close();

            if (!$hasDatabase) {
                return response()->json(['error' => 'Missing database dump (.sql) in backup.'], 400);
            }
            return true;
        }
        return response()->json(['error' => 'Unable to open zip file.'], 400);
    }

    private function restoreBackup($zipFilePath)
    {
        $extractPath = storage_path('app/temp_restore_' . now()->format('YmdHis'));

        try {
            $zip = new ZipArchive;
            if ($zip->open($zipFilePath) !== true) return 'Failed to open ZIP.';
            $zip->extractTo($extractPath);
            $zip->close();

            $sqlFile = collect(File::allFiles($extractPath . '/db-dumps'))->first();
            if (!$sqlFile) return 'Database SQL file not found in archive.';

            $dbName = env('DB_DATABASE', 'ori_system');
            $dbUser = env('DB_USERNAME', 'root');
            $dbPass = env('DB_PASSWORD', '');
            $mysqlPath = 'C:/xampp/mysql/bin/mysql.exe';

            $command = "\"{$mysqlPath}\" --user=\"{$dbUser}\" --password=\"{$dbPass}\" {$dbName} < \"{$sqlFile->getRealPath()}\"";

            exec($command, $output, $resultCode);

            if ($resultCode !== 0) return "Database restore failed. Exit code: {$resultCode}";

            $sourceStorage = $extractPath . '/storage';
            $destStorage = storage_path('app/public');

            if (File::isDirectory($sourceStorage)) {
                File::cleanDirectory($destStorage);
                File::copyDirectory($sourceStorage, $destStorage);
            }

            File::deleteDirectory($extractPath);

            return true;

        } catch (\Exception $e) {
            if (File::exists($extractPath)) File::deleteDirectory($extractPath);
            return 'Restore error: ' . $e->getMessage();
        }
    }

    public function download(Backup $backup)
    {
        $fullPath = Storage::disk('backup')->path($backup->file_name);

        if (file_exists($fullPath)) {
            return response()->download($fullPath);
        }

        abort(404, "Backup file not found on server.");
    }

    public function destroy(Backup $backup)
    {
        $fullPath = Storage::disk('backup')->path($backup->file_name);

        if (File::exists($fullPath)) {
            File::delete($fullPath);
        } elseif (Storage::disk('backup')->exists($backup->file_path)) {
            Storage::disk('backup')->delete($backup->file_path);
        }

        $backup->delete();
        return $this->success(null, "Backup file deleted", 200);
    }
}
