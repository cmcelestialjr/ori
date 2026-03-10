<?php

namespace Database\Factories;

use App\Models\Research;
use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PresentedResearchProduction>
 */
class PresentedResearchProductionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'date_presented' => fake()->date(),
        'conference_name' => fake()->text(),
        'conference_type' => fake()->randomElement(['international','regional/national', 'university-wide', 'college-wide', 'unit/dept. activities']),
        'conference_nature' => fake()->randomElement(['invitational', 'by application']),
        'conference_place' => fake()->country(),
        'conference_organization' => fake()->sentence(),
        'presentation_title' => fake()->title(),
        'presenter_name' => fake()->name(),
        'researchmonitoringform_id' => null
        ];
    }
}
