<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Models\Point;
use App\Models\ResearchMonitoringForm;
use App\Models\ResearchInvolvementType;
use App\Models\ResearchDocument;
use App\Enums\RoleEnum;
use App\Enums\DocumentStatus;
use App\Models\AwardsManagement;
use App\Models\User;
use App\Notifications\PointsNotification;
use App\Notifications\ResearchMonitoringFormNotification;
use App\Traits\HttpResponses;
use App\Traits\useFileHandler;
use App\Traits\PointsRating;
use Gemini\Enums\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Number;
use Illuminate\Support\Facades\Storage;

class ResearchMonitoringFormController extends Controller
{
    use HttpResponses;
    use useFileHandler;
    use PointsRating;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->status;
        $search = $request->search;

        $user = Auth::user();

       if ($user->hasRole(RoleEnum::RESEARCH_COORDINATOR)) {
            $college = $user->college;
            $totalApproved = 0;
            $totalPending = 0;
            $totalRejected = 0;

            $name = auth()->user()->getFullName();

            $query = ResearchMonitoringForm::query()
                ->whereRelation('users', 'college', $college)
                ->latest();

            if ($status !== 'all') {
                $query->where('status', $status)
                    ->where(function ($q) use ($search) {
                        $q->whereRelation('researchinvolvement', 'research_involvement_type', 'LIKE', "%$search%")
                            ->orWhereRelation('users', function ($query) use ($search) {
                                $query->where('fname', 'LIKE', "%$search%")
                                    ->orWhere('lname', 'LIKE', "%$search%")
                                    ->orWhere('unit', 'LIKE', "%$search%");
                            });
                    });

                $monitoringForms = $query->paginate(5);
            } else {
                $monitoringForms = (clone $query)
                    ->orWhere('reviewed_by', $name)->paginate(5);

                $totalApproved = (clone $query)
                    ->where('status', ResearchMonitoringFormStatus::APPROVED)
                    ->count();

                $totalPending = (clone $query)
                    ->where('status', ResearchMonitoringFormStatus::PENDING)
                    ->count();

                $totalRejected = (clone $query)
                    ->where('status', ResearchMonitoringFormStatus::REJECTED)
                    ->count();
            }

            $monitoringForms->load('researchdocuments', 'researchinvolvement:id,research_involvement_type', 'users', 'points:id,points,rating,researchmonitoringform_id');

            return $this->success(['forms' => $monitoringForms, 'totalPending' => $totalPending, 'totalApproved' => $totalApproved, 'totalRejected' => $totalRejected], 'Data retrieved successfully');
        }
    }
    public function store(Request $request)
    {
        $request->validate(['research_involvement_type_id' => 'required|exists:research_involvement_types,id']);

        $researchForm = ResearchMonitoringForm::create([
            'users_id' => Auth::id(),
            'research_involvement_type_id' => $request->research_involvement_type_id,
            'status' => ResearchMonitoringFormStatus::PENDING,
            'reviewed_by' => null,
            'reviewed_at' => null
        ]);


        $docs = [];

        if ($request->file_path) {
            foreach ($request->file_path as $file) {
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


        $researchForm->agendaMappings()->attach($request->agendamapping_id);
        $researchForm->sdgMappings()->attach($request->sdgmapping_id);

        // $entities[] = ['users', 'researchdocuments', 'agendaMappings', 'sdgMappings', 'otherresearch', 'citations', 'production', 'attendancetoresearch', 'researchproduction.ongoing', 'researchproduction.completed', 'researchproduction.presented', 'researchproduction.published', 'creativeworksperformingarts', 'creativeworksexhibition', 'creativeworksliterary', 'creativeworksdesign'];

        $researchForm->load('researchdocuments:id,file_name,status,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');

        return $this->success($researchForm, "Research Monitoring form added");
    }
    public function researchInvolvementTypes()
    {
        $data = ResearchInvolvementType::where('enable', true)->select('id', 'research_involvement_type')
            ->get();

        return $this->success($data, "Showing Research Involvement Types");
    }
    public function show(ResearchMonitoringForm $researchMonitoringForm)
    {
        $researchInvolvement = $researchMonitoringForm->research_involvement_type_id;

        switch ($researchInvolvement) {

            case 1:
                $data = $researchMonitoringForm->fresh('completedresearchprod.research', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 2:
                $data = $researchMonitoringForm->fresh('presentedresearchprod', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 3:
                $data = $researchMonitoringForm->fresh('publishedresearchprod.research', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 4:
                $data = $researchMonitoringForm->fresh('citations', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 5:
                $data = $researchMonitoringForm->fresh('attendancetoresearch', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 6:
                $data = $researchMonitoringForm->fresh('intellectualproperty', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 7:
                $data = $researchMonitoringForm->fresh('peerReview', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;
            case 8:
                $data = $researchMonitoringForm->fresh('otherresearch', 'researchinvolvement:id,research_involvement_type', 'users', 'researchdocuments', 'points:id,points,rating,researchmonitoringform_id', 'sdgMappings', 'agendaMappings');
                break;

            default:
                return $this->error('', 'Involvement Type not found', 500);
        }

        return $this->success($data, 'Research Monitoring Form retrieved succesfully');
    }
    /**
     * Update the specified resource in storage.
     */

    public function updateCoordinator(Request $request, ResearchMonitoringForm $form)
    {
        $isRejected = false;
        $documents = $form->researchdocuments;
        $user = Auth::user();

        if (count($documents)  < 1 && $request->status[0] === DocumentStatus::REJECTED->value) {
            $isRejected = true;
        } else {

            foreach ($documents as $index => $document) {

                $doc = $request->status[$index];

                $document->update(['status' => $doc]);

                if ($doc == DocumentStatus::REJECTED->value) {
                    $isRejected = true;
                }
            };
        }
        if ($isRejected) {

            $form->update([
                'status' => ResearchMonitoringFormStatus::REJECTED,
                'reviewed_by' => $user->getFullName(),
                'reviewed_at' => now()->format('m/d/Y h:i a'),
                'rejected_message' => $request->rejected_message
            ]);
        } else {

            $form->update([
                'status' => ResearchMonitoringFormStatus::APPROVED,
                'reviewed_by' => $user->getFullName(),
                'reviewed_at' => now()->format('m/d/Y h:i a')
            ]);
        }

        $user = User::find($form->users_id);

        $admins = User::role(RoleEnum::ADMIN);

        $status = $isRejected ? ResearchMonitoringFormStatus::REJECTED->value : ResearchMonitoringFormStatus::APPROVED->value;

        Notification::send($admins, new ResearchMonitoringFormNotification('Research Monitoring Form has been ' . $status, 'admin/research-monitoring-form/' . $form->id, '', ''));

        $user->notify(new ResearchMonitoringFormNotification('Your research monitoring form has been ' . $status, 'faculty/research-monitoring-form/' . $form->id, $user->image_path ?? '', ''));

        return $this->success($form, 'Research Monitoring Form and Research Document status updated');
    }
    public function updateAdmin(Request $request, ResearchMonitoringForm $form)
    {
        $status = '';

        if ($request->status[0] === ResearchMonitoringFormStatus::REJECTED->value) {
            $form->update(['status' => ResearchMonitoringFormStatus::REJECTED, 'rejected_message' => $request->rejected_message]);

            $status = ResearchMonitoringFormStatus::REJECTED->value;
        } else {

            $form->update(['status' => ResearchMonitoringFormStatus::EVALUATED, 'evaluated_at' => now()->format('m/d/Y h:i a')]);

            $status = ResearchMonitoringFormStatus::EVALUATED->value;
        }

        if ($request->points) {

            $rating = $this->rating($request->points);

            $form->points->update(['points' => $request->points, 'rating' => $rating]);
        }

        $form->load('points');

        $user = User::find($form->users_id);

        $user->notify(new ResearchMonitoringFormNotification('Your research monitoring form has been ' . $status, 'faculty/research-monitoring-form/' . $form->id, $user->image_path ?? '', ''));

        return $this->success($form, 'Research Monitoring Approved!');
    }

    public function update(ResearchMonitoringForm $researchMonitoringForm, Request $request)
    {
        $researchdocs = ResearchDocument::find(2);


        return $researchdocs;
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ResearchMonitoringForm $researchMonitoringForm)
    {
        $researchMonitoringForm->load('researchdocuments');

        foreach ($researchMonitoringForm->researchdocuments as $file) {

            Storage::delete($file->getRawOriginal('file_path'));
        }

        $researchMonitoringForm->delete();

        return $this->success('', 'Research Monitoring Form deleted successfully');
    }
}
