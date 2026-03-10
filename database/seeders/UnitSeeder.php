<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            //CAS
            ['unit' => 'BACOMM', 'name' => 'Bachelor of Arts in Communication', 'college_id' => 1],
            ['unit' => 'BAPOS/SOCIAL SCIENCE', 'name' => 'Bachelor of Arts in Political Science','college_id' => 1],
            ['unit' => 'BAEL/LANG&LIT', 'name' => 'Bachelor of Arts in English Language','college_id' => 1],
            ['unit' => 'BSBIO/SCIENCE', 'name' => 'Bachelor of Science in Biology','college_id' => 1],
            ['unit' => 'BSIT', 'name' => 'Bachelor of Science in Information Technology','college_id' => 1],
            ['unit' => 'BLIS', 'name' => 'Bachelor of Library and Information Science','college_id' => 1],
            ['unit' => 'BMME/MAPEH & HUMANITY', 'name' => 'Bachelor of Music in Music Education','college_id' => 1],
            ['unit' => 'BSSW', 'name' => 'Bachelor of Science in Social Work','college_id' => 1],
        
            //COE
            ['unit' => 'BSED-PROFED', 'name' => 'Bachelor of Secondary Education Professional Education', 'college_id' => 2],
            ['unit' => 'BSED-FILIPINO', 'name' => 'Bachelor of Secondary Education Major in Filipino','college_id' => 2],
            ['unit' => 'BSED-ENGLISH', 'name' => 'Bachelor of Secondary Education Major in English','college_id' => 2],
            ['unit' => 'BSED-MATH', 'name' => 'Bachelor of Secondary Education Major in Mathematics','college_id' => 2],
            ['unit' => 'BSED-VALUES EDUCATION', 'name' => 'Bachelor of Secondary Education Major in Values Education','college_id' => 2],
            ['unit' => 'BSED-SOCIAL STUDIES', 'name' => 'Bachelor of Secondary Education Major in Social Science','college_id' => 2],
            ['unit' => 'BSED-SCIENCE', 'name' => 'Bachelor of Secondary Education Major in Science','college_id' => 2],
            ['unit' => 'BPED', 'name' => 'Bachelor of Physical Education','college_id' => 2],
            ['unit' => 'BTLED', 'name' => 'Bachelor of Technology and Livelihood Education','college_id' => 2],
            ['unit' => 'BEED/BECED/BSNED', 'name' => NULL, 'college_id' => 2],
            
            //CME
            ['unit' => 'BSHM/BSTM', 'name' => NULL, 'college_id' => 3],
            ['unit' => 'ENTREP', 'name' => 'Bachelor of Entrepreneurship', 'college_id' => 3],

            //ILS
            ['unit' => 'ILS', 'name' => 'Integrated Laboratory School', 'college_id' => 2],
        ];

        Unit::insert($units);
    }
}
