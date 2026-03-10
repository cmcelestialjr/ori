<?php

namespace Database\Seeders;

use App\Models\ResearchField;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResearchFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $fields = [
        ['field' => 'Natural Sciences', 'description' => 'Includes Mathematics; Computer and information sciences (hardware development to be included in 5.2.2 and social aspects of computer and information sciences to be included in 5.2.6); Physical sciences; Chemical sciences; Earth and related Environmental sciences (social aspects of environmental sciences to be included in 5.2.5); Biological sciences (medical, medical genetics and medical aspects to be included in 5.2.3 and agricultural aspects to be included in 5.2.4); and other natural sciences.'],
        ['field' => 'Engineering and Technology', 'description' => 'Include Civil engineering; Electrical engineering; Mechanical engineering (nuclear physics to be included in 5.2.1); Chemical engineering; Materials engineering; Medical engineering; Environmental engineering; Environmental biotechnology; Industrial biotechnology; Nano-technology; and Other engineering and technologies'],
        ['field' => 'Medical and Health Sciences', 'description' => 'Include Basic medicine (plant science to be included in 5.2.1); Clinical medicine; Health sciences; Medical biotechnology; and Other medical sciences'],
        ['field' => 'Agricultural Sciences', 'description' => 'Include Agriculture, Forestry, and Fisheries; Animal and Dairy science; Veterinary science; Agricultural biotechnology; and Other agricultural sciences'],
        ['field' => 'Social Sciences', 'description' => 'Include Psychology; Economics and Business; Educational sciences; Sociology; Law; Political science; Social and economic geography (transport engineering to be included in 5.2.2); Media and communications; and Other social sciences'],
        ['field' => 'Humanities and the Arts', 'description' => 'Include History and Archaeology; Languages and Literature; Philosophy, Ethics and Religion; Arts (arts, history of arts, performing arts, music); and Other humanities']
             
         ];

        foreach ($fields as $field) {
                    ResearchField::create($field);
                }
            }
}