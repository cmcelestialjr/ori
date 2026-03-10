<?php

namespace App\Http\Controllers;

use App\Models\UtilityPatentCopywrite;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class UtilityPatentCopywriteController extends Controller
{
    use HttpResponses;
    
    public function index()
    {
        $points = UtilityPatentCopywrite::get();

        return $this->success($points);
    }
    public function update(Request $request, UtilityPatentCopywrite $points)
    {
        $points->update(['points' => $request->points]);

        return $this->success('', 'Points updated');
    }
    public function getPoints(Request $request)
    {
        if($request->stage) {
            $points = UtilityPatentCopywrite::where([['inclusion', '=', $request->type],['status', $request->stage]])->first()->points;
            return $this->success($points);
        }

        $points = UtilityPatentCopywrite::where('inclusion', $request->type)->first()->points;

        if($request->type === 'copyright') {
            if(!$request->isLNU) {
                return $this->success(0);
            }
        }
        
        return $this->success($points);
    }
}
