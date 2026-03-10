<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Enums\RoleEnum;
use App\Models\CompletedResearchPoints;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleandPermissionSeeder::class);
        $this->call(SdgSeeder::class);
        $this->call(AgendaSeeder::class);
        $this->call(CollegeSeeder::class);
        $this->call(UnitSeeder::class);
        $this->call(CompletedResearchPointsSeeder::class);
        $this->call(PublishedResearchPointSeeder::class);
        $this->call(ParticipationToResearchPointSeeder::class);
        $this->call(PeerReviewPointsSeeder::class);
        $this->call(CompletedStudentThesesInvolvementPointSeeder::class);
        $this->call(InternalExternalResearchPointSeeder::class);
        $this->call(CitationPointSeeder::class);
        $this->call(UtilityPatentCopywriteSeeder::class);
        $this->call(AwardsManagementSeeder::class);

        $this->call(ResearchTypeSeeder::class);
        $this->call(ResearchFieldSeeder::class);
        $this->call(SocioeconomicObjectiveSeeder::class);
        
        $this->call(ResearchInvolvementTypeSeeder::class);

        $this->call(AcademicYearSeeder::class);

        User::factory()->create([
            'fname' => 'Jonas',
            'lname' => 'Villas',
            'mi' => 'P',
            'suffix' => '',
            'email' => 'admin@example.com',
            'password' => 'admin',
        ])->syncRoles(RoleEnum::ADMIN);
        User::factory()->create([
            'fname' => 'Devine Grace',
            'lname' => 'Funcion',
            'mi' => 'P',
            'suffix' => '',
            'unit' => 'IT',
            'college' => 'CAS',
            'academic_rank' => 'PROFESSOR1',
            'email' => 'coordinator@example.com',
            'password' => 'coordinator',
        ])->syncRoles(RoleEnum::RESEARCH_COORDINATOR);
        User::factory()->create([
            'fname' => 'Cristobal',
            'lname' => 'Rabuya',
            'mi' => 'A',
            'suffix' => 'Jr.',
            'unit' => 'IT',
            'college' => 'CAS',
            'academic_rank' => 'PROFESSOR1',
            'email' => 'faculty@example.com',
            'password' => 'faculty',
        ]);
        User::factory(17)->create();
        //  \App\Models\SdgMapping::factory(10)->create();
        //  \App\Models\SdgMapping::factory(10)->create();
        // \App\Models\AgendaMapping::factory(10)->create();

        // \App\Models\ResearchField::factory(5)->create();
        // \App\Models\SocioEconomicObjective::factory(5)->create();

        //$this->call(PresentedResearchProdSeeder::class);
        for ($i = 0; $i < 100; $i++) {
            $this->call(ResearchMonitoringFormSeeder::class);
        }
    }
}
