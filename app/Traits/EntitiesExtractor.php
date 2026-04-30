<?php

namespace App\Traits;

// use Illuminate\Support\Str;
// // use App\Traits\useGeminiService;
// use App\Traits\useOCRservice;
// use App\Traits\HttpResponses;

trait EntitiesExtractor
{
    // use useOCRservice;
    // // use useGeminiService;
    // use HttpResponses;

    public function getCompletedResearchEntities($path)
    {
        // $completedPrompt = "Extract the research title and authors from this research page.\n";
        // $completedPrompt .= "Return in this following format:\n
        //                             {
        //                                 research_title: research_title_sample (must be lower case),
        //                                 authors: author1, author2 (lower case too)
        //                             }";
                                    
        // $entities = $this->ImagetoText($path, $completedPrompt);

        // $entities = json_decode(Str::between($entities, '```json', '```'));

        // return $entities;
    }
    public function getPresentedEntities($path)
    {
        // $Imageprompt = 'Can you analyze the image for me and get me the following information:

        //     1. Name of the recipient: Name of the person who received the certificate.
        //     2. Title of the Research: Name of the research or topic presented.
        //     3. Date of the conference: The duration of date the event was held: example format (Jun 2, 2024 or Jun 2-4, 2024).
        //     4. Name of the conference: Name of the event where the certificate was received.
        //     5. Location of the conference: Location and institution where the event took place.
        //     6. Organization of the conference: Who hosted and organizes the event.
        //     7. Type of Conference: Is it international, national/regional, university-wide, college-wide, or unit/department only.
        //     8. Points: Base on the type of conference, get me the points. International = 180,
        //     regional/national = 90, university-wide = 45, college-wide = 20, unit/department = 10.

        //     Now that you have the information, please return it in the following format:
        //         {
        //             "presenter_name": "",
        //             "presentation_title":,
        //             "date_presented": "",
        //             "conference_name": "",
        //             "conference_place": "",
        //             "conference_organization": "",
        //             "conference_type": "",
        //             "points": 0,
        //         }';

        // $entities = $this->ImagetoText($path, $Imageprompt);

        // $entities = json_decode(Str::between($entities, '```json', '```'));

        // return $entities;
    }
    public function getResearchAttendanceEntities($path)
    {
        // $Imageprompt = 'Can you analyze this certificate for me and get me the following information:

        //     1. Title of the Research/Activtiy/Training/Seminar: Title of the event.
        //     2. Organizer: A person, agency, or the organization that organizes the event.
        //     3. Date of the conference: The duration of date the event was held: example format (Jun 2, 2024 or Jun 2-4, 2024)..
        //     4. Nature of Attendance: Role or Nature of the person awarded by the certificate.
        //     5. Type of Conference: Type of conference/activity. Is it Managerial, Supervisory, Technical or Research Conference?
        //     6. Name of the person: Name of the person awarded by the certificate.
        //     7. Coverage: What is the coverage of the certificate? Is it international, regional/national, university/wide, college-wide, or unit/department activites only.
        //     8. Location of the conference: Location/place/institution where the event took place.
        //     Now that you have the information, please return it in the following format:
        //         {
        //             "research_title": "",
        //             "organizer":,
        //             "date": "",
        //             "attendance_nature": "",
        //             "conference_type": "",
        //             "name":,
        //             "coverage":,
        //             "place":
        //         }';

        // $entities = $this->ImagetoText($path, $Imageprompt);

        // $entities = json_decode(Str::between($entities, '```json', '```'));

        // return $entities;
    }
    public function getIntellectualPropertyEntities($path)
    {
        // $Imageprompt = 'Can you analyze the image for me and get me the following information in all lower case:

        //     1. Type of Intellectual Property: Type of intellectual property (utility model, trademark, patent/invention, copywrite, industrial design.
        //     2. Title of the Intellectual Property: Title of the intellectual property.
        //     3. Owner Name: Name of the owner of the intellectual property.
        //     4. Processor Name: Name of the processor of the intellectual property.
        //     5. Document ID: ID of the document.
        //     6. Registration Date: Date of registration.
        //     7. Publication Date: Date of publication otherwise null.
        //     8. Grant Date: Date of grant otherwise null.
        //     9. Expiry Date: Date of expiry otherwise null.

        //     Now that you have the information, please return it in the following format:
        //         {
        //         "type": "",
        //         "title":,
        //         "owner_name": "",
        //         "processor_name": "",
        //         "document_id":,
        //         "registration_date": "",
        //         "publication_date": "",
        //         "grant_date": "",
        //         "expiry_date": "",
        //         }';

        // $entities = $this->ImagetoText($path, $Imageprompt);

        // $entities = json_decode(Str::between($entities, '```json', '```'));

        // return $entities;
    }

    public function getPeerReviewEntities($path)
    {
        // $prompt = "I want you to analyze the image and check if it's a document for refereeing a peer-review article or abstract paper. If it does return to me the following in a json format: \n{

        //         'name': Name of the person awarded by the certificate,
        //         'certificate_id': Unique id of the certificate,
        //         'journal_name': Journal name of the peer-reviewed article or abstract,
        //         'article_title': Peer-reviewed research article, null if none,
        //         'article_reviewed': Number of articles reviewed,
        //         'abstract_reviewed': Or number of abstract reviewed,
        //         'authors': Authors of the peer-reviewed article or abstract,
        //         'date_reviewed': Date of the peer-reviewed certificate,
        //         'organization': Organization or agency that conduct your peer-review process,
        //         'coverage': Select the coverage of the journal reviewed: (LNU - if the coverage is within Leyte Normal University only, local - if its within the Philippines coverage, international - if its international, and ISI - if the journal is indexed in ISI)
        // }";
        // $entities = $this->ImagetoText($path, $prompt);

        // $entities = json_decode(Str::between($entities, '```json', '```'));

        // return $entities;

    }
    public function getOtherResearchEntities($path)
    {
    //     $prompt = 'Analyze the image and return a json format of the result: 
    //     {
    //             "date": Date of the document,
    //             "research_involvement": role of the user (adviser, statistician, panel, editor, etc),
    //             "isInvolvementToStudentTheses": true / false : true if the research involvement is for student theses, false otherwise
    //     }';

    //     $entities = $this->ImagetoText($path, $prompt);

    //     $entities = json_decode(Str::between($entities, '```json', '```'));

    //     return $entities;
    }
}
