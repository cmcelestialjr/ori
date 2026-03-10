<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use App\Http\Requests\CitationsRequest;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Models\Point;
use App\Models\Citation;
use App\Models\ResearchDocument;
use App\Models\ResearchMonitoringForm;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\useFileHandler;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class CitationsController extends Controller
{
    use HttpResponses;
    use PointsRating;
    use useFileHandler;

    public function index()
    {
        $citations = ResearchMonitoringForm::where([
            ['users_id', '=', Auth::user()->id],
            ['research_involvement_type_id', '=', 6]
        ])->get();

        $citations->load('citations', 'sdgMappings', 'agendaMappings');

        return $this->success($citations, 'Citations retrieved successfully');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(CitationsRequest $request)
    {

        $allowed = AcademicYear::first();

        if(!$allowed->is_submission_enable) {

            return $this->error(null, "Submission is currently disabled.", 404);
        }

        try{
            DB::beginTransaction();


            $validated = $request->safe()->all();

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
            $citationFields = [
                    'cited_authors',
                    'cited_article_title',
                    'scopus_link',
                    'research_title',
                    'authors',
                    'journal_title',
                    'issno_vol_pages',
                    'date',
                    'publisher_name',
                    'url_link',
                    'researchmonitoringform_id'
                ];

            $citationsAttr = array_intersect_key($validated['citations'], array_flip($citationFields));
            $citationsAttr['researchmonitoringform_id'] = $researchForm->id;

            Citation::create($citationsAttr);

            $points = $validated['citations']['points'];

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


            Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

            DB::commit();

            return $this->success($researchForm->id, "Citation has been saved successfully!");

        }catch(Exception $e){
            DB::rollback();

            return $this->error(null, "Error creating a Citation research record: ".$e->getMessage(), 403);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Citation $citation)
    {
        $citation->load('researchmonitoringform', 'publishedresearchprod','researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings', 'researchmonitoringform.points');

        return $this->success($citation, 'Data retrieved succesfull');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Citation $citation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Citation $citation)
    {
        $citation->delete();

        return $this->success('', 'Citation deleted succesfully');
    }
}
