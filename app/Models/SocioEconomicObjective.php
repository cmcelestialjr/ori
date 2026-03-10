<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocioEconomicObjective extends Model
{
    use HasFactory;

    protected $fillable = ['type'];

    public function research(): BelongsTo
    {
        return $this->belongsTo(Research::class);
    }
}
