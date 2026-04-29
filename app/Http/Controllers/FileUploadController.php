<?php

namespace App\Http\Controllers;

use App\Models\PresentedResearchProduction;
use App\Models\ResearchAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Traits\HttpResponses;
// use App\Traits\useGeminiService;
// use App\Traits\useOCRservice;

class FileUploadController extends Controller
{
    use HttpResponses;
    // use useGeminiService;
    // use useOCRservice;

    public function uploadPublic(Request $req)
    {
        $temp = Storage::disk('public')->putFile('temp',$req->file('image_path'));

        return $this->success([
            'image_path' => $temp
        ], 'File Uploaded Successfully');
    }
    
    public function uploadPrivate(Request $req)
    {
        $filePaths = [];

        if (!$req->hasFile('evidence_path')) {
            return $this->error('', 'File not found', 500);
        };

        foreach ($req->file('evidence_path') as $file) {
            $filePaths[] = Storage::disk('local')->putFile('temp',$file);
        }
        return $this->success($filePaths, 'Documents Uploaded Successfully');
    }

    // public function certificate($involvement, $certificate)
    // {
    //     $filePath = 'temp/'.$certificate;

    //     if(!Storage::exists( $filePath)) {
    //         return $this->error('', 'File not found', 500);
    //     }

    //     $user = auth()->user();

    //     $prompt = "Analyze this certificate and return to me the following propery in this format:
    //         {
    //             isCertificate: return true or false if the image is indeed a certificate,
    //             date: if it's a cerificate, return the duration of date the event was held: example format (Jun 2, 2024 or Jun 2-4, 2024),
    //             name: if it's a certificate, return the presenter name the certificate was given to otherwise null,
    //             research_title: if it's a certificate, return the research title or topic of the certificate. Do not include the theme,
    //             conference_name:if it's a certificate, return the conference or event name otherwise null,
    //             attendance_nature: if it's a certficate, return the attendance nature of the person awarded by the certificate (prensenter, moderator, organizer, etc.).
    //         }";

    //     $imagePath = Storage::disk('local')->path($filePath);

    //     if(mime_content_type($imagePath) === 'application/pdf') {

    //         $convertedImagePath = $this->convertPDFtoImage($imagePath);

    //         $result = $this->ImagetoText($convertedImagePath, $prompt);

    //         $convertedImage = 'temp/'.basename($convertedImagePath);

    //         Storage::delete($convertedImage);

    //     } else {

    //         $result = $this->ImagetoText($imagePath, $prompt);

    //     }


    //     $entities = json_decode(Str::between($result, '```json', '```'));

    //     if(!$entities->isCertificate){
    //         return $this->error('', 'Invalid file. Please upload a certificate.', 403);
    //     }

    //     //2024 for testing
    //     if(!Str::contains($entities->date, '2024', true)){
    //         return $this->error('', 'Invalid Certificate. Certificate must be within the current year.', 403);
    //     }

    //     $name = $user->getFullName();

    //     similar_text($name, $entities->name, $p);

    //     if($p < 80){
    //         return $this->error($p, 'Invalid certificate. Please upload your own certificate.', code: 403);
    //     }

    //     if($involvement === '2') {
    //         $exists = PresentedResearchProduction::where('conference_name', $entities->conference_name)->where('date_presented', $entities->date)->exists();

    //         if($exists) return $this->error('', 'Invalid file. You already submitted this certificate.', 403);

    //     };

    //     if($involvement === '5') {

    //         if(Str::contains($entities->attendance_nature, 'presenter', true)){

    //             return $this->error('','For research presentation, you can select Presented Research instead.', 403);
    //         }

    //         $exists = ResearchAttendance::where('research_title', $entities->conference_name)->where('date',$entities->date)->where('attendance_nature', strtolower($entities->attendance_nature))->exists();

    //         if($exists) {
    //             return $this->error($entities, 'Invalid file. You already submitted this certificate.', 403);
    //         }

    //         // $multiple = ResearchAttendance::where([
    //         //     ['research_title
                
    //         //     ', '=', $entities->conference_name],
    //         //     ['date', '=', $entities->date]
    //         // ])->exists();
    //     }


    //     return $this->success($entities, 'Certificate is allowed.');

    // }
}
