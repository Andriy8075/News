<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json([
            'message' => 'Категорію успішно створено',
            'data' => $category
        ], 201);
    }

    public function delete(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        // Check if category is being used by any news
        $newsCount = News::where('category', $category->name)->count();
        
        if ($newsCount > 0) {
            return response()->json([
                'message' => 'Неможливо видалити категорію, оскільки вона використовується в ' . $newsCount . ' новинах',
                'error' => 'category_in_use'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Категорію успішно видалено'
        ], 200);
    }
}
