<?php

namespace Database\Seeders;

use App\Models\AwardsManagement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AwardsManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['min_range_points' => 700, 'max_range_points' => 1199, 'incentive' => 5000],
            ['min_range_points' => 2000, 'max_range_points' => 1699, 'incentive' => 7500],
            ['min_range_points' => 1700, 'max_range_points' => null, 'incentive' => 10000],
        ];

        AwardsManagement::insert($data);
    }
}
