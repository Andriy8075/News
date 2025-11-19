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
            ->take(config('models.category.news_form_count'))
            ->get();

        $response = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });

        return response()->json($response);
    }

    public function search(Request $request)
    {
        $query = $request->input('query', '');
        
        $categories = Category::withCount('news')
            ->where('name', 'like', "%{$query}%")
            ->orderByDesc('news_count')
            ->orderBy('name')
            ->take(config('models.category.news_form_count'))
            ->get();
            
        $response = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
            ];
        });
        
        return response()->json($response);
    }
}
