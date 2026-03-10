<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AwardsManagement extends Model
{
    use HasFactory;

    protected $fillable = ['min_range_points', 'max_range_points', 'incentive'];
}
