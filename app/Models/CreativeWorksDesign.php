<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreativeWorksDesign extends Model
{
    use HasFactory;

    protected $fillable = ['design_created',
    'title'];

    public function researchmonitoringform(): belongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
