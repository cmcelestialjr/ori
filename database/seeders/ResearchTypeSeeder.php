<?php

namespace Database\Seeders;

use App\Models\ResearchType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResearchTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $researchTypes = [
                        [
                            'type' => 'Basic Research',
                            'description' => 'This refers to works undertaken primarily to acquire new knowledge of the underlying foundations of phenomena and observable facts without a specific application in view. It involves analyses of properties, structures and relationships with a view to formulating and testing hypotheses, theories or laws. The results of basic research are not generally sold but are usually published in scientific journals or circulated to interested colleagues.',
                        ],
                        [
                            'type' => 'Applied Research',
                            'description' => 'This refers to original investigation to acquire new knowledge with a specific application in view. Activities include determining the possible uses for the findings of basic research. The results of applied research are intended primarily to be valid for possible application to products, operations, methods or systems. Applied research develops ideas into operational form. The information or knowledge derived may be published in peer-reviewed journals or subjected to other forms of intellectual property protection.',
                        ],
                        [
                            'type' => 'Experimental Development',
                            'description' => 'Refers to systematic work, drawing on knowledge gained from research and practical experience and producing additional knowledge, directed to producing new products or processes or improving existing ones.',
                        ],
                    ];

                    foreach ($researchTypes as $researchType) {
                        ResearchType::create($researchType);
                    }
                }
            }