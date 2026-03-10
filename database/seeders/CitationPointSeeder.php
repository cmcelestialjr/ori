<?php

namespace Database\Seeders;

use App\Models\CitationPoint;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitationPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['scopus' => 1, 'points' => 30],
            ['scopus' => 0, 'points' => 10],
        ];
        
        CitationPoint::insert($data);
    }
}
