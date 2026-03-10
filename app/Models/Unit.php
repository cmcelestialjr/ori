<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = ['unit', 'name', 'college_id'];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }
}
