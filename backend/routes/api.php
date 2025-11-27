<?php

use App\Http\Controllers\NewsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::post('register', [\App\Http\Controllers\ApiController::class, 'register'])->name('register');
Route::post('login', [\App\Http\Controllers\ApiController::class, 'login'])->name('login');

Route::get('news', [NewsController::class, 'index'])->middleware('auth:api')->name('news.index');

Route::post('news/store', [NewsController::class, 'store'])->middleware('auth:api')->name('news.store');
