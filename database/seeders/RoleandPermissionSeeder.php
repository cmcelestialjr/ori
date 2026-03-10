<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleandPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {   
        //admin role and permission

        Permission::create(['name' => 'manage-users']);
        Permission::create(['name' => 'assign-permission']);
        Permission::create(['name' => 'assign-role']);
        Permission::create(['name' => 'manage-college']);
        Permission::create(['name' => 'manage-unit']);
        Permission::create(['name' => 'research-monitoring-form-update']);
        Permission::create(['name' => 'research-monitoring-form-review-documents']);
        Permission::create(['name' => 'research-monitoring-form-update-status']);
        Permission::create(['name' => 'research-monitoring-form-update-points']);
        Permission::create(['name' => 'research-monitoring-form-delete']);
        Permission::create(['name' => 'research-monitoring-form-store']);
        Permission::create(['name' => 'research-monitoring-form-show']);
        Permission::create(['name' => 'research-monitoring-form-index']);
        Permission::create(['name' => 'generate-report']);
        Permission::create(['name' => 'sdg-agenda-create']);
        Permission::create(['name' => 'sdg-agenda-delete']);
        Permission::create(['name' => 'upload-image']);

        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'manage-users',
            'assign-permission',
            'assign-role',
            'manage-college',
            'manage-unit',
            'research-monitoring-form-update-status',
            'research-monitoring-form-update-points',
            'research-monitoring-form-delete',
            'research-monitoring-form-show',
            'generate-report',
            'sdg-agenda-create',
            'sdg-agenda-delete',
            'upload-image'
        ]);
        
        Permission::create(['name' => 'upload-documents']);
        
        $facultyRole = Role::create(['name' => 'faculty']);
        $facultyRole->givePermissionTo('research-monitoring-form-store',
        'research-monitoring-form-update', 'research-monitoring-form-index','upload-documents', 'upload-image');

        $researchCoordinatorRole = Role::create(['name' => 'research-coordinator']);
        $researchCoordinatorRole->givePermissionTo('research-monitoring-form-review-documents', 'research-monitoring-form-update-status',
        'research-monitoring-form-index', 'research-monitoring-form-show');
        
        
    }
}
