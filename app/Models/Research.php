<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
class Research extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'authorship_nature',
        'authors',
        'research_field_id',
        'research_type_id',
        'socio_economic_objective_id',
        'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function researchField(): BelongsTo
    {
        return $this->belongsTo(ResearchField::class);
    }

    public function researchType(): BelongsTo
    {
        return $this->belongsTo(ResearchType::class);
    }

    public function socioEconomicObjective(): BelongsTo
    {
        return $this->belongsTo(SocioEconomicObjective::class);
    }

    public function presented(): HasOne
    {
        return $this->hasOne(PresentedResearchProduction::class);
    }
    public function published(): HasOne
    {
        return $this->hasOne(PublishedResearchProduction::class);
    }
    public function completed(): HasOne
    {
        return $this->hasOne(CompletedResearchProduction::class);
    }
    public function ongoing(): HasOne
    {
        return $this->hasOne(OngoingResearchProduction::class);
    }
}

