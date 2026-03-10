<?php

namespace Database\Seeders;

use App\Models\CompletedStudentThesesInvolvementPoint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompletedStudentThesesInvolvementPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['research_involvement' => 'adviser', 'undergraduate_points' => 40, 'graduate_points' => 50, 'dissertation' => 60],
            ['research_involvement' => 'statistician', 'undergraduate_points' => 10, 'graduate_points' => 15, 'dissertation' => 20],
            ['research_involvement' => 'panel', 'undergraduate_points' => 10, 'graduate_points' => 15, 'dissertation' => 20],
            ['research_involvement' => 'editor', 'undergraduate_points' => 20, 'graduate_points' => 25, 'dissertation' => 30],
        ];

        CompletedStudentThesesInvolvementPoint::insert($data);
    }
}
