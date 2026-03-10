<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalExternalResearchPoint extends Model
{
    use HasFactory;

    protected $fillable = ['research_involvement',  'legend', 'points', 'ceiling_points', 'ceiling_points_legend'];
}
