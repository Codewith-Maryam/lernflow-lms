<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // -----------------------------------------------
    // REGISTER
    // Only students and lecturers can register
    // Status is set to 'pending' by default
    // -----------------------------------------------
    public function register(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:student,lecturer',
        ]);

        // Create the new user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password), // hash the password
            'role'     => $request->role,
            'status'   => 'pending', // always pending at registration
        ]);

        // Return success response
        return response()->json([
            'message' => 'Registration successful. Please wait for admin approval.',
            'user'    => $user,
        ], 201);
    }

    // -----------------------------------------------
    // LOGIN
    // Check email, password, and status
    // -----------------------------------------------
    public function login(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Check if account is pending
        if ($user->status === 'pending') {
            return response()->json([
                'message' => 'Your account is waiting for Admin approval.',
            ], 403);
        }

        // Check if account is rejected
        if ($user->status === 'rejected') {
            return response()->json([
                'message' => 'Your account has been rejected. Contact admin.',
            ], 403);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return user data and token
        return response()->json([
            'message'      => 'Login successful.',
            'token'        => $token,
            'role'         => $user->role,
            'user'         => $user,
        ], 200);
    }

    // -----------------------------------------------
    // LOGOUT
    // Delete the current user's token
    // -----------------------------------------------
    public function logout(Request $request)
    {
        // Delete the token used to login
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ], 200);
    }
}