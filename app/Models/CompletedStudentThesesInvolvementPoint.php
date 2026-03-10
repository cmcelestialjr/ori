<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompletedStudentThesesInvolvementPoint extends Model
{
    use HasFactory;

    protected $fillable = ['research_involvement', 'undergraduate_points', 'graduate_points', 'dissertation'];
}
