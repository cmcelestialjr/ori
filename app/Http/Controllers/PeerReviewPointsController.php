<?php

namespace App\Http\Controllers;

use App\Models\PeerReviewPoints;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;

class PeerReviewPointsController extends Controller
{
    use HttpResponses;
    
    public function index()
    {
        $points = PeerReviewPoints::get();

        return $this->success($points);
    }
    public function update(Request $request, PeerReviewPoints $points)
    {
        if($request->input('formData.article_points')) {
            
            $points->update(['article_points' => $request->input('formData.article_points')]);
        }
        
        if($request->input('formData.abstract_points')) {
            
            $points->update(['abstract_points' => $request->input('formData.abstract_points')]);
        }


        return $this->success('', 'Points updated!');
    }
    public function show(PeerReviewPoints $points)
    {
        return $this->success($points);
    }
}
