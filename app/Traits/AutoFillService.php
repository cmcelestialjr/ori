<?php

namespace App\Traits;

use App\Models\User;
use App\Models\ResearchMonitoringForm;
use App\Models\PresentedResearchProduction;
use App\Models\ResearchProduction;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
// use App\Traits\useGeminiService;
use App\Traits\HttpResponses;

trait AutoFillService {

    // use useGeminiService;
    use HttpResponses;

    public function presentedResearchProduction($data, $form)
    {
        $researchProd = new ResearchProduction();

        $presentedProd = new PresentedResearchProduction();

        $form->$researchProd->save([
            'research_title' => $data['research_title'],
        ]);
        
        return $form;
    }
}