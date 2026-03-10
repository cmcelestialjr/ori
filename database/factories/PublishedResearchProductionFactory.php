<?php

namespace Database\Factories;

use App\Models\Research;
use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PublishedResearchProduction>
 */
class PublishedResearchProductionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->date(),
            'coverage' => fake()->randomElement(['international','regional/national', 'university-wide', 'college-wide', 'unit/dept. activities']),
            'indexing' => fake()->randomElement(['Scopus', 'ISI', 'Web of Science', 'PubMed']),
            'journal_name' => fake()->sentence(rand(4, 8)) . ': A Study',
            'issno_vol_pages' => fake()->randomNumber(5),
            'editor_publisher' => fake()->company(),
            'article_link' => fake()->url(),
            'num_citations_date' => fake()->randomNumber(2),
            'researchmonitoringform_id' => null,
            'research_id' => Research::factory()->create()
        ];
    }
}
