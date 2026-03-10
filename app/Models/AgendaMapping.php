<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AgendaMapping extends Model
{
    use HasFactory;

    protected $fillable = [ 'name', 'image_path'];

    public function researchMonitoringForms(): BelongsToMany
    {
        return $this->belongsToMany(ResearchMonitoringForm::class, 'research_agenda', 'agendamapping_id', 'researchmonitoringform_id');
    }
    protected function imagePath(): Attribute
    {
        return Attribute::make(
            get: fn(?string $val) => $val ?  config('myconfig.app_url') . '/storage/' . $val : null 
        );
    }
}
