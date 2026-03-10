<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Point extends Model
{
    use HasFactory;
    protected $table = 'points';

    protected $fillable = [
        'researchmonitoringform_id', 'points', 'rating'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }

    public function getResearchMonitoringFormIdAttribute()
    {
        return $this->attributes['researchmonitoringform_id'];
    }
}
