<?php

namespace Database\Factories;

use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Citation>
 */
class CitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'cited_authors' => implode(', ', collect(range(1, rand(2, 5)))->map(fn () => fake()->name())->toArray()),
        'cited_article_title' =>fake()->sentence(rand(4, 8)) . ': A Study',
        'research_title' =>fake()->sentence(rand(4, 8)) . ': A Study',
        'authors' => implode(', ', collect(range(1, rand(2, 5)))->map(fn () => fake()->name())->toArray()),
        'journal_title' => fake()->sentence(rand(4, 8)) . ': A Study',
        'issno_vol_pages' => fake()->randomNumber(4),
        'date' => fake()->date(),
        'publisher_name' => fake()->name(), 
        'url_link' => fake()->url(),
        'researchmonitoringform_id' =>null
        ];
    }
}
