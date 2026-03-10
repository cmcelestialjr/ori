<?php

namespace Database\Seeders;

use App\Models\PeerReviewPoints;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PeerReviewPointsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['coverage' => 'lnu', 'abstract_points' => 10, 'article_points' => 60],
            ['coverage' => 'local', 'abstract_points' => 10, 'article_points' => 60],
            ['coverage' => 'international', 'abstract_points' => 10, 'article_points' => 60],
            ['coverage' => 'isi', 'abstract_points' => 10, 'article_points' => 60],
        ];

        PeerReviewPoints::insert($data);
    }
}
