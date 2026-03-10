<?php

namespace Database\Seeders;

use App\Models\InternalExternalResearchPoint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InternalExternalResearchPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['research_involvement' => 'statistician', 'points' => 20, 'legend' => 'per research', 'ceiling_points' => null, 'ceiling_points_legend' => null],

            ['research_involvement' => 'panel', 'points' => 5, 'legend' => 'per concept paper', 'ceiling_points' => null, 'ceiling_points_legend' => null],

            ['research_involvement' => 'program', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40,'ceiling_points_legend' => 'per semester'],

            ['research_involvement' => 'project leader', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],

            ['research_involvement' => 'member', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],

            ['research_involvement' => 'data gatherer', 'points' => 1.5, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],

            ['research_involvement' => 'enumerator', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],

            ['research_involvement' => 'editor', 'points' => 20, 'legend' => 'per research', 'ceiling_points' => null, 'ceiling_points_legend' => null],

            ['research_involvement' => 'data encoder', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],

            ['research_involvement' => 'tabulator', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],
            ['research_involvement' => 'compiler', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],
            ['research_involvement' => 'binder', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],
            ['research_involvement' => 'collator', 'points' => 1, 'legend' => 'per hour', 'ceiling_points' => 40, 'ceiling_points_legend' => 'per semester'],
        ];

        InternalExternalResearchPoint::insert($data);
    }
}
