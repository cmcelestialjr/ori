<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ParticipationToResearchPoint;
use Illuminate\Support\Facades\DB;

class ParticipationToResearchPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['category' => 'attendance', 'coverage' => 'unit/department', 'points' => 0.5, 'legend' => 'per hour'],
            ['category' => 'attendance', 'coverage' => 'college-wide', 'points' => 1, 'legend' => 'per hour'],
            ['category' => 'attendance', 'coverage' => 'university-wide', 'points' => 1.5, 'legend' => 'per hour'],
            ['category' => 'attendance', 'coverage' => 'regional/national', 'points' => 10, 'legend' => 'per day'],
            ['category' => 'attendance', 'coverage' => 'international', 'points' => 20, 'legend' => 'per day'],
            
            ['category' => 'organizer', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per project'],
            ['category' => 'organizer', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per project'],
            ['category' => 'organizer', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per project'],
            ['category' => 'organizer', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per project'],
            ['category' => 'organizer', 'coverage' => 'international', 'points' => 180, 'legend' => 'per project'],

            ['category' => 'coordinator', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per project'],
            ['category' => 'coordinator', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per project'],
            ['category' => 'coordinator', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per project'],
            ['category' => 'coordinator', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per project'],
            ['category' => 'coordinator', 'coverage' => 'international', 'points' => 180, 'legend' => 'per project'],

            ['category' => 'facilitator', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'facilitator', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'facilitator', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'facilitator', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'facilitator', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'editor in chief', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'editor in chief', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'editor in chief', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'editor in chief', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'editor in chief', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'associate editor', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'associate editor', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'associate editor', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'associate editor', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'associate editor', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'managing editor', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'managing editor', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'managing editor', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'managing editor', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'managing editor', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'production and circulation manager', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'production and circulation manager', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'production and circulation manager', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'production and circulation manager', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'production and circulation manager', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'moderator', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'moderator', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'moderator', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'moderator', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'moderator', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'business manager', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'business manager', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'business manager', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'business manager', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'business manager', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            

            ['category' => 'judge', 'coverage' => 'unit/department', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'judge', 'coverage' => 'college-wide', 'points' => 12, 'legend' => 'per project'],
            ['category' => 'judge', 'coverage' => 'university-wide', 'points' => 15, 'legend' => 'per project'],
            ['category' => 'judge', 'coverage' => 'regional/national', 'points' => 30, 'legend' => 'per project'],
            ['category' => 'judge', 'coverage' => 'international', 'points' => 60, 'legend' => 'per project'],

            ['category' => 'committee member', 'coverage' => 'unit/department', 'points' => 3, 'legend' => 'per project'],
            ['category' => 'committee member', 'coverage' => 'college-wide', 'points' => 6, 'legend' => 'per project'],
            ['category' => 'committee member', 'coverage' => 'university-wide', 'points' => 10, 'legend' => 'per project'],
            ['category' => 'committee member', 'coverage' => 'regional/national', 'points' => 20, 'legend' => 'per project'],
            ['category' => 'committee member', 'coverage' => 'international', 'points' => 40, 'legend' => 'per project'],
            
            ['category' => 'resource person', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per presentation'],
            ['category' => 'resource person', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per presentation'],
            ['category' => 'resource person', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per presentation'],
            ['category' => 'resource person', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per presentation'],
            ['category' => 'resource person', 'coverage' => 'international', 'points' => 180, 'legend' => 'per presentation'],

            ['category' => 'lecturer', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per presentation'],
            ['category' => 'lecturer', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per presentation'],
            ['category' => 'lecturer', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per presentation'],
            ['category' => 'lecturer', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per presentation'],
            ['category' => 'lecturer', 'coverage' => 'international', 'points' => 180, 'legend' => 'per presentation'],
            
            ['category' => 'presenter', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per presentation'],
            ['category' => 'presenter', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per presentation'],
            ['category' => 'presenter', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per presentation'],
            ['category' => 'presenter', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per presentation'],
            ['category' => 'presenter', 'coverage' => 'international', 'points' => 180, 'legend' => 'per presentation'],

            ['category' => 'speaker', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per presentation'],
            ['category' => 'speaker', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per presentation'],
            ['category' => 'speaker', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per presentation'],
            ['category' => 'speaker', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per presentation'],
            ['category' => 'speaker', 'coverage' => 'international', 'points' => 180, 'legend' => 'per presentation'],
            
            ['category' => 'consultant', 'coverage' => 'unit/department', 'points' => 10, 'legend' => 'per project'],
            ['category' => 'consultant', 'coverage' => 'college-wide', 'points' => 20, 'legend' => 'per project'],
            ['category' => 'consultant', 'coverage' => 'university-wide', 'points' => 45, 'legend' => 'per project'],
            ['category' => 'consultant', 'coverage' => 'regional/national', 'points' => 90, 'legend' => 'per project'],
            ['category' => 'consultant', 'coverage' => 'international', 'points' => 180, 'legend' => 'per project'],
            ];

            // $chunks = array_chunk($data, 85);

            // foreach ($chunks as $chunk) {
            //     DB::table('participation_to_research_points')->insert($chunk);
            // }

            ParticipationToResearchPoint::insert($data);
    }
}
