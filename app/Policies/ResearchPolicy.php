<?php

namespace App\Policies;

use App\Models\Research;
use App\Models\User;

class ResearchPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Research $research): bool
    {
        return $user->can('research-monitoring-form-show' || $user->id == $research->user->id);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Research $research): bool
    {
        return $user->id == $research->user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Research $research): bool
    {
        return $user->can('research-monitoring-form-delete') || $user->id == $research->user->id;
    }
}
