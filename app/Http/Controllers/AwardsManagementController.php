<?php

namespace App\Http\Controllers;

use App\Models\AwardsManagement;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class AwardsManagementController extends Controller
{
    use HttpResponses;
    
    public function index()
    {
        $awards = AwardsManagement::get();

        return $this->success($awards);
    }
    public function update(Request $request, AwardsManagement $awards)
    {
        if($request->input('formData.min_range_points')) {

            $awards->update(['min_range_points' => $request->input('formData.min_range_points')]);
        }
        if($request->input('formData.max_range_points')) {

            $awards->update(['max_range_points' => $request->input('formData.max_range_points')]);
        }
        if($request->input('formData.incentive')) {

            $awards->update(['incentive' => $request->input('formData.incentive')]);
        }

        return $this->success('', 'Awards updated');
    }
    public function show(AwardsManagement $points)
    {
        return $this->success($points);
    }
}
