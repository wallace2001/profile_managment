<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|min:8',
        ]);

        $credentials = request(['email', 'password']);
        Log::info('Attempting login', $credentials);
        if (!$token = Auth::attempt($credentials)) {
            return jsonResponse(status: 401, message: 'Unauthorized');
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        $user = Auth::user()->load('roles');

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            'user' => new UserResource($user)
        ]);
    }

    public function me()
    {
        return response()->json(Auth::user());
    }

    public function logout()
    {
        Auth::logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }
}
