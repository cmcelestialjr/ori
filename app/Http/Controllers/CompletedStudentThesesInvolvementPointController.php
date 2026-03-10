<?php

namespace App\Http\Controllers;

use App\Models\CompletedStudentThesesInvolvementPoint;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class CompletedStudentThesesInvolvementPointController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $points = CompletedStudentThesesInvolvementPoint::get();

        return $this->success($points);
    }
    public function update(Request $request, CompletedStudentThesesInvolvementPoint $points)
    {
        if($request->input('formData.undergraduate_points')) {

            $points->update(['undergraduate_points' => $request->input('formData.undergraduate_points')]);
        }
        if($request->input('formData.graduate_points')) {

            $points->update(['graduate_points' => $request->input('formData.graduate_points')]);
        }
        if($request->input('formData.dissertation')) {

            $points->update(['dissertation' => $request->input('formData.dissertation')]);
        }

        return $this->success('', 'Points updated!');
    }
    public function show(CompletedStudentThesesInvolvementPoint $points)
    {
        return $this->success($points);
    }
}
