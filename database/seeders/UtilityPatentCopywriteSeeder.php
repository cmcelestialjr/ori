<?php

namespace Database\Seeders;

use App\Models\UtilityPatentCopywrite;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UtilityPatentCopywriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['inclusion' => 'industrial design', 'points' => 200, 'status' => null],
            ['inclusion' => 'copyright', 'points' => 100, 'status' => null],
            ['inclusion' => 'trademark', 'points' => 200, 'status' => null],

            ['inclusion' => 'utility model', 'points' => 200, 'status' => 'accepted'],
            ['inclusion' => 'utility model', 'points' => 250, 'status' => 'published'],
            ['inclusion' => 'utility model', 'points' => 350, 'status' => 'granted'],
            
            ['inclusion' => 'patent/invetion', 'points' => 200, 'status' => 'accepted'],
            ['inclusion' => 'patent/invetion', 'points' => 300, 'status' => 'published'],
            ['inclusion' => 'patent/invetion', 'points' => 400, 'status' => 'granted'],
            
            
        ];
        UtilityPatentCopywrite::insert($data);
    }
}
