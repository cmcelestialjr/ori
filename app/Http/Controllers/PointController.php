<?php

namespace App\Http\Controllers;

use App\Models\Point;
use App\Models\ResearchMonitoringForm;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Enums\ResearchMonitoringFormStatus;
use App\Enums\RoleEnum;

class PointController extends Controller
{
    use HttpResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if($user->hasRole(RoleEnum::FACULTY)) {

            $points = Point::whereRelation('researchmonitoringform', 'users_id', $user->id)->whereRelation('researchmonitoringform', 'status', ResearchMonitoringFormStatus::EVALUATED)->get();
            
            $totalPoints = $points->pluck('points')->sum();

        }

        if($user->hasRole(RoleEnum::ADMIN)) {

            $points = Point::whereRelation('researchmonitoringform', 'status', ResearchMonitoringFormStatus::EVALUATED)->get();
            
            $totalPoints = $points->pluck('points')->sum();

        }

        return $this->success($totalPoints, ' Total Points');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function firstSemester(Request $request)
    {
        $firstSemStart = Carbon::createFromDate(null, 1, 1);
        $firstSemEnd = Carbon::createFromDate(null, 6, 30);

        $points = Point::whereRelation('researchmonitoringform', 'users_id', auth()->id())
                         ->whereRelation('researchmonitoringform', 'status', ResearchMonitoringFormStatus::EVALUATED)
                         ->whereBetween('updated_at',[$firstSemStart, $firstSemEnd])
                         ->orderBy('created_at', 'asc');

        $totalPoints = $points->pluck('points')->sum();

        return $this->success($totalPoints);
    }
    public function secondSemester(Request $request)
    {

        $secondSemStart = Carbon::createFromDate(null, 1, 1);
        $secondSemStart = Carbon::createFromDate(null, 11, 30);

        $points = Point::whereRelation('researchmonitoringform', 'users_id', auth()->id())
                         ->whereBetween('created_at',[ $secondSemStart, $secondSemStart])
                         ->orderBy('created_at', 'asc');

        $totalPoints = $points->pluck('points')->sum();

        return $this->success($totalPoints);
    }

    /**
     * Display the specified resource.
     */
    public function show(Point $point)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Point $point)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Point $point)
    {
        //
    }
}
