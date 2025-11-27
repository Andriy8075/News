<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect(route('login'));
});

Route::group(['middleware' => 'editor'], function () {
    Route::post('/news/store', [NewsController::class, 'store'])->middleware('editor')->name('news.store');
    Route::get('/mynews', [NewsController::class, 'myNews'])->name('myNews');
});
Route::group(['middleware' => 'owner'], function () {
    Route::delete('/news/{id}/delete', [NewsController::class, 'destroy'])->middleware('owner')->name('news.destroy');
    Route::patch('/news/{id}/update', [NewsController::class, 'update'])->middleware('owner')->name('news.update');
});

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('news/{id}', [NewsController::class, 'show'])->name('news.show');

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/search', [CategoryController::class, 'search'])->name('categories.search');

Route::group(['middleware' => 'auth'], function () {
    Route::patch('/update-profile', [UserController::class, 'updateProfile'])->name('updateProfile');
    Route::patch('/update-password', [UserController::class, 'updatePassword'])->name('updatePassword');
});

require __DIR__.'/auth.php';

