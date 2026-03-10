<?php

namespace Database\Factories;

use App\Models\ResearchMonitoringForm;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResearchDocument>
 */
class ResearchDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('doc.jpg');
        $path = $file->store('documents', 'public');
        
        return [
        'researchmonitoringform_id' =>  null,
        'file_path' => $path,
        'status' => 'approved'
        ];
    }
}
