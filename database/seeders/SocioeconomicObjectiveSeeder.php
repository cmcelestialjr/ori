<?php

namespace Database\Seeders;

use App\Models\SocioEconomicObjective;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocioeconomicObjectiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socioeconomicObjective = collect([
            'Exploration and exploitation of the earth',
            'Environment',
            'Exploration and exploitation of space',
            'Transport, telecommunication, and other infrastructures',
            'Energy',
            'Industrual production and technology',
            'Health',
            'Agriculture',
            'Education',
            'Culture, recreation, religion, and mass media',
            'Political and social systems, structures, and processes',
            'Defense',
            'Information and communications technology',
            'Disaster risk reduction and climate change',
        ]);

        $socioeconomicObjective->each(function($objecive) {
            SocioEconomicObjective::create([
                'type' => $objecive
            ]);
        });
    }
}
