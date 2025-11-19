<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\News;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::withCount('news')
            ->orderByDesc('news_count')
            ->get();

        return response()->json($categories);
    }
}
