<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\ResearchType;
use App\Models\ResearchField;
use App\Models\SocioEconomicObjective;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Research>
 */
class ResearchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $authorShipNature = ['sole author', 'collaborative within lnu', 'collaborative outside lnu'];
        return [
            'title' => fake()->title(),
            'authorship_nature' => fake()->randomElement($authorShipNature),
            'authors' => fake()->name(),
            'research_field_id' => ResearchField::factory(),
            'research_type_id' => ResearchType::factory(),
            'socio_economic_objective_id' => SocioEconomicObjective::factory(),
            'user_id' => User::factory()
        ];
    }
}
