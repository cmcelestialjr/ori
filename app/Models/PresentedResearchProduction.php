<?php

namespace App\Models;

use App\Events\PresentedResearchProductionCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PresentedResearchProduction extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'date_presented',
        'conference_name',
        'conference_type',
        'conference_nature',
        'conference_place',
        'conference_organization',
        'presentation_title',
        'presenter_name',
        'researchmonitoringform_id',
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }
}
