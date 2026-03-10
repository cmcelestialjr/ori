<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResearchInvolvementType>
 */
class ResearchInvolvementTypeFactory extends Factory
{
    public function definition(): array
{
        $elements = [
            'completed research (unpublished)', 'presented research', 'published completed research/creative works','published research citations','participation to research/seminar/activity', 'intellectual property','other research involvement (Panel/Statistician/Editor/Adviser)', 'creative works'
        ];

        return [
            'research_involvement_type' => $elements
        ];
    }
}
