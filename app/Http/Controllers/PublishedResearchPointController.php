<?php

namespace App\Http\Controllers;

use App\Models\PublishedResearchPoint;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;

class PublishedResearchPointController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $points = PublishedResearchPoint::get();

        return $this->success($points);
    }
    public function update(Request $request, PublishedResearchPoint $points)
    {
        $points->update(['points' => $request->points]);

        return $this->success('', 'Points updated!');
    }
    public function getPoints(Request $request)
    {
        $points = PublishedResearchPoint::where('coverage', $request->coverage)->pluck('points');

        return $this->success($points[0]);
    }
}
