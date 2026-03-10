<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeerReviewPoints extends Model
{
    use HasFactory;

    protected $fillable = ['coverage', 'article_points', 'abstract_points'];
}
