<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use App\Models\PublishedResearchProduction;
use App\Models\ResearchMonitoringForm;
use App\Models\Point;
use Illuminate\Support\Arr;
use App\Http\Requests\PublishedResearchProductionRequest;
use App\Models\AcademicYear;
use App\Models\Research;
use App\Models\ResearchDocument;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use Illuminate\Support\Facades\Storage;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Traits\useFileHandler;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class PublishedResearchProductionController extends Controller
{
    use HttpResponses;
    use PointsRating;
    use useFileHandler;

    public function index()
    {
        $publishedResearchProductions = ResearchMonitoringForm::with('publishedresearchprod.research', 'sdgMappings', 'agendaMappings')->where('users_id', auth()->id())->get();

        return $this->success($publishedResearchProductions, 'Published Research Productions Retrieved Successfully');
    }
    public function store(PublishedResearchProductionRequest $request)
    {
        // $allowed = AcademicYear::first();
        // $allowed = AcademicYear::latest()->first();

        $allowed = AcademicYear::where('is_submission_enable', true)->first();

        if (!$allowed) {
            return $this->error(null, "Submission is currently disabled.", 404);
        }

        if (!$allowed->is_submission_enable) {

            return $this->error(null, "Submission is currently disabled.", 404);
        }

        try {
            DB::beginTransaction();


            $researchForm = ResearchMonitoringForm::create([
                'users_id' => Auth::id(),
                'research_involvement_type_id' => $request->safe()->research_involvement_type,
                'status' => ResearchMonitoringFormStatus::PENDING,
                'reviewed_by' => null,
                'reviewed_at' => null
            ]);

            $researchForm->agendaMappings()->attach($request->safe()->agenda_mappings);
            $researchForm->sdgMappings()->attach($request->safe()->sdg_mappings);

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
                'title' => $request->safe()->published['title'],
                'authorship_nature' => $request->safe()->published['authorship_nature'],
                'authors' => $request->safe()->published['authors'],
                'research_field_id' => $request->safe()->published['research_field_id'],
                'research_type_id' => $request->safe()->published['research_type_id'],
                'socio_economic_objective_id' => $request->safe()->published['socio_economic_objective_id'],
                'user_id' => Auth::id()
            ];

            $research = Research::create($researchAttr);

            $publishedAttr = [
                'date' => $request->safe()->published['date'],
                'coverage' => $request->safe()->published['coverage'],
                'indexing' => $request->safe()->published['indexing'],
                'journal_name' => $request->safe()->published['journal_name'],
                'issno_vol_pages' => $request->safe()->published['issno_vol_pages'],
                'editor_publisher' => $request->safe()->published['editor_publisher'],
                'article_link' => $request->safe()->published['article_link'],
                'num_citations_date' => $request->safe()->published['num_citations_date'],
                'scopus_link' => $request->safe()->published['scopus_link'] ?? '',
                'researchmonitoringform_id' => $researchForm->id,
                'research_id' => $research->id
            ];

            PublishedResearchProduction::create($publishedAttr);

            $points = $request->published['points'];
            $rating = $this->rating($points);

            Point::create([
                'points' => $points,
                'rating' => $rating,
                'researchmonitoringform_id' => $researchForm->id
            ]);

            $user = auth()->user();

            $name = $user->getFullName();

            $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)
                                ->where('college', $user->college)
                                ->get()
                                ->filter(fn ($u) => $u->hasExactRoles(RoleEnum::RESEARCH_COORDINATOR));

            Notification::send($coordinators, new ResearchMonitoringFormNotification($name . ' submitted a research monitoring form.', '/research-monitoring-form/' . $researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Published research has been saved successfully!");
        } catch (Exception $e) {
            DB::rollback();

            return $this->error(null, "Error storing published research production: " . $e->getMessage(), 500);
        }
    }
    public function show(PublishedResearchProduction $published)
    {
        $published->load('researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings', 'researchmonitoringform.researchdocuments', 'researchmonitoringform.points');

        return $this->success($published, 'Data Retrieved Succesfully');
    }
    public function update(Request $request, PublishedResearchProduction $published) {}
    public function delete(PublishedResearchProduction $published)
    {
        $published->delete();

        return $this->success('', 'Published Research Production deleted succesfully');
    }
}
