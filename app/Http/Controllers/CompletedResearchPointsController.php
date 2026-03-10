<?php

namespace App\Http\Controllers;

use App\Models\CompletedResearchPoints;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;

class CompletedResearchPointsController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $points = CompletedResearchPoints::first();

        return $this->success($points);
    }

    public function update(Request $request)
    {
        // 1. Try to get the very first points record
        $points = CompletedResearchPoints::first();

        // 2. THE FIX: If it doesn't exist (returns null), CREATE it instead of updating!
        if (!$points) {
            CompletedResearchPoints::create([
                'points' => $request->points
            ]);
        } else {
            // 3. If it DOES exist, it is safe to update it
            $points->update([
                'points' => $request->points
            ]);
        }

        return $this->success('', 'Points updated successfully');
    }
}
