<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompletedResearchProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'date_completed',
        'nature_fund_source',
        'target_date_publication',
        'researchmonitoringform_id',
        'research_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }
    public function research(): BelongsTo
    {
        return $this->belongsTo(Research::class);
    }
}
