<?php

namespace App\Http\Controllers;

use App\Http\Requests\PeerReviewStoreRequest;
use App\Enums\ResearchMonitoringFormStatus as EnumsResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use App\Models\AcademicYear;
use App\Models\PeerReview;
use App\Models\PeerReviewPoints;
use App\Models\Point;
use App\Models\ResearchDocument;
use App\Models\ResearchMonitoringForm;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Traits\useFileHandler;
// use App\Traits\useGeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Exception;

class PeerReviewController extends Controller
{
    use HttpResponses;
    // use useGeminiService;
    use useFileHandler;
    use PointsRating;

    public function store(PeerReviewStoreRequest $request)
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

            $points = $validated['peerjournal']['points'];

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
                'name',
                'journal_name',
                'article_title',
                'article_reviewed',
                'abstract_reviewed',
                'abstract_title',
                'coverage',
                'date_reviewed',
                'organization',
                'researchmonitoringform_id'
            ];

            $peerReviewAttr = array_intersect_key($validated['peerjournal'], array_flip($peerReviewFields));

            $peerReviewAttr['researchmonitoringform_id'] = $researchForm->id;

            PeerReview::create($peerReviewAttr);

            $rating = $this->rating($points);

            Point::create([
                'points' => $points,
                'rating' => $rating,
                'researchmonitoringform_id' => $researchForm->id
            ]);

            Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Peer review record created successfully.", 201);

        } catch(Exception $e)
        {
            DB::rollback();

            return $this->error(null, "Error creating peer review record: ".$e->getMessage(), 403);
        }
    }

    public function getPoints(Request $request)
    {
        if($request->abstract) {
            $points = PeerReviewPoints::where('coverage', $request->coverage)->first()->abstract_points;

            return $this->success($points);
        } else {

            $points = PeerReviewPoints::where('coverage', $request->coverage)->first()->article_points;

            return $this->success($points);
        }
    }

}
