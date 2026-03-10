<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;

use App\Traits\HttpResponses;
use App\Models\AcademicYear;
use App\Models\User;
use App\Models\ResearchMonitoringForm;
use App\Notifications\ResearchMonitoringFormNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon; // Add this at the top

class AcademicYearController extends Controller
{

    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $academic = AcademicYear::first();

        return $this->success($academic);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'academic_year' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'submission_status' => 'boolean'
        ]);

        $input = $request->all();


        if ($request->has('start_date')) {
            $input['start_date'] = Carbon::parse($request->start_date)->format('Y-m-d');
        }
        if ($request->has('end_date')) {
            $input['end_date'] = Carbon::parse($request->end_date)->format('Y-m-d');
        }

        $academic = AcademicYear::create($input);

        return response()->json($academic);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AcademicYear $academic)
    {
        $request->validate([
            'academic_year' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'submission_status' => 'boolean'
        ]);

        $input = $request->all();

        
        if ($request->has('start_date')) {
            $input['start_date'] = Carbon::parse($request->start_date)->format('Y-m-d');
        }
        if ($request->has('end_date')) {
            $input['end_date'] = Carbon::parse($request->end_date)->format('Y-m-d');
        }

        $academic->update($input);

        return response()->json($academic);
    }

    public function updateStatus(Request $request, AcademicYear $academic)
    {


        $academic->update([
            'is_submission_enable' => filter_var($request->submission_status, FILTER_VALIDATE_BOOLEAN)
        ]);

        $faculty = User::role(RoleEnum::FACULTY)->get();

        Notification::send($faculty, new ResearchMonitoringFormNotification("Research Monitoring Form Submission has now been ".($request->submission_status ? "opened" : "closed"), ($request->submission_status ? "/create/research-monitoring-form" : ""), "", ""));

        return $this->success($academic->fresh(), "Submission status updated successfully");


    }

    public function getArchived(Request $request)
    {
        $archived = ResearchMonitoringForm::withoutGlobalScope('archive')
                                    ->where('is_archived', true)
                                    ->with([
                                        'researchinvolvement:id,research_involvement_type',
                                        'points:researchmonitoringform_id,points,rating,id',
                                        'users' => function ($query) {
                                            $query->select('id', 'fname', 'lname', 'mi', 'suffix', 'college');
                                        },
                                    ])

                                    ->when($request->college, function ($query) use ($request) {
                                        $query->whereHas('users', function ($q) use ($request) {
                                            $q->where('college', $request->college);
                                        });
                                    })
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

    public function archiveSubmissions()
    {
        ResearchMonitoringForm::where('is_archived', false)->update(['is_archived' => true]);

        $faculty = User::role(RoleEnum::FACULTY)->get();

        Notification::send($faculty, new ResearchMonitoringFormNotification("Research Monitoring Form Submission has now been archived", "/faculty/archived", "", ""));

        return $this->success(null, "Research Monitoring Form Submission has now been archived");

    }
}
