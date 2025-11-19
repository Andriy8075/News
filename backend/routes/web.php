<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;

Route::get('/user', function () {
    return response()->json([
        'user' => auth()->user(),
    ]);
});

Route::group(['middleware' => 'editor'], function () {
    Route::post('/news/store', [NewsController::class, 'store'])->middleware('editor')->name('news.store');
    Route::get('/mynews', [NewsController::class, 'myNews'])->name('myNews');
});
Route::group(['middleware' => 'owner'], function () {
    Route::patch('/news/{id}/update', [NewsController::class, 'update'])->middleware('owner')->name('news.update');
});

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('news/{id}', [NewsController::class, 'show'])->name('news.show');

require __DIR__.'/auth.php';
