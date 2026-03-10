<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use
App\Http\Requests\CompletedResearchProductionRequest;
use App\Models\AcademicYear;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Models\ResearchMonitoringForm;
use App\Models\CompletedResearchProduction;
use App\Models\Point;
use App\Models\Research;
use App\Models\ResearchDocument;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\useFileHandler;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;

class CompletedResearchProductionController extends Controller
{
    use HttpResponses;
    use PointsRating;
    use useFileHandler;
    public function index()
    {
        $completedResearchProductions = ResearchMonitoringForm::where([
            ['users_id', '=', auth()->id()],
            ['research_involvement_type_id', '=', 2]
        ])->get();

        $completedResearchProductions->load('completedresearchprod.research', 'sdgMappings', 'agendaMappings');

        return $this->success($completedResearchProductions, 'Completed Research Production retrieved successfully');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(CompletedResearchProductionRequest $request)
    {
        // $allowed = AcademicYear::first();
        // $allowed = AcademicYear::latest()->first();

        // OR: Strictly grab the one that is enabled
        $allowed = AcademicYear::where('is_submission_enable', true)->first();
        if (!$allowed) {
            return $this->error(null, "Submission is currently disabled.", 404);
        }


        if(!$allowed->is_submission_enable) {

            return $this->error(null, "Submission is currently disabled.", 404);
        }

        try{
            DB::beginTransaction();


            $researchForm = ResearchMonitoringForm::create([
                'users_id' => Auth::id(),
                'research_involvement_type_id' => $request->validated('research_involvement_type'),
                'status' => ResearchMonitoringFormStatus::PENDING,
                'reviewed_by' => null,
                'reviewed_at' => null
            ]);

            $researchForm->agendaMappings()->attach($request->agenda_mappings);
            $researchForm->sdgMappings()->attach($request->sdg_mappings);

            $docs = [];

        if ($request->research_documents) {
            foreach ($request->research_documents as $file) {
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

            $researchAttr = [
                'title' => $request->completed['title'],
                'authorship_nature' => $request->completed['authorship_nature'],
                'authors' => $request->completed['authors'],
                'research_field_id' => $request->completed['research_field_id'],
                'research_type_id'=> $request->completed['research_type_id'],
                'socio_economic_objective_id' => $request->completed['socio_economic_objective_id'],
                'user_id' => Auth::id()
            ];

            $research = Research::create($researchAttr);


            $completedAttr = [
                'date_completed' => $request->completed['date_completed'],
                'nature_fund_source' => $request->completed['nature_fund_source'],
                'target_date_publication' => $request->completed['target_date_publication'],
                'researchmonitoringform_id' => $researchForm->id,
                'research_id' => $research->id
            ];

            CompletedResearchProduction::create($completedAttr);

            $rating = $this->rating($request->completed['points']);

            Point::create([
            'points' => $request->completed['points'],
            'rating' => $rating,
            'researchmonitoringform_id' => $researchForm->id
            ]);

            $user = auth()->user();

            $name = $user->getFullName();

            $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)
                                ->where('college', $user->college)
                                ->get()
                                ->filter(fn ($u) => $u->hasExactRoles(RoleEnum::RESEARCH_COORDINATOR));


            Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Completed research has been saved successfully!");

        }catch(Exception $e){
            DB::rollback();

            return $this->error(null, "Error creating a completed research record: ".$e->getMessage(), 403);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(CompletedResearchProduction $completed)
    {
        $completed->load( 'researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings', 'researchmonitoringform.points');

        return $this->success($completed, 'Completed Research Production retrieved successfully');
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CompletedResearchProduction $completedResearchProduction)
    {

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompletedResearchProduction $completedResearchProduction)
    {
        //
    }
}
