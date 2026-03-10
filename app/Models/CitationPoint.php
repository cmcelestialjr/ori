<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CitationPoint extends Model
{
    use HasFactory;

    protected $fillable = ['scopus', 'points'];
}
