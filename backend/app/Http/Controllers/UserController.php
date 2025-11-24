<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Converters\UserConverter;

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
}