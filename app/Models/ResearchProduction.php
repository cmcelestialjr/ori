<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ResearchProduction extends Model
{
    use HasFactory;

    protected $fillable = ['research_title', 'types_of_research', 'field_of_randb', 'socioeconomic_objective', 'authorship_nature', 'researchmonitoringform_id'];

    public function ongoing(): HasOne
    {
        return $this->hasOne(OngoingResearchProduction::class);
    }
    public function completed(): HasOne
    {
        return $this->hasOne(CompletedResearchProduction::class);
    }
    public function presented(): HasOne
    {
        return $this->hasOne(PresentedResearchProduction::class);
    }
    public function published(): HasOne
    {
        return $this->hasOne(PublishedResearchProduction::class);
    }
    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
