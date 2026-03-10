<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\PresentedResearchProductionRequest;
use App\Http\Requests\UpdatePresentedRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Models\PresentedResearchProduction;
use App\Models\ResearchMonitoringForm;
use App\Models\Point;
use App\Enums\DocumentStatus;
use App\Enums\ResearchMonitoringFormStatus as EnumsResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use App\Models\AcademicYear;
use App\Models\Research;
use App\Models\ResearchAttendance;
use App\Models\ResearchDocument;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Notifications\ResearchMonitoringFormStatus;
use App\Traits\useFileHandler;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class PresentedResearchProductionController extends Controller
{
    use HttpResponses;
    use PointsRating;
    use useFileHandler;

    public function index()
    {
        $presented = ResearchMonitoringForm::where([
            ['users_id', '=', Auth::user()->id],
            ['research_involvement_type_id', '=', 3]
        ])->get();

        $presented->load('presentedresearchprod.research', 'researchdocuments', 'sdgMappings', 'agendaMappings');

        return $this->success($presented, 'Presented Research Production retrieved successfully');
    }
    public function store(PresentedResearchProductionRequest $request)
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

           $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)
                                ->where('college', $user->college)
                                ->get()
                                ->filter(fn ($u) => $u->hasExactRoles(RoleEnum::RESEARCH_COORDINATOR));


            $points = $validated['presented']['points'];

            $exists = ResearchAttendance::where([
                ['date', "=", $validated['presented']['date_presented']],
                ['organizer', "=",  $validated['presented']['conference_organization']],
                ['research_title', "=",  $validated['presented']['presentation_title']],
                ['coverage', "=", $validated['presented']['conference_nature']],
                ['place', "=", $validated['presented']['conference_place']],
            ])->exists();

            if($exists){

                $participation = ResearchAttendance::where([
                    ['date', "=", $validated['presented']['date_presented']],
                    ['organizer', "=",  $validated['presented']['conference_organization']],
                    ['research_title', "=",  $validated['presented']['conference_name']],
                    ['coverage', "=", $validated['presented']['conference_nature']],
                    ['place', "=", $validated['presented']['conference_place']],
                ])->first();


                $participationPoints = $participation->researchmonitoringform->points->points;

                if($participationPoints >= $points){

                    $participation->researchmonitoringform->update([
                        'status' => EnumsResearchMonitoringFormStatus::PENDING,
                    ]);

                    $pointsRating = $this->rating($points);

                    $participation->researchmonitoringform->points->update([
                        'points' => $points,
                        'rating' => $pointsRating
                    ]);


                    $docs = $participation->researchmonitoringform->researchdocuments;

                    foreach($docs as $doc) {

                        $doc->delete();
                    }

                    $researchId = $participation->researchmonitoringform->id;

                    $docs = [];

                    if ($validated['research_documents']) {
                        foreach ($validated['research_documents'] as $file) {
                            $filePath = $this->movetToDocuments($file);
                            $docs[] = [
                                'file_path' => $filePath,
                                'researchmonitoringform_id' =>  $researchId,
                                'status' => EnumsResearchMonitoringFormStatus::PENDING,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }

                        ResearchDocument::insert($docs);

                        $participation->delete();

                        DB::commit();

                        Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'. $researchId, $user->image_path ?? '', $name));

                        return $this->success($researchId, "Participation to research has been updated successfully!");

                }

            } else {

                return $this->error(null, "For multiple involvement in one activity, only the highest points is credited.", 403);
            }

            } else {

            $researchForm = ResearchMonitoringForm::create([
                'users_id' => Auth::id(),
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
            $presentedFields = ['date_presented', 'conference_name', 'conference_type', 'conference_nature', 'conference_place', 'conference_organization', 'presentation_title', 'presenter_name'];

            $presentedAttr = array_intersect_key($validated['presented'], array_flip($presentedFields));

            $presentedAttr['conference_type'] = strtolower($presentedAttr['conference_type']);
            $presentedAttr['researchmonitoringform_id'] = $researchForm->id;

            PresentedResearchProduction::create($presentedAttr);

            $rating = $this->rating($points);

            Point::create([
            'points' => $points,
            'rating' => $rating,
            'researchmonitoringform_id' => $researchForm->id
            ]);

    
            Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Presented research has been saved successfully!");

        }

        }catch(Exception $e)
        {
            DB::rollback();

            return $this->error(null, "Error creating a presented research record: ".$e->getMessage(), 403);
        }
    }

    public function update(PresentedResearchProduction $presented, UpdatePresentedRequest $request)
    {
        $documents = $presented->researchmonitoringform->researchdocuments;

        if ($request->file_path) {

            foreach ($request->file_path as $index => $file) {

                if ($documents[$index]->status == DocumentStatus::REJECTED->value) {

                    $path = $documents[$index]->file_path;

                    Storage::delete($path);

                    $documents[$index]->update(['file_path' => $file]);
                }
            }

            $presented->update($request->validated());

            return $this->success($presented, 'Presented Updated Succesfully');
        }
    }
    public function show(PresentedResearchProduction $presented)
    {
        $presented->load(
                'researchmonitoringform.researchdocuments',
                'researchmonitoringform.sdgMappings',
                'researchmonitoringform.agendaMappings',
                'researchmonitoringform.points');

        return $this->success($presented, 'Data Retrieved Succesfully');
    }

    public function destroy(PresentedResearchProduction $presented)
    {
        $presented->delete();

        return $this->success('', 'Presented Research Production Deleted Successfully');
    }
}
