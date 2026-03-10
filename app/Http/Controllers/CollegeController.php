<?php

namespace App\Http\Controllers;

use App\Models\College;
use Illuminate\Http\Request;
use App\Traits\HttpResponses;

class CollegeController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $colleges = College::select('id', 'college')->get();


        return $this->success($colleges);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'string|required',
            'college' => 'string|required'
        ]);

        College::create($request->all());
    }
    public function destroy(College $college)
    {
        $college->delete();
        
        return response()->noContent();
    }
}
