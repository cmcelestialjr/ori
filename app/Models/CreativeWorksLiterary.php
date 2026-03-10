<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreativeWorksLiterary extends Model
{
    use HasFactory;

    protected $fillable = ['literary_publication', 'title', 'year_published', 'researchmonitoringform_id'];

    public function researchmonitoringform(): belongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
