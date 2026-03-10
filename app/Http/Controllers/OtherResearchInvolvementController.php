<?php

namespace App\Http\Controllers;

use App\Enums\DocumentStatus;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use App\Http\Requests\OtherResearchInvolvementRequest;
use App\Enums\ResearchMonitoringFormStatus as EnumsResearchMonitoringFormStatus;
use App\Models\AcademicYear;
use App\Models\CompletedStudentThesesInvolvementPoint;
use App\Models\InternalExternalResearchPoint;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Models\OtherResearchInvolvement;
use App\Models\ResearchMonitoringForm;
use App\Models\Point;
use App\Models\ResearchDocument;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\useFileHandler;
use App\Traits\useGeminiService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class OtherResearchInvolvementController extends Controller
{
    use HttpResponses;
    use useGeminiService;
    use useFileHandler;
    use PointsRating;

    public function index()
    {
        $otherResearchInvolvement = ResearchMonitoringForm::where([
            ['users_id', '=', Auth::user()->id],
            ['research_involvement_type_id', '=', 8]
        ])->get();

        $otherResearchInvolvement->load('otherresearch', 'researchdocuments', 'sdgMappings', 'agendaMappings');

        return $this->succes($otherResearchInvolvement, 'Data Retrieved Succefully');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(OtherResearchInvolvementRequest $request)
    {

        $allowed = AcademicYear::first();

            if(!$allowed->is_submission_enable) {

                return $this->error(null, "Submission is currently disabled.", 404);
            }

        try{

            DB::beginTransaction();

            $validated = $request->safe()->all();

            $user = auth()->user();

            $name = $user->getFullName();

            $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)->where('college', $user->college)->get();

            $points = $validated['otherresearch']['points'];

            $researchForm = ResearchMonitoringForm::create([
                'users_id' => auth()->id(),
                'research_involvement_type_id' => $validated["research_involvement_type"],
                'status' => EnumsResearchMonitoringFormStatus::PENDING,
                'reviewed_by' => null,
                'reviewed_at' => null
            ]);

            $researchForm->agendaMappings()->attach($validated['agenda_mappings']);
            $researchForm->sdgMappings()->attach($validated['sdg_mappings']);

            $docs = [];

        if ($validated['research_documents']) {
            foreach ($validated['research_documents'] as $file) {
                $filePath = $this->movetToDocuments($file);
                $docs[] = [
                    'file_path' => $filePath,
                    'researchmonitoringform_id' => $researchForm->id,
                    'status' => EnumsResearchMonitoringFormStatus::PENDING,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            ResearchDocument::insert($docs);
        }
            $peerReviewFields = [
                'research_involvement',
                'research_title',
                'fund_source_nature',
                'date',
                'researchmonitoringform_id'
            ];

            $otherResearchAttr = array_intersect_key($validated['otherresearch'], array_flip($peerReviewFields));

            $otherResearchAttr['researchmonitoringform_id'] = $researchForm->id;

            OtherResearchInvolvement::create($otherResearchAttr);

            $rating = $this->rating($points);

            Point::create([
                'points' => $points,
                'rating' => $rating,
                'researchmonitoringform_id' => $researchForm->id
            ]);

            Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Other research record created successfully.", 201);

        } catch(Exception $e)
        {
            DB::rollback();

            return $this->error(null, "Error creating other research record: ".$e->getMessage(), 403);
        }
    }

    public function validateDocument(Request $request)
    {
        if(!Storage::disk('local')->exists($request->certificate)) {
            return $this->error('', 'File not found', 500);
        }

        $user = auth()->user();

        $fullName = $user->getFullName();

        $path = Storage::disk('local')->path($request->certificate);


                $prompt = 'I want to check if this image matches a specific document type. Here are the lists of documents you need to look:
                    1. A special order document issued by Leyte Normal University,
                    2. A certificate format document,
                    3. A concept paper or proposal document of a research,

                return a json format of the result:
                {
                    "valid": true / false : true if the image matches the any of document type, false otherwise,

                    if valid is true, provide these details:
                    "data": {
                        "date": Date of the document,
                        "research_involvement": role of the user (adviser, statistician, panel, editor, etc),
                        "name": Does the '.$fullName.' name appear in the document? Return the name if it does, otherwise return null,
                }

                }';
                if(mime_content_type($path) === 'application/pdf') {

                    $convertedImagePath = $this->convertPDFtoImage($path);

                    $response = $this->ImagetoText($convertedImagePath, $prompt);

                    $convertedImage = 'temp/'.basename($convertedImagePath);

                    Storage::delete($convertedImage);

                } else {

                    $response = $this->ImagetoText($path, $prompt);

                }

                $entities = json_decode(Str::between($response, '```json', '```'));

                if(!$entities->valid) {
                    return $this->error($entities, 'Invalid Document.', 400);
                }
                if(empty($entities->data->name)) {
                    return $this->error($entities, 'Please upload your own research involvement.', 400);
                }

                return $this->success(['entities' =>$entities], 'Valid intellectual property');

    }
    public function getPoints(Request $request)
    {
        if($request->funded_research) {
            $involvementCompletedStudent = CompletedStudentThesesInvolvementPoint::where('research_involvement', $request->research_involvement)->first()->$request->school_level;
        }

        $points = InternalExternalResearchPoint::where('research_involvement', $request->research_involvement)->first();

        return $this->success(['internal_external' => $points, 'student_theses_points' => $involvementCompletedStudent ?? 0], 'Data Retrieved Succesfully');

    }
    /**
     * Display the specified resource.
     */
    public function show(OtherResearchInvolvement $otherInvolvement)
    {
        $otherInvolvement->load('researchmonitoringform.researchdocuments', 'researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings', 'researchmonitoringform.points');

        return $this->succes($otherInvolvement, 'Data Retrieved Succesfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OtherResearchInvolvement $otherInvolvement)
    {
        $documents = $otherInvolvement->researchmonitoringform->researchdocuments;

        if($request->file_path){

            foreach($request->file_path as $index => $file){

                if($documents[$index]->status == DocumentStatus::REJECTED->value){

                    $path = $documents[$index]->file_path;

                    Storage::delete($path);

                    $documents[$index]->update(['file_path' => $file]);
                }
            }

            $otherInvolvement->update($request->validated());

            return $this->success($otherInvolvement, 'Other Research Involvement Updated Succesfully');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OtherResearchInvolvement $otherInvolvement)
    {
        $otherInvolvement->delete();

        return $this->success('', 'Data deleted succesfully');
    }
}
