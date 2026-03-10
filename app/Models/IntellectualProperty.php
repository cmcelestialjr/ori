<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntellectualProperty extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_type',
        'title',
        'owner_name',
        'processor_name',
        'document_id',
        'registration_date',
        'acceptance_date',
        'publication_date',
        'grant_date',
        'expiry_date',
        'researchmonitoringform_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
