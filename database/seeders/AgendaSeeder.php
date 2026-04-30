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
        $agendas = [
            ['name' => 'Teacher Education', 'image' => 'images/agenda/classroom.png'],
            ['name' => 'Hotel and Hospitality Industry', 'image' => 'images/agenda/hotel.png'],
            ['name' => 'Management, Politics, and Governance', 'image' => 'images/agenda/politician.png'],
            ['name' => 'Information, Communication, Technology, and Library Science', 'image' => 'images/agenda/telecommunication.png'],
            ['name' => 'Biological Science', 'image' => 'images/agenda/dna.png'],
            ['name' => 'Physical Science', 'image' => 'images/agenda/atom.png'],
            ['name' => 'Ecological Processes', 'image' => 'images/agenda/biodegradable.png'],
            ['name' => 'Global Issues and Concerns', 'image' => 'images/agenda/earth.png'],
            ['name' => 'Health and Nutrition', 'image' => 'images/agenda/care.png'],
            ['name' => 'Social Services', 'image' => 'images/agenda/plan.png'],
            ['name' => 'Gender and Development', 'image' => 'images/agenda/equality.png'],
            ['name' => 'Culture and the Arts', 'image' => 'images/agenda/masks.png'],
            ['name' => 'Technical, Vocational, and Skills Studies', 'image' => 'images/agenda/vocational.png'],
            ['name' => 'Business and Entrepreneurship', 'image' => 'images/agenda/entrepreneurship.png'],
            ['name' => 'Linguistics', 'image' => 'images/agenda/linguistic.png'],
            ['name' => 'Media Communication, Technology, and Culture', 'image' => 'images/agenda/social-media.png'],
        ];

        foreach ($agendas as $agenda) {
            AgendaMapping::create([
                'name' => $agenda['name'],
                'image_path' => $agenda['image'],
            ]);
        }

    }
}
