<?php

namespace Database\Factories;

use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ResearchInvolvementType;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResearchMonitoringForm>
 */
class ResearchMonitoringFormFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = ['pending', 'approved', 'evaluated'];

        $createdAt = fake()->dateTimeBetween('2023-01-01', '2026-12-31');

        return [
            'research_involvement_type_id' => fake()->randomElement([1,2,3,4,5,6]),
            'users_id' => User::role('faculty')->inRandomOrder()->value('id'),
            'status' =>  'evaluated',
            'reviewed_by' => fake()->name(),
            'reviewed_at' => now(),
            'evaluated_at'=> now(),
            'is_archived' => $createdAt->format('Y') != '2025',
            'created_at' => $createdAt
        ];
    }
    public function configure()
    {
        return $this->afterCreating(function (ResearchMonitoringForm $researchMonitoringForm) {
            $researchMonitoringForm->sdgMappings()->attach(rand(1,5));
            $researchMonitoringForm->agendaMappings()->attach(rand(1,5));
        });
    }
}
