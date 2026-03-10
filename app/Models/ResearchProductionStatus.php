<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchProductionStatus extends Model
{
    use HasFactory;

    public function researchproduction(): belongsTo
    {
        return $this->belongsTo(ResearchProduction::class);
    }
}
