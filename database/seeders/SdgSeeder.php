<?php

namespace Database\Seeders;

use App\Models\SdgMapping;
use Illuminate\Database\Seeder;

class SdgSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sdgs = collect([
            [
                'name' => 'No Poverty',
                'description' => 'End poverty in all its forms everywhere.',
                'image_path' => 'images/sdg/sdg1.png',
            ],
            [
                'name' => 'Zero Hunger',
                'description' => 'End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.',
                'image_path' => 'images/sdg/sdg2.png',
            ],
            [
                'name' => 'Good Health and Well-being',
                'description' => 'Ensure healthy lives and promote well-being for all at all ages.',
                'image_path' => 'images/sdg/sdg3.png',
            ],
            [
                'name' => 'Quality Education',
                'description' => 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
                'image_path' => 'images/sdg/sdg4.png',
            ],
            [
                'name' => 'Gender Equality',
                'description' => 'Achieve gender equality and empower all women and girls.',
                'image_path' => 'images/sdg/sdg5.png',
            ],
            [
                'name' => 'Clean Water and Sanitation',
                'description' => 'Ensure availability and sustainable management of water and sanitation for all.',
                'image_path' => 'images/sdg/sdg6.png',
            ],
            [
                'name' => 'Affordable and Clean Energy',
                'description' => 'Ensure access to affordable, reliable, sustainable, and modern energy for all.',
                'image_path' => 'images/sdg/sdg7.png',
            ],
            [
                'name' => 'Decent Work and Economic Growth',
                'description' => 'Promote sustained, inclusive, and sustainable economic growth, full and productive employment, and decent work for all.',
                'image_path' => 'images/sdg/sdg8.png',
            ],
            [
                'name' => 'Industry, Innovation, and Infrastructure',
                'description' => 'Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.',
                'image_path' => 'images/sdg/sdg9.png',
            ],
            [
                'name' => 'Reduced Inequalities',
                'description' => 'Reduce inequality within and among countries.',
                'image_path' => 'images/sdg/sdg10.png',
            ],
            [
                'name' => 'Sustainable Cities and Communities',
                'description' => 'Make cities and human settlements inclusive, safe, resilient, and sustainable.',
                'image_path' => 'images/sdg/sdg11.png',
            ],
            [
                'name' => 'Responsible Consumption and Production',
                'description' => 'Ensure sustainable consumption and production patterns.',
                'image_path' => 'images/sdg/sdg12.png',
            ],
            [
                'name' => 'Climate Action',
                'description' => 'Take urgent action to combat climate change and its impacts.',
                'image_path' => 'images/sdg/sdg13.png',
            ],
            [
                'name' => 'Life Below Water',
                'description' => 'Conserve and sustainably use the oceans, seas, and marine resources for sustainable development.',
                'image_path' => 'images/sdg/sdg14.png',
            ],
            [
                'name' => 'Life on Land',
                'description' => 'Protect, restore, and promote sustainable use of terrestrial ecosystems.',
                'image_path' => 'images/sdg/sdg15.png',
            ],
            [
                'name' => 'Peace, Justice, and Strong Institutions',
                'description' => 'Promote peaceful and inclusive societies for sustainable development.',
                'image_path' => 'images/sdg/sdg16.png',
            ],
            [
                'name' => 'Partnerships for the Goals',
                'description' => 'Strengthen the means of implementation and revitalize the global partnership for sustainable development.',
                'image_path' => 'images/sdg/sdg17.png',
            ],
        ]);


        foreach ($sdgs as $sdg) {

            SdgMapping::create([
                "name" => $sdg['name'],
                "description" => $sdg['description'],
                "image_path" => $sdg['image_path'],
                "created_at" => now(),
            ]);
        };
    }
}
