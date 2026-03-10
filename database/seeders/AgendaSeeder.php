<?php

namespace Database\Seeders;

use App\Models\AgendaMapping;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AgendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $agendaMapping = collect([
            'Teacher Education',
            'Hotel and Hospitality Industry',
            'Management, Politics, and Governance',
            'Information, Communication, Technology, and Library Science',
            'Biological Science',
            'Physical Science',
            'Ecological Processes',
            'Global Issues and Concerns',
            'Health and Nutrition',
            'Social Services',
            'Gender and Development',
            'Culture and the Arts',
            'Technical, Vocational, and Skills Studies',
            'Business and Entrepreneurship',
            'Linguistics',
            'Media Communication, Technology, and Culture',
        ]);

        $agendaMapping->each(function($agenda) {
            AgendaMapping::create([
                'name' => $agenda,
                'image_path' => Str::slug($agenda) . '.png',
            ]);
        });

    }
}
