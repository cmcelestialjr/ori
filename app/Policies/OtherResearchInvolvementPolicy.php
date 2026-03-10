<?php

namespace App\Policies;

use App\Models\OtherResearchInvolvement;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OtherResearchInvolvementPolicy
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
    public function view(User $user, OtherResearchInvolvement $otherInvolvement): bool
    {
        if($user->can('research-monitoring-form-show')){
            return true;
        }
        
        return $user->id == $otherInvolvement->researchmonitoringform->users->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OtherResearchInvolvement $otherInvolvement): bool
    {
        return ($user->can('research-monitoring-form-update') && $user->id == $otherInvolvement->researchmonitoringform->users->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OtherResearchInvolvement $otherInvolvement): bool
    {
        if($user->can('research-monitoring-form-delete')){
            return true;
        }
        
        return $user->id == $otherInvolvement->researchmonitoringform->users->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, OtherResearchInvolvement $otherInvolvement): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, OtherResearchInvolvement $otherInvolvement): bool
    {
        //
    }
}
