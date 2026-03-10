<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ResearchProductionRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Traits\HttpResponses;
use App\Models\ResearchProduction;
use App\Models\ResearchMonitoringForm;
use App\Models\User;

class ResearchProductionController extends Controller
{
    use HttpResponses;

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ResearchProductionRequest $req)
    {
        $req->validated();

        $researchId = ResearchMonitoringForm::where('users_id', Auth::id())->latest()->first()->id;
        
        $researchProduction = ResearchProduction::create([
            'research_title' => $req->research_title,
            'types_of_research' => $req->types_of_research,
            'field_of_randb' => $req->field_of_randb,
            'socioeconomic_objective' => $req->socioeconomic_objective,
            'authorship_nature' => $req->authorship_nature,
            'researchmonitoringform_id' => $researchId
        ]);
        
        // $researchMonitoringForm = ResearchProduction::where('researchmonitoringform_id', $researchId)->with(['researchmonitoringform', 'researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings'])->get();
        $researchProduction->load('researchmonitoringform', 'researchmonitoringform.sdgMappings', 'researchmonitoringform.agendaMappings');
        
        return $this->success([
            $researchProduction
        ], 'Research Production added succesfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
