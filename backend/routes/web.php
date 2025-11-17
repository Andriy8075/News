<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;


Route::post('/news/store', [NewsController::class, 'create'])->middleware('editor')->name('news.post');
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('news/{id}', [NewsController::class, 'show'])->name('news.show');

require __DIR__.'/auth.php';
