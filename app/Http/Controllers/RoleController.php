<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Traits\HttpResponses;

class RoleController extends Controller
{
    use HttpResponses;

    public function index()
    {
        $roles = Role::all();

        return $this->success($roles, 'Roles retrieved successfully');
    }
    public function update(Request $request, User $user)
    {
        $user->syncRoles($request->roles);

        return $this->success($user, 'User roles updated successfully');
    }
}
