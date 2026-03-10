<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AcademicYear;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AcademicYear::create([
            'academic_year' => '2023-2024',
            // 'semester' => 'First Semester',
            'start_date' => '2024-01-01',
            'end_date' => '2024-6-30',
            'is_submission_enable' => true,
        ]);

    //     AcademicYear::create([
    //        'academic_year' => '2023-2024',
    //        'semester' => 'Second Semester',
    //        'start_date' => '2024-7-15',
    //        'end_date' => '2025-1-15'
    //    ]);      
    }
}
