<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'DELETE_USER']);
        Permission::create(['name' => 'EDIT_USER']);
        Permission::create(['name' => 'CREATE_USER']);
    }
}
