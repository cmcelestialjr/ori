<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeerReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'journal_name',
        'article_title',
        'article_reviewed',
        'abstract_reviewed',
        'abstract_title',
        'coverage',
        'date_reviewed',
        'organization',
        'researchmonitoringform_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }

}
