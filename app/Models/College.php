<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class College extends Model
{
    use HasFactory;

    protected $fillable = ['college', 'name'];

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    protected function college(): Attribute
    {
        return Attribute::make(
            set: fn($val) => strtoupper($val)
        );
    }
}
