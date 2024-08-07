<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use \App\Http\Requests\AdminCreateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{

    public function index()
    {
        $users = User::with('roles')->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function store (AdminCreateUserRequest $request)
    {
        $validatedData = $request->validated();

        $user = User::create([
            'name' => $validatedData['name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        if (isset($validatedData['role'])) {
            $role = Role::find($validatedData['role']);
            if ($role) {
                $user->roles()->attach($role);
                $user->assignRole($role->name);
            }
        }

        $user->load('roles');
        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user,
        ]);
    }
    public function destroy($id)
    {
        // Encontre o usuário pelo ID
        $user = User::findOrFail($id);

        // Exclua o usuário
        $user->delete();
        return jsonResponse();
    }
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $validatedData = $request->validated();

        $user->update($validatedData);

        $user->load('roles');

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

}
