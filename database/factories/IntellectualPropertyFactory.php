<?php

namespace Database\Factories;

use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IntellectualProperty>
 */
class IntellectualPropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_type' => fake()->randomElement(['copyright', 'utility model', 'patent/invention', 'trademark', 'industrial design']),
            'title'=> fake()->sentence(),
            'owner_name' => fake()->name(),
            'processor_name' => fake()->company(),
            'document_id' => fake()->randomNumber(5),
            'registration_date'=> fake()->date(),
            'acceptance_date' => fake()->date(),
            'publication_date' => fake()->date(),
            'grant_date' => fake()->date(),
            'expiry_date' => fake()->date(),
            'researchmonitoringform_id' => null,
            ];
    }
}
