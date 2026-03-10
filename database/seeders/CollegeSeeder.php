<?php

namespace Database\Seeders;

use App\Models\College;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollegeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colleges = [
            ['college' => 'CAS', 'name' => 'College of Arts and Sciences'], 
            ['college' => 'COE', 'name' => 'College of Education'], 
            ['college' => 'CME', 'name' => 'College of Management and Enterpreneurship']
        ];
        
        College::insert($colleges);
    }
}
