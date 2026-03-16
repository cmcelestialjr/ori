<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'fname',
        'lname',
        'mi',
        'college',
        'unit',
        'image_path',
        'academic_rank',
        'suffix',
        'email',
        'password',
        'sso_token',
        'sso_token_expires_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getFullName()
    {
        $name = $this->fname;

        if($this->mi !== null) {

            $name .= ' '.$this->mi . '.';
        };

        $name .= ' ' . $this->lname;

        if($this->suffix !== null) {

            $name .= ' ' . $this->suffix;

        };

        return $name;
    }
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    public function research(): HasMany
    {
        return $this->hasMany(Research::class);
    }
    public function researchMonitoringForm(): HasMany
    {
        return $this->hasMany(ResearchMonitoringForm::class, 'users_id');
    }

    protected function fname(): Attribute
    {
        return Attribute::make(
            set: fn ($val) => ucfirst($val)
        );
    }
    protected function lname(): Attribute
    {
        return Attribute::make(
            set: fn ($val) => ucfirst($val)
        );
    }

    protected function mi(): Attribute
    {
        return Attribute::make(
            set: fn ($val) => ucfirst($val)
        );
    }
    protected function imagePath(): Attribute
    {
        return Attribute::make(
            get: fn(?string $val) => $val ?  config('myconfig.app_url') . '/storage/' . $val : null
        );
    }
}
