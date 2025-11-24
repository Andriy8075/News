<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Converters\UserConverter;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $userForResponse = UserConverter::toResponseArray($user);
        return response()->json([
            'user' => $userForResponse,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        ]);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email'])) {
            if ($user->email !== $data['email']) {
                $user->email = $data['email'];
                $user->email_verified_at = null;
            }
        }

        $user->save();

        return response()->json([
            'user' => UserConverter::toResponseArray($user),
        ], 200);
    }

    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        // Ensure user is authenticated
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Rate limiting to prevent brute force attacks
        $key = 'password-update:' . $user->id . ':' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'current_password' => [
                    'Too many attempts. Please try again in ' . ceil($seconds / 60) . ' minute(s).'
                ],
            ]);
        }

        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', Rules\Password::defaults()],
        ]);

        // Verify current password
        if (!Hash::check($data['current_password'], $user->password)) {
            RateLimiter::hit($key, 60); // 60 seconds decay
            return response()->json([
                'message' => 'Current password is incorrect.'
            ], 422);
        }

        // Prevent user from setting the same password
        if (Hash::check($data['new_password'], $user->password)) {
            return response()->json([
                'message' => 'New password must be different from your current password.'
            ], 422);
        }

        // Update password
        $user->password = Hash::make($data['new_password']);
        
        // Invalidate all remember tokens (force logout from other devices)
        $user->remember_token = null;
        
        $user->save();

        // Regenerate session to invalidate old sessions
        $request->session()->regenerate();

        // Log password change for security auditing
        Log::info('User password changed', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Clear rate limiter on success
        RateLimiter::clear($key);

        return response()->json([
            'success' => true,
        ], 200);
    }
}