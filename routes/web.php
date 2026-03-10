<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('local/temp/{path}', function (string $path){
    
    $filePath = Storage::disk('local')->path('documents/'.$path);
    
    return response()->file($filePath, ['Content-Type' => Storage::disk('local')->mimeType($path), 'Content-Disposition' => 'inline']);
})
->middleware('signed')
->name('local.temp');

Route::get('backup/download/{path}', function (string $path){

    $path = urldecode($path);

    if (!Storage::disk('backup')->exists($path)) {
        abort(404, 'Backup file not found.');
    }
    
    return response()->download(
        Storage::disk('backup')->path($path),
        basename($path),
        ['Content-Type' => Storage::disk('backup')->mimeType($path)]);
})
->middleware('signed')
->name('backup.download')
->where('path', '.*');

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| SPA Fallback - Serve React app for all non-API routes
|--------------------------------------------------------------------------
*/
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|local|backup|sanctum|broadcasting).*');
