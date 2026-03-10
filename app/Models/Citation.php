<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Citation extends Model
{
    use HasFactory;

    protected $fillable = [
        'cited_authors',
        'cited_article_title',
        'scopus_link',
        'research_title',
        'authors',
        'journal_title',
        'issno_vol_pages',
        'date',
        'publisher_name', 
        'url_link',
        'researchmonitoringform_id'
    ];

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }
}
