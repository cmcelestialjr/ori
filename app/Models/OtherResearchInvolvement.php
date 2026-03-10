<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtherResearchInvolvement extends Model
{
    use HasFactory;

    protected $fillable = [
        'research_involvement',
        'research_title',
        'fund_source_nature',
        'date',
        'researchmonitoringform_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
