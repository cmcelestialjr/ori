<?php

namespace Database\Factories;

use App\Models\Research;
use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompletedResearchProduction>
 */
class CompletedResearchProductionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dateCompleted = fake()->date();

        return [
            'date_completed' => $dateCompleted,
            'nature_fund_source' => fake()->randomElement(['external', 'internal', 'personal']),
            'target_date_publication' => fake()->dateTimeBetween($dateCompleted, '+1 year')->format('Y-m-d'),
            'researchmonitoringform_id' => null,
            'research_id' => Research::factory()->create()
        ];
    }
}
