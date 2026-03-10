<?php

namespace App\Traits;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait useFileHandler {

    protected function moveToStorage($filePath)
    {
        $file = Str::after($filePath, 'temp/');

        Storage::disk('public')->move($filePath, '/images/'.$file);
        // $newUrl = Storage::disk('public')->url('images/' . $this->getFileName($filePath));
        
        return 'images/' . $file;
    }

    protected function movetToDocuments($filePath)
    {
        $file = Str::after($filePath, 'temp/');

        Storage::disk('local')->move($filePath, '/documents/'.$file);

        return 'documents/'.$file;
    }

}