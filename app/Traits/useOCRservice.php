<?php

namespace App\Traits;

use thiagoalessio\TesseractOCR\TesseractOCR;
use Imagick;
trait useOCRservice 
{
    public function preProcessImage($imagePath)
    {
        $imagick = new Imagick($imagePath);
        
        $width = $imagick->getImageWidth();
        $height = $imagick->getImageHeight();

        $imagick->resizeImage($width * 1, $height * 1, Imagick::FILTER_LANCZOS, 1);

        $imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);

        $imagick->contrastImage(8);
    
        $imagick->medianFilterImage(0.5);

        $imagick->reduceNoiseImage(2);

        $imagick->adaptiveSharpenImage(3, 1.1);

        $imagick->writeImage($imagePath);

        $imagick->clear();

        $imagick->destroy();
        
        return $this->extractText($imagePath);
    }

    public function convertPDFtoImage($pdfPath)
    {
        $imagick = new Imagick();
    

    try {
        $imagick->setResolution(300, 300);

        $imagick->readImage($pdfPath . '[0]');

        $imagick = $imagick->flattenImages();

        $imagick->setImageColorspace(Imagick::COLORSPACE_RGB);

        $imagick->setImageFormat('jpeg');

        $imagick->setImageCompression(Imagick::COMPRESSION_JPEG);
        $imagick->setImageCompressionQuality(90);

        $imagePath = str_replace('.pdf', '_page_1.jpeg', $pdfPath);

        $imagick->writeImage($imagePath);

        return $imagePath;
    } catch (Exception $e) {
        throw new Exception("PDF to image conversion failed: " . $e->getMessage());
    } finally {
        $imagick->clear();
        $imagick->destroy();
    }
    }
    public function preprocessDocument($imagePath)
    {
        $imagick = new Imagick($imagePath);

 //       $imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);

        $imagick->contrastImage(10);

        $imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);

        $imagick->thresholdImage(0.7 * Imagick::QUANTUM_RANGE);

        $imagick->contrastImage(9);
    
        $imagick->medianFilterImage(0.5);

        $imagick->reduceNoiseImage(3);

        $imagick->adaptiveSharpenImage(3, 1.1);

        $imagick->writeImage($imagePath);

        $imagick->clear();

        $imagick->destroy();
        
        return $this->extractText($imagePath);
    }

    private function extractText($imagePath)
    {
        $ocr = new TesseractOCR($imagePath);
        $ocr->lang('eng')->dpi(300);
        $text = $ocr->run();

        return $this->cleanUpText($text);
    }
    private function cleanUpText($text) 
    {
        $text = preg_replace("/[\r\n]+/", "\n", $text);
        
        $text = preg_replace("/[ ]+/", " ", $text);

        $text = str_replace(["\n", "_", "\"", "“", "”"], " ", $text);
        
        return $text;
    }

}