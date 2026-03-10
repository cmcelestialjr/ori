<?php

namespace Database\Factories;

use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResearchAttendance>
 */
class ResearchAttendanceFactory extends Factory
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
            'organizer' => fake()->company(),
            'research_title' => fake()->sentence(rand(4, 8)) . ': A Study',
            'coverage' => fake()->randomElement(['international','regional/national', 'university-wide', 'college-wide', 'unit/dept. activities']),
            'attendance_nature' => fake()->randomElement(['presenter', 'moderator', 'facilitator', 'coordinator', 'tabulator', 'editor']),
            'place' => fake()->country(),
            'fund_source_nature' => fake()->randomElement(['internal', 'external', 'personal']),
            'conference_type' => fake()->randomElement(['managerial', 'research', 'Industry']),  
            'researchmonitoringform_id' => null,
        ];
    }
}
