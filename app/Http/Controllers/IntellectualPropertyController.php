<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus as EnumsResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use App\Http\Requests\IntellectualPropertyStoreRequest;
use App\Models\AcademicYear;
use App\Models\IntellectualProperty;
use App\Models\Point;
use App\Models\ResearchDocument;
use App\Models\ResearchMonitoringForm;
use App\Models\User;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\HttpResponses;
use App\Traits\PointsRating;
use App\Traits\useFileHandler;
use App\Traits\useGeminiService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class IntellectualPropertyController extends Controller
{
    use HttpResponses;
    use useGeminiService;
    use useFileHandler;
    use PointsRating;

    public function store(IntellectualPropertyStoreRequest $request)
    {
        try{

        DB::beginTransaction();

        $allowed = AcademicYear::first();

            if(!$allowed->is_submission_enable) {

                return $this->error(null, "Submission is currently disabled.", 404);
            }

        $validated = $request->safe()->all();

        $user = auth()->user();

        $name = $user->getFullName();

        $coordinators = User::role(RoleEnum::RESEARCH_COORDINATOR)
                                ->where('college', $user->college)
                                ->get()
                                ->filter(fn ($u) => $u->hasExactRoles(RoleEnum::RESEARCH_COORDINATOR));

        $points = $validated['intellectual']['points'];

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
        $intellectualFields = [
        'property_type',
        'title',
        'owner_name',
        'processor_name',
        'document_id',
        'registration_date',
        'acceptance_date',
        'publication_date',
        'grant_date',
        'expiry_date',
        'researchmonitoringform_id'
        ];

        $intellectualAttr = array_intersect_key($validated['intellectual'], array_flip($intellectualFields));

        $intellectualAttr['researchmonitoringform_id'] = $researchForm->id;

        IntellectualProperty::create($intellectualAttr);

        $rating = $this->rating($points);

        Point::create([
        'points' => $points,
        'rating' => $rating,
        'researchmonitoringform_id' => $researchForm->id
        ]);

        Notification::send($coordinators, new ResearchMonitoringFormNotification($name.' submitted a research monitoring form.', '/research-monitoring-form/'.$researchForm->id, $user->image_path ?? '', $name));

        DB::commit();

        return $this->success($researchForm->id, "Intellectual property has been saved successfully!");

    }catch(Exception $e)
    {
        DB::rollback();

        return $this->error(null, "Error creating intellectual property record: ".$e->getMessage(), 403);
    }
    }
}
