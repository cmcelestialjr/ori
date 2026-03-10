<?php

namespace Database\Seeders;

use App\Models\ResearchInvolvementType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResearchInvolvementTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $elements = [
            //1
            ['research_involvement_type' => 'completed research (unpublished)', 'enable' => true], 

            //2
            ['research_involvement_type' => 'presented research', 'enable' => true], 
    
            //3
            ['research_involvement_type' => 'published research/creative works',  'enable' => true],

            //4
            ['research_involvement_type' => 'citations of published research',  'enable' => true],

            //5
            ['research_involvement_type' => 'participation to research/seminar/activity',  'enable' => true],

            //6
            ['research_involvement_type' => 'intellectual property (utility model/patent/copyright/trademark/industrial)',  'enable' => true],

            //7
            ['research_involvement_type' => 'refereeing in peer-reviewed journal',  'enable' => true],

            //8
            ['research_involvement_type' => 'other research involvement (panel/statistician/editor/adviser/internal/external funded research)',  'enable' => false],

            //9
            ['research_involvement_type' => 'creative works',  'enable' => false],
        ];

        ResearchInvolvementType::insert($elements);
    }
}
