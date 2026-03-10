<?php

namespace App\Http\Controllers;

use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;
use App\Models\ResearchInvolvementType;
use App\Models\ResearchMonitoringForm;
use App\Models\SdgMapping;
use App\Models\User;
use App\Traits\HttpResponses;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $totalCount = ResearchMonitoringForm::withoutGlobalScope('archive')->count();

        $highestPoints = User::query()
            ->join('research_monitoring_forms', 'users.id', '=', 'research_monitoring_forms.users_id')
            ->join('points', 'research_monitoring_forms.id', '=', 'points.researchmonitoringform_id')
            ->whereIn('research_monitoring_forms.status', [ResearchMonitoringFormStatus::APPROVED, ResearchMonitoringFormStatus::EVALUATED])
            ->where('research_monitoring_forms.is_archived', false)
            ->groupBy('users.id', 'users.lname', 'users.fname', 'users.mi', 'users.suffix')
            ->select(
                'users.id',
                'users.lname',
                'users.fname',
                'users.mi',
                'users.suffix',
                DB::raw('SUM(points.points) as total_points')
            )
            ->orderByDesc('total_points')
            ->first();


        $totalEvaluated = ResearchMonitoringForm::where('status', ResearchMonitoringFormStatus::EVALUATED)->count();

        $usersCount = User::role([RoleEnum::FACULTY, RoleEnum::RESEARCH_COORDINATOR])->count();

        $approvedResearch = ResearchMonitoringForm::where('status', ResearchMonitoringFormStatus::APPROVED)
            ->with([
                'points:researchmonitoringform_id,points,rating,id',
                'users' => function ($query) {

                    $query->select('id', 'fname', 'lname', 'mi', 'suffix', 'college');
                },
                'researchinvolvement:id,research_involvement_type'
            ])
            ->latest()
            ->take(5)
            ->get();

        $highestPoints['name'] = empty($highestPoints->id) ? null : $highestPoints->getFullName();

        $approvedResearch = $approvedResearch->map(function ($item) {

            $item->users->name = $item->users->getFullName();

            return $item;
        });

        $colleges = User::distinct()->pluck('college')->filter();

        $involvementTypes = ResearchInvolvementType::pluck('research_involvement_type');

        $defaultTemplate = array_fill_keys($involvementTypes->toArray(), 0);

        $default = ResearchMonitoringForm::withoutGlobalScope('archive')
            ->where('status', ResearchMonitoringFormStatus::APPROVED)
            ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED)
            ->with(['users', 'researchinvolvement'])
            ->get();

        //default chart
        $finalDefault = [];

        foreach ($default as $form) {
            $college = $form->users->college ?? 'Unknown';
            $involvement = $form->researchinvolvement->research_involvement_type ?? 'Unknown';

            if (!in_array($involvement, $involvementTypes->toArray())) continue;

            if (!isset($finalDefault[$college])) {
                $finalDefault[$college] = array_merge(['name' => $college, 'total_submission' => 0], $defaultTemplate);
            }

            $finalDefault[$college][$involvement]++;
            $finalDefault[$college]['total_submission']++; // Increment total submission count
        }

        foreach ($colleges as $college) {
            if (!isset($finalDefault[$college])) {
                $finalDefault[$college] = array_merge(['name' => $college, 'total_submission' => 0], $defaultTemplate);
            }
        }

        $finalDefault = array_values($finalDefault);


        //cas chart
        $currentYear = Carbon::now()->year;
        $pastTwoYears = [$currentYear, $currentYear - 1, $currentYear - 2];

        $CAS = "CAS";

        $cas = ResearchMonitoringForm::withoutGlobalScope('archive')
                ->where('status', ResearchMonitoringFormStatus::APPROVED)
                ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED)
                ->whereHas('users', function ($query) use ($CAS) {
                    $query->where('college', $CAS);
                })
                ->whereYear('created_at', '>=', $currentYear - 2)
                ->whereYear('created_at', '<=', $currentYear)
                ->selectRaw("YEAR(created_at) as year, COUNT(*) as total_submission")
                ->groupBy('year')
                ->orderBy('year')
                ->get();

                $finalCasResults = [];
                foreach ($pastTwoYears as $index => $year) {
                    $finalCasResults[] = [
                        'year' => (string) $year,
                        'total_submission' => $cas[$index]['total_submission'] ?? 0,
                    ];
                }

        //cme chart
        $CME = "CME";

        $cme = ResearchMonitoringForm::withoutGlobalScope('archive')
                ->where('status', ResearchMonitoringFormStatus::APPROVED)
                ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED)
                ->whereHas('users', function ($query) use ($CME) {
                    $query->where('college', $CME);
                })
                ->whereYear('created_at', '>=', $currentYear - 2)
                ->whereYear('created_at', '<=', $currentYear)
                ->selectRaw("YEAR(created_at) as year, COUNT(*) as total_submission")
                ->groupBy('year')
                ->orderBy('year')
                ->get();

                $finalCMEResults = [];
                foreach ($pastTwoYears as $index => $year) {
                    $finalCMEResults[] = [
                        'year' => (string) $year,
                        'total_submission' => $cme[$index]['total_submission'] ?? 0,
                    ];
                }


        //coe chart
        $COE = "COE";

        $coe = ResearchMonitoringForm::withoutGlobalScope('archive')
                ->where('status', ResearchMonitoringFormStatus::APPROVED)
                ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED)
                ->whereHas('users', function ($query) use ($COE) {
                    $query->where('college', $COE);
                })
                ->whereYear('created_at', '>=', $currentYear - 2)
                ->whereYear('created_at', '<=', $currentYear)
                ->selectRaw("YEAR(created_at) as year, COUNT(*) as total_submission")
                ->groupBy('year')
                ->orderBy('year')
                ->get();

                $finalCOEResults = [];
                foreach ($pastTwoYears as $index => $year) {
                    $finalCOEResults[] = [
                        'year' => (string) $year,
                        'total_submission' => $coe[$index]['total_submission'] ?? 0,
                    ];
                }


        $charts = [
            'default' => $finalDefault,
            'CAS' => $finalCasResults,
            'CME' => $finalCMEResults,
            'COE' => $finalCOEResults
        ];


        // $colleges = User::distinct('college')->pluck('college');
        // $sdgNames = SdgMapping::pluck('name')->map(fn($name) => strtolower(str_replace(' ', '_', $name)))->toArray();

        // $sdgData = $colleges->map(function ($college) use ($sdgNames) {
        //     $collegeData = ResearchMonitoringForm::query()
        //         ->join('users', 'research_monitoring_forms.users_id', '=', 'users.id')
        //         ->leftJoin('research_sdg', 'research_monitoring_forms.id', '=', 'research_sdg.research_monitoring_form_id')
        //         ->leftJoin('sdg_mappings', 'research_sdg.sdgmapping_id', '=', 'sdg_mappings.id')
        //         ->where('users.college', $college)
        //         ->select('sdg_mappings.name')
        //         ->get()
        //         ->groupBy('name')
        //         ->mapWithKeys(function ($submissions, $sdgName) {
        //             return [strtolower(str_replace(' ', '_', $sdgName)) => $submissions->count()];
        //         })
        //         ->toArray();

        //     $result = ['name' => $college];
        //     foreach ($sdgNames as $sdg) {
        //         $result[$sdg] = $collegeData[$sdg] ?? 0;
        //     }
        //     return $result;
        // })->toArray();

        // $charts = [
        //     'default' => array_values($results),
        //     'cas_chart' => null,
        //     'cme_chart' => null,
        //     'coe_chart' => null,
        // ];


        return $this->success([
            "total_users" => $usersCount,
            "highest_points" => $highestPoints,
            "total_count" => $totalCount,
            "total_evaluated" => $totalEvaluated,
            "recent_approved" => $approvedResearch,
            "charts" => $charts,
        ], 'Data retrieved succesfully');
    }

    public function submissions()
    {

        $research = ResearchMonitoringForm::where('status', ResearchMonitoringFormStatus::APPROVED)
            ->orWhere('status', ResearchMonitoringFormStatus::EVALUATED)
            ->with([
                'points:researchmonitoringform_id,points,rating,id',
                'users' => function ($query) {
                    $query->select('id', 'fname', 'lname', 'mi', 'suffix', 'college');
                },
                'researchinvolvement:id,research_involvement_type'
            ])
            ->latest()
            ->get();

        $research = $research->map(function ($item) {

            $item->users->name = $item->users->getFullName();

            return $item;
        });

        return $this->success($research, 'Data retrieved successfully');
    }

    public function generateFPES(User $user, Request $request)
    {
        $startDate = $request->query("startDate");
        $endDate = $request->query("endDate");

        $user->load(["researchmonitoringform" => function ($query) use ($startDate, $endDate) {
            $query->where('status', ResearchMonitoringFormStatus::EVALUATED)
                ->whereBetween("created_at", [$startDate, $endDate])
                ->with(["researchinvolvement:id,research_involvement_type", "points:researchmonitoringform_id,points,id"]);
        }]);

        $user['name'] = $user->getFullName();

        return $this->success($user);
    }
}
