<?php

namespace App\Http\Controllers;

use App\Models\InternalExternalResearchPoint;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class InternalExternalResearchPointController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $points = InternalExternalResearchPoint::get();

        return $this->success($points);
    }
    public function update(Request $request, InternalExternalResearchPoint $points)
    {
        if($request->input('formData.points')) {
            
            $points->update(['points' => $request->input('formData.points')]);
        }
        
        if($request->input('formData.ceiling_points')) {
            
            $points->update(['ceiling_points' => $request->input('formData.ceiling_points')]);
        }

        return $this->success('', 'Points updated!');

        return $this->success('', 'Points updated');
    }
    public function show(InternalExternalResearchPoint $points)
    {
        return $this->success($points);
    }
}
