<?php

namespace App\Providers;

use DateTime;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\SQLiteConnection;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Storage::disk('local')->buildTemporaryUrlsUsing(function ($path, $expiration, $options) {
            return URL::temporarySignedRoute(
                'local.temp',
                $expiration,
                array_merge($options, ['path' => $path])
            );
        });

        // FIX: Handle null/empty paths safely to prevent UrlGenerationException
        Storage::disk('backup')->buildTemporaryUrlsUsing(
            function ($path, DateTime $expiration, array $options) {
                // If path is null or empty, use a placeholder string.
                // Laravel routes crash if a required parameter is an empty string.
                $safePath = $path ?: 'file_not_found';

                return URL::temporarySignedRoute(
                    'backup.download',
                    $expiration,
                    array_merge($options, ['path' => $safePath])
                );
            }
        );

        if (DB::connection() instanceof SQLiteConnection) {
            DB::statement('PRAGMA foreign_keys=ON');
        }
    }
}
