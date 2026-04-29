<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Models\AcademicYear;
use App\Models\AgendaMapping;
use App\Models\AwardsManagement;
use App\Models\Citation;
use App\Models\CompletedResearchProduction;
use App\Models\IntellectualProperty;
use App\Models\Point;
use App\Models\PresentedResearchProduction;
use App\Models\PublishedResearchProduction;
use App\Models\ResearchAttendance;
use App\Models\ResearchMonitoringForm;
use App\Models\SdgMapping;
use App\Notifications\PointsNotification;
// use App\Traits\EntitiesExtractor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
// use App\Traits\useGeminiService;
// use App\Traits\useOCRservice;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Number;

class FacultyController extends Controller
{
    use HttpResponses;
    // use useGeminiService;
    // use useOCRservice;
    // use EntitiesExtractor;
    use PointsRating;

    public function index(Request $request)
    {
        $user = auth()->user();

        $totalSubmission = ResearchMonitoringForm::where('users_id', $user->id)->count();

        $forms = ResearchMonitoringForm::where('users_id', $user->id)
                                        ->with(['researchinvolvement:id,research_involvement_type',
                                        'points:researchmonitoringform_id,points,rating,id',])
                                        ->latest()
                                        ->get()
                                        ->take(5);

        $totalPoints = Point::whereRelation('researchmonitoringform', function ($query) use ($user) {
            $query->where('users_id', $user->id)
                    ->where(function ($query) {
                        $query->where('status', ResearchMonitoringFormStatus::APPROVED)
                            ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED);
                    });
        })->sum('points');

        $rating = $this->rating($totalPoints);

        $awards = AwardsManagement::get();

        foreach ($awards as $index => $award) {

            if ($totalPoints > ((70 / 100) * $award->min_range_points) && $totalPoints < $award->max_range_points && !Session::has('points-notified')) {

                    $user->notify(new PointsNotification("Keep Going! You're just " . ($award->min_range_points - $totalPoints) . " points away from reaching the " . Number::ordinal($index + 1) . " special citation award! Keep submitting your research involvement and earn more points!", '/create/research-monitoring-form', '', ''));

                    Session::put('points-notified', true);
                }
            }

            $data = [
                'recent' => $forms,
                'totalPoints' => $totalPoints,
                'totalSubmission' => $totalSubmission,
                'rating' => $rating,
            ];

            return $this->success($data, 'Data retrieved successfully');
    }

    public function monitoringForms(Request $request)
    {
        $user = auth()->user();

    //    $academic = AcademicYear::first();
        // $academic = AcademicYear::latest()->first();
        $academic = AcademicYear::where('is_submission_enable', true)->first();

        // $isAllowed = $academic->is_submission_enable;
        // $isAllowed = $academic ? $academic->is_submission_enable : false;
        $isAllowed = $academic ? true : false;

       $forms = ResearchMonitoringForm::where('users_id', $user->id)
                                        ->with(['researchinvolvement:id,research_involvement_type',
                                        'points:researchmonitoringform_id,points,rating,id',])
                                        ->latest()
                                        ->get();

       return $this->success([
        'forms' => $forms,
        'enable' => $isAllowed
       ]);

    }

    public function validateDocument(Request $request)
    // {
    //     $file = $request->file_path;
    //     if(!Storage::exists($file)){
    //         return $this->error(null, 'File not found.', 404);
    //     }

    //     $path = Storage::disk('local')->path($request->file_path);

    //     $user = auth()->user();
    //     $fullName = $user->getFullName();

    //     $sdg = SdgMapping::get()->pluck('name')->toArray();
    //     $agenda = AgendaMapping::get()->pluck('name')->toArray();

    //     $sdgList = "SDG:\n";
    //         foreach ($sdg as $index => $name) {
    //             $sdgList .= ($index + 1) . ". " . $name . "\n";
    //         }

    //     $agendaList = "Agenda:\n";
    //         foreach ($agenda as $index => $name) {
    //             $agendaList .= ($index + 1) . ". " . $name . "\n";
    //         }

    //         $prompt = "Please extract the text content from the following image:\n\n";
    //         $prompt .= "\n\nOnce you have the text, please perform the following validations and selections:\n\n";

    //         $prompt .= "1. Determine the actual type of the document based on its content:\n";
    //         $prompt .= "- A *research document* must include: (a) a clear research title, (b) author(s) information, and (c) must NOT contain the word 'certificate'.\n";
    //         $prompt .= "- A *certificate* document must contain: (a) the word 'certificate', (b) the name of the recipient, and (c) a date.\n";
    //         $prompt .= "- If these conditions are not met, the document does not qualify as either type.\n";
    //         $prompt .= "Note: Even if the expected document type is 'certificate', a valid research document may still be accepted.\n";
    //         $prompt .= "Note: IF THE DOCUMENT IS NOT A RESEARCH OR CERTIFICATE DOCUMENT, return document_match: false immediately.\n";
    //         $prompt .= "Given (expected) document type: " . $request->type . "\n\n";

    //         // 2. Name Validation
    //         $prompt .= "2. Check whether the provided name appears as the certificate recipient or among the authors:\n";
    //         $prompt .= "Name to validate: " . $fullName . "\n\n";

    //         // 3. Year Validation
    //         $prompt .= "3. Verify that the document is dated within the current year (2024).\n\n"; // Replace with dynamic year in production

    //     $prompt .= "Fourth, select the best Sustainable Development Growth and Agenda base on the research title present on the document attached.\n";
    //     $prompt .= $sdgList;
    //     $prompt .= $agendaList;


    //     switch($request->involvement_type)
    //     {
    //         case 1:
    //         {
    //             $prompt .= "Fifth, extract to me the research title, authors, and isPublished boolean if the completed research is already published.\n";
    //             $prompt .= "Sixth, return to me the following properties in this format:\n";
    //             $prompt .= "{
    //                     document_match = return true or false if the document is ".$request->type.",
    //                     name_match = 90 (percent),
    //                     year_match = true (boolean)
    //                     sdg = [1,5,2],
    //                     agenda = [2,3],
    //                     entities:
    //                     {
    //                         title = sample research title (lower case),
    //                         authors = author1, author2 (lower case),
    //                         isPublished = false (boolean)
    //                     }
    //                 }";

    //                 if(mime_content_type($path) === 'application/pdf') {

    //                         $convertedImagePath = $this->convertPDFtoImage($path);

    //                         $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                         $convertedImage = 'temp/'.basename($convertedImagePath);

    //                         Storage::delete($convertedImage);

    //                 } else {

    //                     $result = $this->ImagetoText($path, $prompt);

    //                 }

    //                     $result = json_decode(Str::between($result, '```json', '```'));

    //                     if(!$result->document_match){
    //                         return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                     }
    //                     if($result->name_match < 80){
    //                         return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                     }
    //                     // if(!$result->year_match){
    //                     //     return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                     // }

    //                     if(!empty($result->entities->isPublished) && $result->entities->isPublished){
    //                         return $this->error(null,'Invalid Document. Research is already published.', 403);
    //                     }

    //                     $researchTitle = $result->entities->title;
    //                     $exists = CompletedResearchProduction::whereRelation('research', 'title', strtolower($researchTitle))->whereRelation('research','user_id', auth()->id())->exists();

    //                     if($exists) {
    //                         return $this->error($researchTitle, "Invalid Document. You already submitted this document.", 403);
    //                     }
    //         }
    //         break;
    //         case 2:
    //         {
    //             $prompt .= "Fifth, analyze the image for me and get me the following information:\n

    //                 1. Name of the recipient: Name of the person who received the certificate.\n
    //                 2. Title of the Research: Name of the research or topic presented.\n
    //                 3. Date of the conference: The duration of date the event was held: example format (Jun 2, 2024 or Jun 2-4, 2024).\n
    //                 4. Name of the conference: Name of the event where the certificate was received.\n
    //                 5. Location of the conference: Location and institution where the event took place.\n
    //                 6. Organization of the conference: Who hosted and organizes the event.\n
    //                 7. Type of Conference: Is it international, national/regional, university-wide, college-wide, or unit/department only (lower case)\n
    //                 8. Nature of Attendance: Role or Nature of the person awarded by the certificate. Examples: presenter, moderator, tabulator, coordinator, etc..\n";

    //             $prompt .= 'Sixth, Now that you have the information, please return it in the following format. Must be all in lower case:
    //                     {
    //                         document_match = return true or false if the document is '.$request->type.',\n
    //                         name_match: 90 (percent),\n
    //                         year_match: true (boolean)\n
    //                         sdg: [1,5,2],
    //                         agenda: [2,3],
    //                         entities:
    //                         {
    //                         presenter_name: "",
    //                         presentation_title:"",
    //                         date_presented: "",
    //                         conference_name: "",
    //                         conference_place: "",
    //                         conference_organization: "",
    //                         conference_type: "",
    //                         attendance_nature: "",
    //                         }
    //                     }';

    //                     if(mime_content_type($path) === 'application/pdf') {

    //                         $convertedImagePath = $this->convertPDFtoImage($path);

    //                         $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                         $convertedImage = 'temp/'.basename($convertedImagePath);

    //                         Storage::delete($convertedImage);

    //                     } else {


    //                         $result = $this->ImagetoText($path, $prompt);

    //                     }
    //                     $result = json_decode(Str::between($result, '```json', '```'));


    //                         if(!$result->document_match){
    //                             return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                         }
    //                         if($result->name_match < 80){
    //                             return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                         }
    //                         if(!$result->year_match){
    //                             return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                         }



    //                           $exists = PresentedResearchProduction::where([
    //                                     ['presentation_title', '=', $result->entities->presentation_title],
    //                                     ['date_presented', '=', $result->entities->date_presented],
    //                                     ['conference_name', '=', $result->entities->conference_name],
    //                                     ['conference_organization', '=', $result->entities->conference_organization]
    //                                     ])->exists();

    //                                     if($exists) {
    //                                         return $this->error($result->entities, "Invalid Document. You already submitted this document.", 403);
    //                                     }

    //                         if(strtolower($result->entities->attendance_nature) !== 'presenter'){
    //                             return $this->error(null, "Invalid Document. Certificate is not a presented type.",403);
    //                         }




    //         }
    //         break;
    //         case 3: {

    //             $prompt .= "Fifth, extract to me the research title, authors, and isPublished boolean if the completed research is already published.\n";
    //             $prompt .= "Sixth, return to me the following properties in this format:\n";
    //             $prompt .= "{
    //                     document_match = return true or false if the document is ".$request->type.",
    //                     name_match = 90 (percent),
    //                     year_match = true (boolean)
    //                     sdg = [1,5,2],
    //                     agenda = [2,3],
    //                     entities:
    //                     {
    //                     title = sample research title (lower case),
    //                     authors = author1, author2 (lower case),
    //                     isPublished = false (boolean)
    //                     }
    //                 }";

    //                 if(mime_content_type($path) === 'application/pdf') {

    //                     $convertedImagePath = $this->convertPDFtoImage($path);

    //                     $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                     $convertedImage = 'temp/'.basename($convertedImagePath);

    //                     Storage::delete($convertedImage);

    //             } else {

    //                 $result = $this->ImagetoText($path, $prompt);

    //             }

    //                     $result = json_decode(Str::between($result, '```json', '```'));

    //                     if(!$result->document_match){
    //                         return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                     }
    //                     if($result->name_match < 80){
    //                         return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                     }
    //                     if(!$result->year_match){
    //                         return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                     }

    //                     $researchTitle = $result->entities->title;
    //                     $exists = PublishedResearchProduction::whereRelation('research', 'title', strtolower($researchTitle))->exists();

    //                     if($exists) {
    //                         return $this->error($researchTitle, "Invalid Document. You already submitted this document.", 403);
    //                     }

    //             break;
    //         }
    //         case 4:
    //             $prompt .= "Fifth, extract to me the research title, authors, and isPublished boolean if the completed research is already published.\n";
    //             $prompt .= "Sixth, return to me the following properties in this format:\n";
    //             $prompt .= "{
    //                     document_match = return true or false if the document is ".$request->type.",
    //                     name_match = 90 (percent),
    //                     year_match = true (boolean)
    //                     sdg = [1,5,2],
    //                     agenda = [2,3],
    //                     entities:
    //                     {
    //                         research_title = sample research title (lower case),
    //                         authors = author1, author2 (lower case),
    //                     }
    //                 }";

    //                 if(mime_content_type($path) === 'application/pdf') {

    //                     $convertedImagePath = $this->convertPDFtoImage($path);

    //                     $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                     $convertedImage = 'temp/'.basename($convertedImagePath);

    //                     Storage::delete($convertedImage);

    //             } else {

    //                 $result = $this->ImagetoText($path, $prompt);

    //             }

    //                     $result = json_decode(Str::between($result, '```json', '```'));

    //                     if(!$result->document_match){
    //                         return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                     }
    //                     if($result->name_match < 80){
    //                         return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                     }
    //                     if(!$result->year_match){
    //                         return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                     }



    //             break;
    //             case 5:
    //                 $prompt .= "1. Title of the Research/Activtiy/Training/Seminar: Name or title of the event where the certificate was received.
    //                             2. Organizer: A person, agency, or the organization that organizes the event.
    //                             3. Date of the conference: The duration of date the event was held: example format (Jun 2, 2024 or Jun 2-4, 2024)..
    //                             4. Nature of Attendance: Role or Nature of the person awarded by the certificate. Examples: presenter, moderator, tabulator, coordinator, etc..
    //                             5. Type of Conference: Type of conference/activity. Is it Managerial, Supervisory, Technical or Research Conference?
    //                             6. Name of the person: Name of the person awarded by the certificate.
    //                             7. Coverage: What is the coverage of the certificate? Is it international, regional/national, university/wide, college-wide , or unit/department activites only (lower case).
    //                             8. Location of the conference: Location and institution where the event took place.\n";
    //                 $prompt .= "Sixth, return to me the following properties in this format. Must be all in lower case: \n";
    //                 $prompt .= "{
    //                         document_match = return true or false if the document is ".$request->type.",
    //                         name_match = 90 (percent),
    //                         year_match = true (boolean)
    //                         sdg = [1,5,2],
    //                         agenda = [2,3],
    //                         entities:
    //                         {
    //                             research_title: ,
    //                             organizer:,
    //                             date: ,
    //                             attendance_nature: ,
    //                             conference_type: ,
    //                             name:,
    //                             coverage:,
    //                             place:
    //                         }
    //                     }";

    //                     if(mime_content_type($path) === 'application/pdf') {

    //                         $convertedImagePath = $this->convertPDFtoImage($path);

    //                         $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                         $convertedImage = 'temp/'.basename($convertedImagePath);

    //                         Storage::delete($convertedImage);

    //                 } else {

    //                     $result = $this->ImagetoText($path, $prompt);

    //                 }

    //                         $result = json_decode(Str::between($result, '```json', '```'));

    //                         if(!$result->document_match){
    //                             return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                         }
    //                         if($result->name_match < 80){
    //                             return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                         }
    //                         if(!$result->year_match){
    //                             return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                         }

    //                         $exists = ResearchAttendance::where([
    //                             ['date', '=', $result->entities->date],
    //                             ['organizer', '=', $result->entities->organizer],
    //                             ['research_title', '=', $result->entities->research_title],
    //                             ['attendance_nature', '=', strtolower($result->entities->attendance_nature)]
    //                         ])->exists();

    //                         $presented = PresentedResearchProduction::where([
    //                             ['date_presented', '=', $result->entities->date],
    //                             ['conference_name', '=', $result->entities->research_title],
    //                         ])->exists();

    //                         if($presented) {
    //                             return $this->error(null, "You already submitted a presented research for this event. For multiple involvement only the highest points is credited.", 403);
    //                         }

    //                         if(strtolower($result->entities->attendance_nature === 'presenter')){
    //                             return $this->error(null, "For presented research, please select the Presented Research option as the research involvement type.",403);
    //                         }

    //                         if($exists) {

    //                             return $this->error(null, 'Invalid Document. You already submitted this document.', 403);
    //                         }

    //                 break;

    //             case 6: {

    //                 $prompt .= 'Fifth, Can you analyze the image for me and get me the following information in all lower case:\n

    //                             1. Type of Intellectual Property: Type of intellectual property (utility model, trademark, patent/invention, copyright, industrial design.\n
    //                             2. Title of the Intellectual Property: Title of the intellectual property.\n
    //                             3. Owner Name: Name of the owner of the intellectual property.\n
    //                             4. Processor Name: Name of the processor of the intellectual property.\n
    //                             5. Document ID: ID of the document.\n
    //                             6. Registration Date: Date of registration.\n
    //                             7. Publication Date: Date of publication otherwise null.\n
    //                             8. Grant Date: Date when was the intellectual property granted otherwise null.\n
    //                             9. Expiry Date: Date until the intellectual property expires otherwise null.\n

    //                             Now that you have the information, please return it in the following format:\n
    //                                 {
    //                                     document_match = return true or false if the document is '.$request->type.',,
    //                                     name_match = 90 (percent),
    //                                     year_match = true (boolean)
    //                                     sdg = [1,5,2],
    //                                     agenda = [2,3],
    //                                     entities:
    //                                     {

    //                                         "property_type": "",
    //                                         "title":,
    //                                         "owner_name": "",
    //                                         "processor_name": "",
    //                                         "document_id":,
    //                                         "registration_date": "",
    //                                         "publication_date": "",
    //                                         "grant_date": "",
    //                                         "expiry_date": "",

    //                                  }';

    //                     if(mime_content_type($path) === 'application/pdf') {

    //                         $convertedImagePath = $this->convertPDFtoImage($path);

    //                         $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                         $convertedImage = 'temp/'.basename($convertedImagePath);

    //                         Storage::delete($convertedImage);

    //                     } else {

    //                         $result = $this->ImagetoText($path, $prompt);
    //                     }

    //                         $result = json_decode(Str::between($result, '```json', '```'));

    //                         if(!$result->document_match){
    //                             return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                         }
    //                         if($result->name_match < 80){
    //                             return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                         }
    //                         if(!$result->year_match){
    //                             return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                         }

    //                         $exists = IntellectualProperty::where([
    //                             ['title', '=', $result->entities->title],
    //                             ['type', '=', $result->entities->property_type],
    //                             ['owner_name', '=', $result->entities->owner_name],
    //                             ['document_id', '=', $result->entities->document_id],
    //                         ])->exists();

    //                         if($exists) {

    //                             return $this->error(null, 'Invalid Document. You already submitted this document.', 403);

    //                         }

    //                 break;
    //             }

    //             case 7: {

    //                 "I want you to analyze the image and check if it's a document for refereeing a peer-review article or abstract paper. If it does return to me the following in a json format: \n{

    //             'name': Name of the person awarded by the certificate,
    //             'certificate_id': Unique id of the certificate,
    //             'journal_name': Journal name of the peer-reviewed article or abstract,
    //             'article_title': Peer-reviewed research article, null if none,
    //             'article_reviewed': Number of articles reviewed,
    //             'abstract_reviewed': Or number of abstract reviewed,
    //             'authors': Authors of the peer-reviewed article or abstract,
    //             'date_reviewed': Date of the peer-reviewed certificate,
    //             'organization': Organization or agency that conduct your peer-review process,
    //             'coverage': Select the coverage of the journal reviewed: (LNU - if the coverage is within Leyte Normal University only, local - if its within the Philippines coverage, international - if its international, and ISI - if the journal is indexed in ISI)
    //     }";

    //                 $prompt .= 'Fifth, Can you analyze the image for me and get me the following information in all lower case:\n

    //                             name: Name of the person awarded by the certificate,\n
    //                             journal_name: Journal name of the peer-reviewed article or abstract,\n
    //                             abstract_title: Peer-reviewed research article, null if none,\n
    //                             article_reviewed: Number of articles reviewed,\n
    //                             abstract_title: Title of the abstract that has been reviewed,\n
    //                             abstract_reviewed: Number of abstract reviewed,\n
    //                             date_reviewed: Date of the peer-reviewed certificate,\n
    //                             organization: Organization or agency that conduct your peer-review process,\n
    //                             coverage: Select the coverage of the journal reviewed: ("LNU" - if the coverage is within Leyte Normal University only, "local" - if its within the Philippines coverage, "international" - if its international, and "ISI" - if the journal is indexed in ISI)\n

    //                             Now that you have the information, please return it in the following format:\n
    //                                 {
    //                                     document_match = return true or false if the document is '.$request->type.',,
    //                                     name_match = 90 (percent),
    //                                     year_match = true (boolean)
    //                                     sdg = [1,5,2],
    //                                     agenda = [2,3],
    //                                     entities:
    //                                     {

    //                                         name: "",\n
    //                                         journal_name: "",\n
    //                                         article_title: "",\n
    //                                         article_reviewed: "",\n
    //                                         abstract_title: "",\n
    //                                         abstract_reviewed: "",\n
    //                                         date_reviewed: "",\n
    //                                         organization: "",\n
    //                                         coverage: "",\n

    //                                  }';

    //                     if(mime_content_type($path) === 'application/pdf') {

    //                         $convertedImagePath = $this->convertPDFtoImage($path);

    //                         $result = $this->ImagetoText($convertedImagePath, $prompt);

    //                         $convertedImage = 'temp/'.basename($convertedImagePath);

    //                         Storage::delete($convertedImage);

    //                     } else {

    //                         $result = $this->ImagetoText($path, $prompt);
    //                     }

    //                         $result = json_decode(Str::between($result, '```json', '```'));

    //                         if(!$result->document_match){
    //                             return $this->error($result, 'Invalid Document. Document is not a '.$request->type, 403);
    //                         }
    //                         if($result->name_match < 80){
    //                             return $this->error($result, 'Invalid Document. Please upload your own document.', code: 403);
    //                         }
    //                         if(!$result->year_match){
    //                             return $this->error('current year: 2024', 'Invalid Document. Document must be within the current year.', 403);
    //                         }

    //                         $exists = IntellectualProperty::where([
    //                             ['title', '=', $result->entities->title],
    //                             ['type', '=', $result->entities->property_type],
    //                             ['owner_name', '=', $result->entities->owner_name],
    //                             ['document_id', '=', $result->entities->document_id],
    //                         ])->exists();

    //                         if($exists) {

    //                             return $this->error(null, 'Invalid Document. You already submitted this document.', 403);

    //                         }

    //                 break;
    //             }
    //     }


    //     return $this->success($result);
    // }
    {
        
    }

    public function archivedSubmission(Request $request)
    {
        $archived = ResearchMonitoringForm::withoutGlobalScope('archive')
                                    ->where('is_archived', true)
                                    ->where('users_id', auth()->id())
                                    ->with([
                                        'researchinvolvement:id,research_involvement_type',
                                        'points:researchmonitoringform_id,points,rating,id',
                                        'users' => function ($query) {
                                            $query->select('id', 'fname', 'lname', 'mi', 'suffix', 'college');
                                        },
                                    ])

                                    ->when($request->name, function ($query) use ($request) {
                                        $query->whereHas('users', function ($q) use ($request) {
                                            $q->where('fname', 'like', "%{$request->name}%")
                                            ->orWhere('lname', 'like', "%{$request->name}%");
                                        });
                                    })
                                    ->when($request->research_involvement_type, function ($query) use ($request) {
                                        $query->whereHas('researchinvolvement', function ($q) use ($request) {
                                            $q->where('id', (int) $request->research_involvement_type);
                                        });
                                    })
                                    ->when($request->points, function ($query) use ($request) {
                                        $query->whereHas('points', function ($q) use ($request) {
                                            $q->where('points', 'like', "%{$request->points}%");
                                        });
                                    })
                                    ->when($request->start_date && $request->end_date, function ($query) use ($request) {
                                        $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
                                    })
                                    ->latest()
                                    ->get();


        $archived = $archived->map(function ($item) {
            $item->users->name = $item->users->getFullName();
            return $item;
        });

        return $this->success($archived);
    }
}
