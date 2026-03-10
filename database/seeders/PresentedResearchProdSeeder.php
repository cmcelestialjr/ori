<?php

namespace Database\Seeders;

use App\Enums\ResearchMonitoringFormStatus;
use App\Models\Point;
use App\Models\PresentedResearchProduction;
use App\Models\Research;
use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PresentedResearchProdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $monitoringForm = ResearchMonitoringForm::create([
        'research_involvement_type_id' => 3,
        'users_id' => 3,
        'status' => ResearchMonitoringFormStatus::PENDING,
       ]);

       $monitoringForm->sdgMappings()->attach(rand(1, 5));
       $monitoringForm->agendaMappings()->attach(rand(1, 5));

       PresentedResearchProduction::factory()->create([
        'date_presented' => fake()->date(),
        'conference_name' => fake()->text(),
        'conference_type' => fake()->randomElement(['international','regional/national', 'university-wide', 'college-wide', 'unit/dept. activities']),
        'conference_nature' => fake()->randomElement(['invitational', 'by application']),
        'conference_place' => fake()->country(),
        'conference_organization' => fake()->sentence(),
        'presentation_title' => fake()->title(),
        'presenter_name' => fake()->name(),
        'awards_received_ifany'=> fake()->sentence(),
        'researchmonitoringform_id' => $monitoringForm->id,
        'research_id' => Research::factory()->create()->id,
       ]);

       Point::factory()->create([
        'researchmonitoringform_id' => $monitoringForm->id,
        'points' => fake()->randomNumber(2),
        'rating' => fake()->randomElement(['poor', 'below satisfactory', 'satisfactory', 'above satisfactory', 'excellent'])
       ]);
    }
}
