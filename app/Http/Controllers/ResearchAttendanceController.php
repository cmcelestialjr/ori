<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ResearchAttendanceRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Models\ResearchAttendance;
use App\Models\ResearchMonitoringForm;
use App\Enums\DocumentStatus;
use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use App\Models\AcademicYear;
use App\Models\Point;
use App\Models\ResearchDocument;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\useFileHandler;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ResearchAttendanceController extends Controller
{
    use HttpResponses;
    use PointsRating;
    use useFileHandler;

    public function index()
    {
        $researchAttendance = ResearchMonitoringForm::where([
            ['users_id', '=', Auth::user()->id],
            ['research_involvement_type_id', '=', 5]
        ])->get();

        $researchAttendance->load('researchattendance.research', 'researchdocuments', 'sdgMappings', 'agendaMappings');

        return $this->success($researchAttendance, 'Research Attendance retrieved successfully');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(ResearchAttendanceRequest $request)
    {
        $allowed = AcademicYear::first();

        if(!$allowed->is_submission_enable) {

            return $this->error(null, "Submission is currently disabled.", 404);
        }

        try{
            DB::beginTransaction();


            $validated = $request->safe()->all();

            $points = $validated['participation']['points'];

            $user = auth()->user();

            $name = $user->getFullName();

           $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)
                                ->where('college', $user->college)
                                ->get()
                                ->filter(fn ($u) => $u->hasExactRoles(RoleEnum::RESEARCH_COORDINATOR));

            $exists = ResearchAttendance::where([
                ['date', "=", $validated['participation']['date']],
                ['organizer', "=",  $validated['participation']['organizer']],
                ['research_title', "=",  $validated['participation']['research_title']],
                ['coverage', "=", $validated['participation']['coverage']],
                ['place', "=", $validated['participation']['place']],
                ['attendance_nature', "!=",  $validated['participation']['attendance_nature']]
            ])->exists();

            if($exists){

                $participation = ResearchAttendance::where([
                    ['date', "=", $validated['participation']['date']],
                    ['organizer', "=",  $validated['participation']['organizer']],
                    ['research_title', "=",  $validated['participation']['research_title']],
                    ['coverage', "=", $validated['participation']['coverage']],
                    ['place', "=", $validated['participation']['place']],
                    ['attendance_nature', "!=",  $validated['participation']['attendance_nature']]
                ])->first();


                $participationPoints = $participation->researchmonitoringform->points->points;

                if($participationPoints >= $validated['participation']['points']){

                    $participation->researchmonitoringform->update([
                        'status' => ResearchMonitoringFormStatus::PENDING,
                    ]);

                    $pointsRating = $this->rating($points);

                    $participation->researchmonitoringform->points->update([
                        'points' => $points,
                        'rating' => $pointsRating
                    ]);

                    $participation->update([
                        'attendance_nature' => $validated['participation']['attendance_nature']
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
                                'status' => ResearchMonitoringFormStatus::PENDING,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }

                        ResearchDocument::insert($docs);

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
                'status' => ResearchMonitoringFormStatus::PENDING,
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
                    'status' => ResearchMonitoringFormStatus::PENDING,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            ResearchDocument::insert($docs);
        }
            $participation = [
                'date',
                'organizer',
                'research_title',
                'coverage',
                'place',
                'attendance_nature',
                'fund_source_nature',
                'conference_type',
                'researchmonitoringform_id'
            ];

            $participationAttr = array_intersect_key($validated['participation'], array_flip($participation));
            $participationAttr['researchmonitoringform_id'] = $researchForm->id;

            ResearchAttendance::create($participationAttr);

            $rating = $this->rating($points);

            Point::create([
            'points' => $points,
            'rating' => $rating,
            'researchmonitoringform_id' => $researchForm->id
            ]);


            Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Participation to research has been saved successfully!");

            }

            } catch(Exception $e){
                DB::rollback();

                return $this->error(null, "Error creating a participation to research record: ".$e->getMessage(), 403);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ResearchAttendance $attendance)
    {
        $attendance->load('researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings', 'researchmonitoringform.researchdocuments', 'researchmonitoringform.points');

        return $this->success($attendance, 'Data retrieved Succesfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ResearchAttendance $attendance)
    {
        $documents = $attendance->researchmonitoringform->researchdocuments;

        if($request->file_path){

            foreach($request->file_path as $index => $file){

                if($documents[$index]->status == DocumentStatus::REJECTED->value){

                    $path = $documents[$index]->file_path;

                    Storage::delete($path);

                    $documents[$index]->update(['file_path' => $file]);
                }
            }

            $attendance->update($request->validated());

            return $this->success($attendance, 'Update succesfull');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ResearchAttendance $attendance)
    {
        $attendance->delete();

        return $this->success('', 'Research Attendance Deleted Succesfully');

    }
}
