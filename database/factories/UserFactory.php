<?php

namespace Database\Factories;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colleges = ['CAS', 'COE', 'CME'];

        $collegeUnits = [
            'CAS' => [
                'BACOMM', 'BAPOS/SOCIAL SCIENCE', 'SOCIAL WORK', 'IT', 'BLIS',
                'BSBIO/SCIENCE', 'BAEL/LANG&LIT', 'BMME/MAPEH & HUMANITY',
            ],
            'COE' => [
                'BSED-PROFED', 'BSED-FILIPINO', 'BSED-ENGLISH', 'BSED-MATH',
                'BSED-VALUES EDUCATION', 'BSED-SOCIAL STUDIES', 'BSED-SCIENCE',
            ],
            'CME' => [
                'BEED/BECED/BSNED', 'BPED', 'BTLED', 'ILS', 'HM/TM', 'ENTREP',
            ],
        ];
    
        $academicRanks = [
            'UNIVERSITY PROFESSOR',
            'PROFESSOR VI', 'PROFESSOR V', 'PROFESSOR IV',
            'PROFESSOR III', 'PROFESSOR II', 'PROFESSOR I',
            'ASSOCIATE PROFESSOR V', 'ASSOCIATE PROFESSOR IV',
            'ASSOCIATE PROFESSOR III', 'ASSOCIATE PROFESSOR II',
            'ASSOCIATE PROFESSOR I',
            'ASSISTANT PROFESSOR VI', 'ASSISTANT PROFESSOR V',
            'ASSISTANT PROFESSOR IV', 'ASSISTANT PROFESSOR III',
            'ASSISTANT PROFESSOR II', 'ASSISTANT PROFESSOR I',
            'INSTRUCTOR III', 'INSTRUCTOR II', 'INSTRUCTOR I',
        ];
    
        $selectedCollege = fake()->randomElement($colleges);
        $selectedUnit = fake()->randomElement($collegeUnits[$selectedCollege]);

        return [
            'email'          => fake()->unique()->safeEmail(),
            'password'       => static::$password ?? Hash::make('password'),
            'fname'          => fake()->firstName(),
            'lname'          => fake()->lastName(),
            'mi'             => fake()->randomLetter(),
            'college'        => $selectedCollege,
            'unit'           => $selectedUnit,
            'academic_rank'  => fake()->randomElement($academicRanks),
            'suffix'         => fake()->suffix(),
            'image_path'     => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Configure the factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            $user->assignRole(RoleEnum::FACULTY);
        });
    }
}
