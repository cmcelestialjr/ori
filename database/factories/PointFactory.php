<?php

namespace Database\Factories;

use App\Models\ResearchMonitoringForm;
use App\Traits\PointsRating;
use Illuminate\Support\Number;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Point>
 */
class PointFactory extends Factory
{
    use PointsRating;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $points = fake()->randomNumber(3);
        $rating = $this->rating($points);

        return [
            'researchmonitoringform_id' => null,
            'points' => $points,
            'rating' => $rating
        ];
    }
}
