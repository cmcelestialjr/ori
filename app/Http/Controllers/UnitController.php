<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    use HttpResponses;

    public function index(Request $request)
    {
        $units = Unit::whereRelation('college', 'college', $request->college)->select('id', 'unit')->get();

        return $this->success($units);
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'string',
            'unit' => 'string|required',
            'college_id' => 'required'
        ]);

        Unit::create($request->all());
    }
    public function destroy(Unit $unit)
    {
        $unit->delete();
        
        return response()->noContent();
    }
}
