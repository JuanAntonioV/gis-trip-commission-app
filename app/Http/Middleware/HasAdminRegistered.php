<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasAdminRegistered
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $alreadyRegistered = \App\Models\User::role('super admin')->exists();

        if (!$alreadyRegistered) {
            return redirect()->route('register');
        }

        return $next($request);
    }
}
