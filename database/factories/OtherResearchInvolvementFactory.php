<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ResearchMonitoringForm;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OtherResearchInvolvement>
 */
class OtherResearchInvolvementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'other_research_involvement' => fake()->randomElement(['Abstract Evaluator', 'Associate Editor', 'Consultant', 'Content Editor', 'Copy Editor', 'Data Encoder/Tabulator', 'Enumerator', 'Expert Panel in Research Conference']),
            'research_title' => fake()->sentence(6),
            'year' => fake()->year(),
            'month' => fake()->monthName(),
            'evidence_path' => fake()->imageUrl(),
            'researchmonitoringform_id' => ResearchMonitoringForm::where('research_involvement_type_id', 5)->random()->id
        ];
    }
}
