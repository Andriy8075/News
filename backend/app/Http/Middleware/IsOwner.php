<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\News;

class IsOwner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        if (!auth()->user()->editor) {
            return response()->json([
                'message' => 'Forbidden. Only editors can perform this action.'
            ], 403);
        }

        if (auth()->user()->id !== News::find($request->route('id'))->user_id) {

            return response()->json([
                'message' => 'Forbidden. You are not the owner of this piece of news.'
            ], 403);
        }

        return $next($request);
    }
}

