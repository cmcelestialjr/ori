<?php

namespace Database\Seeders;

use App\Models\PublishedResearchPoint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PublishedResearchPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['coverage' => 'regional/national', 'points' => 150],
            ['coverage' => 'local refereed journal', 'points' => 150],
            ['coverage' => 'lnu refereed journal', 'points' => 150],
            ['coverage' => 'international', 'points' => 200],
            ['coverage' => 'ISI', 'points' => 360]
        ];

        PublishedResearchPoint::insert($data);
    }
}
