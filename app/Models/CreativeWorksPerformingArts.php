<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreativeWorksPerformingArts extends Model
{
    use HasFactory;

    protected $fillable = ['creative_works_description', 'title', 'year_produced', 'year_published', 'researchmonitoringform_id'];

    public function researchmonitoringform(): belongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
