<?php

namespace Database\Seeders;

use App\Enums\Roles;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cria roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        $deletePermission = Permission::where('name', 'DELETE_USER')->first();
        $editPermission = Permission::where('name', 'EDIT_USER')->first();
        $createPermission = Permission::where('name', 'CREATE_USER')->first();

        // Associa permissões aos roles
        $adminRole->permissions()->attach([$deletePermission->id, $editPermission->id, $createPermission->id]);
        $userRole->permissions()->attach([$editPermission->id]);
    }
}
