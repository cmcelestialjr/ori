<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;
use Exception;

trait useGeminiService {

    public function ImagetoText($path, $prompt)
    {
        //  // --- BYPASS: SMART MOCK DATA (Refined) ---

        // // 1. Precise Detection using Path Segments
        // // This avoids any 'strpos' ambiguity. We look for the ID right after "certificate".
        // $segments = request()->segments();
        // $involvementId = null;
        // $certIndex = array_search('certificate', $segments);

        // if ($certIndex !== false && isset($segments[$certIndex + 1])) {
        //     $involvementId = $segments[$certIndex + 1];
        // }

        // // 2. Default to "Presenter" (Safe for Type 2)
        // $nature = "Presenter";

        // // 3. Switch to "Participant" ONLY for Type 5 (Participation)
        // if ($involvementId == '5') {
        //     $nature = "Participant";
        // }

        // // 4. Build the JSON
        // $mockData = [
        //     "isCertificate" => true,
        //     "document_match" => true,
        //     "name_match" => true,
        //     "year_match" => true,

        //     "date" => "June 2, 2024",
        //     "name" => "Cristobal A. Rabuya Jr.",

        //     // --- TITLES ---
        //     "title" => "Automated Monitoring Systems in Higher Education",
        //     "research_title" => "Automated Monitoring Systems in Higher Education",
        //     "presentation_title" => "Automated Monitoring Systems in Higher Education",
        //     "article_title" => "Automated Monitoring Systems in Higher Education",
        //     "abstract_title" => "Automated Monitoring Systems in Higher Education",

        //     // --- EVENTS & ORGANIZERS ---
        //     "conference_name" => "International Conference on Technology and Innovation",
        //     "conference_place" => "Manila, Philippines",
        //     "place" => "Manila, Philippines",
        //     "conference_organization" => "Global Tech Association",
        //     "organizer" => "Global Tech Association",
        //     "organization" => "Global Tech Association",

        //     // --- NATURE & TYPE ---
        //     "attendance_nature" => $nature,
        //     "presenter_name" => "Cristobal A. Rabuya Jr.", // Added explicitly for Type 2
        //     "conference_type" => "International",
        //     "conference_nature" => "Invitation",
        //     "property_type" => "Copyright",

        //     // --- PUBLICATION DETAILS ---
        //     "journal_name" => "International Journal of Computing",
        //     "issn" => "1234-5678",
        //     "vol_no" => "10",
        //     "issue_no" => "2",
        //     "editor_publisher" => "Global Tech Press",
        //     "article_link" => "https://example.com/article",
        //     "scopus_link" => "https://example.com/scopus",

        //     // --- IP DETAILS ---
        //     "patent_no" => "PH-12345-2024",
        //     "document_id" => "PH-12345-2024",
        //     "owner_name" => "Cristobal A. Rabuya Jr.",
        //     "processor_name" => "IPO Philippines",

        //     // --- DATES ---
        //     "date_presented" => "June 2, 2024",
        //     "date_published" => "June 2, 2024",
        //     "date_completed" => "June 2, 2024",
        //     "date_reviewed" => "June 2, 2024",
        //     "registration_date" => "June 2, 2024",
        //     "acceptance_date" => "June 2, 2024",
        //     "publication_date" => "June 2, 2024",
        //     "grant_date" => "June 2, 2024",
        //     "expiry_date" => "June 2, 2025",
        //     "target_date_publication" => "December 2024",
        // ];

        // $mockData['entities'] = $mockData;

        // $json = json_encode($mockData);

        // return "Here is the analysis of the image:\n```json\n" . $json . "\n```";

        //  // --- END OF BYPASS ---

        // $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=' . env('GEMINI_API_KEY');
    //     $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . env('GEMINI_API_KEY');



    //     $mimeType = mime_content_type($path);
    //     $base64Image = base64_encode(file_get_contents($path));


    //     $response = Http::timeout(120)->post($url, [
    //         'contents' => [
    //             [
    //                 'parts' => [
    //                     ['text' => $prompt],
    //                     [
    //                         'inlineData' => [
    //                             'mimeType' => $mimeType,
    //                             'data' => $base64Image
    //                         ]
    //                     ]
    //                 ]
    //             ]
    //         ]
    //     ]);


    //     if ($response->failed()) {
    //         $errorBody = $response->body();
    //         throw new Exception("Gemini API Error: " . $response->body());
    //     }

    //    return $response->json('candidates.0.content.parts.0.text');
    }

    public function TextGenerate($data, $prompt)
    {
        // return "This is a mock text response for testing purposes.";
        // $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=' . env('GEMINI_API_KEY');
        // $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . env('GEMINI_API_KEY');
        // $response = Http::timeout(120)->post($url, [
        //     'contents' => [
        //         [
        //             'parts' => [
        //                 ['text' => $data . "\n\n" . $prompt]
        //             ]
        //         ]
        //     ]
        // ]);

        // if ($response->failed()) {
        //     throw new Exception("Gemini API Error: " . $response->body());
        // }

        // return $response->json('candidates.0.content.parts.0.text');
    }

}
