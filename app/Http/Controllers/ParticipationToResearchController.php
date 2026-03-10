<?php

namespace App\Http\Controllers;

use App\Models\ParticipationToResearchPoint;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;

class ParticipationToResearchController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $points = ParticipationToResearchPoint::get();

        return $this->success($points);
    }

    public function update(Request $request)
    {
        $point = ParticipationToResearchPoint::where([['category', '=', $request->attendance_nature], ['coverage','=', $request->coverage]])->first();

        $point->update(['points' => $request->points]);

    }
    public function getPoints(Request $request)
    {
        $points = ParticipationToResearchPoint::where('category', strtolower($request->category))->where('coverage', strtolower($request->coverage))->first();

        $datePattern ='/(\w{3,})\s(\d+)\s?-\s?(\d+), \s(\d+),\s(\d{4})/';
  
        $duration = 1;
        $totalPoints = 0;
        
        if(preg_match($datePattern, $request->date, $matches)){
            $start_day = $matches[2];
            $end_day = $matches[3];

            $duration = $end_day - $start_day + 1;
        }

        
        switch($points->legend) {

            case "per hour": 
            $totalPoints = ($duration * 24) * $points->points;
            break;
            case "per day":
            $totalPoints = $duration * $points->points;
            case "per project":
            case "per presentation":

            $totalPoints = $points->points;
            break;

            default:
            return $this->error('','Error legend not found.', 404);
        }
        

        return $this->success($totalPoints);
    }
}
