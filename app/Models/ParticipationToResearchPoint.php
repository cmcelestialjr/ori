<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParticipationToResearchPoint extends Model
{
    use HasFactory;

    protected $fillable = ['category', 'coverage', 'points', 'legend'];
}
