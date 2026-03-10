<?php

namespace Database\Seeders;

use App\Models\Citation;
use App\Models\CompletedResearchProduction;
use App\Models\IntellectualProperty;
use App\Models\PeerReview;
use App\Models\Point;
use App\Models\PresentedResearchProduction;
use App\Models\PublishedResearchProduction;
use App\Models\ResearchAttendance;
use App\Models\ResearchDocument;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ResearchMonitoringForm;
use Error;

class ResearchMonitoringFormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $form = ResearchMonitoringForm::factory()->create();
        
        Point::factory()->create([
            'researchmonitoringform_id' => $form->id,
        ]);
    
        ResearchDocument::factory()->create([
            'researchmonitoringform_id' => $form->id,
        ]);

        switch ($form->research_involvement_type_id) {

            case 1:
                CompletedResearchProduction::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;
            case 2:
                PresentedResearchProduction::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;
            case 3:
                PublishedResearchProduction::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;
            case 4:
                Citation::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;
            case 5:
                ResearchAttendance::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;
            case 6:
                IntellectualProperty::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;
            case 7:
                PeerReview::factory()->create(['researchmonitoringform_id' => $form->id]);
                break;

            default:
            throw new Error("Invalid Involvement Type");
            break;
        }
    }
}
