<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublishedResearchPoint extends Model
{
    use HasFactory;

    protected $fillable = ['coverage', 'points'];
}
