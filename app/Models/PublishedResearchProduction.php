<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PublishedResearchProduction extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'coverage',
        'indexing',
        'journal_name',
        'issno_vol_pages',
        'editor_publisher',
        'article_link',
        'num_citations_date',
        'scopus_link',
        'researchmonitoringform_id',
        'research_id'
    ]; 

    public function researchmonitoringform(): BelongsTo
    {
        return $this->belongsTo(ResearchMonitoringForm::class, 'researchmonitoringform_id');
    }
    public function research(): BelongsTo
    {
        return $this->belongsTo(Research::class);
    }
}
