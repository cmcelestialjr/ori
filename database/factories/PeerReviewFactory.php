<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PeerReview>
 */
class PeerReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'journal_name' => fake()->sentence(3),
            'article_title' => fake()->sentence(5),
            'article_reviewed' => fake()->randomNumber(2),
            'abstract_reviewed' => null,
            'abstract_title' => null,
            'coverage' => fake()->randomElement(['international','regional/national', 'university-wide', 'college-wide', 'unit/dept. activities']),
            'date_reviewed' => fake()->date(),
            'organization' => fake()->sentence(),
            'researchmonitoringform_id' => null
        ];
    }
}
