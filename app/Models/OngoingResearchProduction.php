<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OngoingResearchProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'stage_research_production',
        'target_date_completion',
        'nature_fund_source',
        'researchmonitoringform_id',
        'research_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
    public function research(): BelongsTo
    {
        return $this->belongsTo(Research::class);
    }
}
