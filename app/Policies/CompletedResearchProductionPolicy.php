<?php

namespace App\Policies;

use App\Models\CompletedResearchProduction;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CompletedResearchProductionPolicy
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
    public function view(User $user, CompletedResearchProduction $completed): bool
    {
        if($user->can('research-monitoring-form-show')){
            return true;
        }
        
        return $user->id == $presented->researchmonitoringform->users->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CompletedResearchProduction $completed): bool
    {
        return ($user->can('research-monitoring-form-update') && $user->id == $presented->researchmonitoringform->users->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CompletedResearchProduction $completed): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CompletedResearchProduction $completed): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CompletedResearchProduction $completed): bool
    {
        //
    }
}
