<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $auth, User $user): bool
    {
      return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $auth): bool
    {
        return true;
    }
}
