<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRoleOrPermission
{
    public function handle(Request $request, Closure $next, $roleOrPermission)
    {
        $user = $request->user();

        if (!$user || !($user->hasRole($roleOrPermission) || $user->hasPermission($roleOrPermission))) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
