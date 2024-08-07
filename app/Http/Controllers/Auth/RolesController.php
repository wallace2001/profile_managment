<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;

class RolesController extends Controller
{
    public function index()
    {
        $roles = Role::all();

        return response()->json([
            'roles' => $roles,
        ]);
    }
}
