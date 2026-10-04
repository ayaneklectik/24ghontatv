<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if ($user->user_type === 'Admin') {
            return $next($request);
        }

        if ($permission === 'auth_only') {
            return $next($request);
        }

        $role = $user->userRole;

        if (!$role || (int) ($role->{$permission} ?? 0) !== 1) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have permission to perform this action.',
                'permission' => $permission,
            ], 403);
        }

        return $next($request);
    }
}
