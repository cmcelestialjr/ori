<?php

namespace App\Http\Controllers;

use 
App\Http\Requests\OngoingResearchProductionRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Traits\HttpResponses;
use App\Models\OngoingResearchProduction;
use App\Models\ResearchProduction;
use App\Models\ResearchMonitoringForm;

class OngoingResearchProductionController extends Controller
{
    use HttpResponses;
    
    public function index()
    {
        $ongoingResearchProductions = OngoingResearchProduction::where('researchproduction_id', ResearchProduction::latest()->first()->id)->get();

        return $this->success([
            $presentedResearchProductions
        ], 'Ongoing Research Production retrieved successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OngoingResearchProductionRequest $request)
    {
        $request->validated();

        $researchProdId = ResearchProduction::where('researchmonitoringform_id', $researchId)->latest()->first()->id;

        $ongoingResearchProduction= OngoingResearchProduction::create([
            'research_title' => $request->research_title,
            'research_types' => $request->research_types,
            'randb_field' => $request->randb_field,
            'socio_economic_objective' => $request->socio_economic_objective,
            'authorship_nature' => $request->authorship_nature,
            'stage_research_production' => $request->stage_research_production,
            'target_date_completion' => $request->target_date_completion,
            'nature_fund_source' => $request->nature_fund_source,
            'evidence_path' => $request->evidence_path,
            'researchproduction_id' => $researchProdId
        ]);

        $ongoingResearchProduction->load('researchproduction.researchmonitoringform.researchdocuments', 'researchproduction.researchmonitoringform.sdgMappings', 'researchproduction.researchmonitoringform.agendaMappings');

        return $this->success([
            $ongoingResearchProduction
        ], 'Ongoing Research Production added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(OngoingResearchProduction $ongoingResearchProduction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OngoingResearchProduction $ongoingResearchProduction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOngoingResearchProductionRequest $request, OngoingResearchProduction $ongoingResearchProduction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OngoingResearchProduction $ongoingResearchProduction)
    {
        //
    }
}
