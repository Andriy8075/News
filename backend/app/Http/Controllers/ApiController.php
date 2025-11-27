<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ApiController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('admin');
    }

    public function register(Request $request)
    {
        $user = User::create(array_merge(
            $request->only('name', 'email'),
            ['password' => bcrypt($request->password),
            'api_token' => \Str::random(60)]
            ));
        
        //return response()->json([
        //    'message' => 'You were successfully registered. Use your email and password to sign in.'
        //], 200);

        return response()->json([
            'token_type' => 'Bearer',
            'name' => $user->name,
            'api_token' => $user->api_token,
        ], 200);
    }

     /**
     * Make login-api.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        if (! \Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'You cannot sign with those credentials',
                'errors' => 'Unauthorised'
            ], 401);
        }
       
        return response()->json([
            'token_type' => 'Bearer',
            'name' => \Auth::user()->name,
            'api_token' => \Auth::user()->api_token, //!!!
        ], 200);
    }
}
