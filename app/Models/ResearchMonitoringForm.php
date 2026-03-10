<?php

namespace App\Models;

Use App\Enums\ResearchMonitoringFormStatus;
use App\Models\Scopes\ArchiveSubmissionScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class ResearchMonitoringForm extends Model
{
    use HasFactory;

    protected $fillable = [
         'users_id',
         'research_involvement_type_id',
         'status',
         'reviewed_by',
         'reviewed_at',
         'evaluated_at',
         'is_archived',
         'rejected_message'
    ];

    protected function casts(): array
    {
        return [
            'status' => ResearchMonitoringFormStatus::class
        ];
    }

    protected static function booted()
    {
        static::creating(function ($model) {
            if (is_null($model->is_archived)) {
                $model->is_archived = false;
            }
        });

        static::addGlobalScope('archive', function (Builder $builder) {
            $builder->where('is_archived', false);
        });
    }

    public function sdgMappings(): BelongsToMany
    {
        return $this->belongsToMany(SdgMapping::class, 'research_sdg', 'researchmonitoringform_id', 'sdgmapping_id');
    }

    public function agendaMappings(): BelongsToMany
    {
        return $this->belongsToMany(AgendaMapping::class, 'research_agenda', 'researchmonitoringform_id', 'agendamapping_id');
    }

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function researchtype(): HasOne
    {
        return $this->hasOne(ResearchType::class);
    }

    public function researchdocuments(): HasMany
    {
        return $this->hasMany(ResearchDocument::class, 'researchmonitoringform_id');
    }

    public function otherresearch(): HasOne
    {
        return $this->hasOne(OtherResearchInvolvement::class);
    }

    public function citations(): HasOne
    {
        return $this->hasOne(Citation::class, 'researchmonitoringform_id');
    }

    public function attendancetoresearch(): HasOne
    {
        return $this->hasOne(ResearchAttendance::class, 'researchmonitoringform_id');
    }

    public function ongoingresearchprod(): HasOne
    {
        return $this->hasOne(OngoingResearchProduction::class, 'researchmonitoringform_id');
    }

    public function completedresearchprod(): HasOne
    {
        return $this->hasOne(CompletedResearchProduction::class, 'researchmonitoringform_id');
    }

    public function presentedresearchprod(): HasOne
    {
        return $this->hasOne(PresentedResearchProduction::class, 'researchmonitoringform_id');
    }

    public function publishedresearchprod(): HasOne
    {
        return $this->hasOne(PublishedResearchProduction::class, 'researchmonitoringform_id');
    }

    public function intellectualproperty(): HasOne
    {
        return $this->hasOne(IntellectualProperty::class, 'researchmonitoringform_id');
    }

    public function peerReview(): HasOne
    {
        return $this->hasOne(PeerReview::class);
    }

    public function creativeworksperformingarts(): HasOne
    {
        return $this->hasOne(CreativeWorksPerformingArts::class);
    }

    public function creativeworksexhibition(): HasOne
    {
        return $this->hasOne(CreativeWorksExhibition::class);
    }

    public function creativeworksliterary(): HasOne
    {
        return $this->hasOne(CreativeWorksLiterary::class);
    }

    public function creativeworksdesign(): HasOne
    {
        return $this->hasOne(CreativeWorksDesign::class);
    }

    public function points(): HasOne
    {
        return $this->hasOne(Point::class, 'researchmonitoringform_id');
    }

    public function researchinvolvement(): HasOne
    {
        return $this->hasOne(ResearchInvolvementType::class,  'id','research_involvement_type_id');
    }
}
