<?php

namespace App\Policies;

use App\Models\ResearchMonitoringForm;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Enums\ResearchMonitoringFormStatus;
use Illuminate\Auth\Access\Response;    

class ResearchMonitoringFormPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ResearchMonitoringForm $researchMonitoringForm): bool
    {
        if($user->can('research-monitoring-form-show')) {
            return true;
        }
    
        return $user->id == $researchMonitoringForm->users->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return ($user->can('research-monitoring-form-store'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ResearchMonitoringForm $researchMonitoringForm): bool
    {
        if($user->can('research-monitoring-form-update')){
            return true;
        } 
        
        return $user->id == $researchMonitoringForm->users->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ResearchMonitoringForm $researchMonitoringForm): bool
    {
        if($user->can('research-monitoring-form-delete')) {
            return true;
        }
    
        return $user->id == $researchMonitoringForm->users->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ResearchMonitoringForm $researchMonitoringForm): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ResearchMonitoringForm $researchMonitoringForm): bool
    {
        //
    }
}
