<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\News;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:' . config('models.category.validation.max_lengths.name') . '|unique:categories,name',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
        ]);

        return response()->json([
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
                'message' => 'Cannot delete category because it is used in ' . $newsCount . ' news items',
                'error' => 'category_in_use'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }
}
