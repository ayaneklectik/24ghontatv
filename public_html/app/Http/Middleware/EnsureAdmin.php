<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()?->user_type !== 'Admin') {
            return response()->json([
                'message' => 'Forbidden. Administrator access is required.',
            ], 403);
        }

        return $next($request);
    }
}
