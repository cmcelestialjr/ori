<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreativeWorksExhibition extends Model
{
    use HasFactory;

    protected $fillable = ['work_exhibit',
    'title'];

    public function researchmonitoringform(): belongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class);
    }
}
