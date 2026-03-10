<?php

namespace App\Http\Controllers;

use App\Models\CitationPoint;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CitationPointController extends Controller
{
    use HttpResponses;
    
    public function index()
    {
        $points = CitationPoint::get();

        return $this->success($points);
    }
    public function update(Request $request, CitationPoint $points)
    {
        $points->update(['points' => $request->points]);

        return $this->success('', 'Points updated');
    }
    public function getPoints(Request $request)
    {
        $points = CitationPoint::where('scopus', filter_var($request->scopus, FILTER_VALIDATE_BOOLEAN))->pluck('points');

        $totalPoints = CitationPoint::get()->pluck('points');

        $user = auth()->user();

        $userAuthor = $user->getFullName(); 

        if(Str::contains($request->citedAuthors, $userAuthor,true)){

            $points = 0;
        }

        return $this->success([
            'total' => $totalPoints,
            'points' => $points
        ]);
    }
}
