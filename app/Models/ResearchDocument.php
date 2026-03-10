<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
Use App\Enums\ResearchMonitoringFormStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ResearchDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'researchmonitoringform_id',
        'file_path',
        'status'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }
    protected function casts(): array
    {
        return [
            'status' => ResearchMonitoringFormStatus::class
        ];
    }
    protected function filePath(): Attribute
    {
        return Attribute::make(
            get: function(string $file){
                
                if(!Storage::disk('local')->exists($file))
                {
                    return null;
                };

                $filePath = Str::after($file, 'documents/');
                return Storage::disk('local')->temporaryUrl($filePath, now()->addMinutes(60));
            },
        );
    }
}
