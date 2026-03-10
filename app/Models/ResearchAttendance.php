<?php

namespace App\Models;

use Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchAttendance extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'date',
        'organizer', 
        'research_title', 
        'coverage',
        'place',
        'attendance_nature', 
        'fund_source_nature', 
        'conference_type', 
        'researchmonitoringform_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }

    protected function attendanceNature(): Attribute
    {
        return Attribute::make(
            set: fn ($val) => strtolower($val)
        );
    }
}
