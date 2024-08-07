<?php

namespace Database\Seeders;

use App\Enums\Roles;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name'      => 'User',
            'last_name' => 'Test',
            'email'     => 'example@example.com',
            'password' => 'password'
        ]);//

        $user->roles()->attach(Role::where('name', 'user')->first());
        $user->assignRole(Roles::USER->value);
        $admin = User::factory()->create([
            'name'      => 'Admin',
            'last_name' => 'Test',
            'email'     => 'admin@admin.com',
            'password' => 'password'
        ]);//
        $admin->roles()->attach(Role::where('name', 'admin')->first());
        $admin->assignRole(Roles::ADMIN->value);
        $admin->givePermissionTo([
            'DELETE_USER',
            'EDIT_USER',
            'CREATE_USER'
        ]);
    }
}
