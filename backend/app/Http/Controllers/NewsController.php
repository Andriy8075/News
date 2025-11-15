<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request) {
        // more complicated logic with AI feed expected in real project
        $news = News::latest()->take(9)->get();

        return view('news.index', compact('news'));
    }

    public function show(Request $request, $id) {

    }

    public function store(Request $request) {
        $maxLengths = config('news.validation.max_lengths');

        $validated = $request->validate([
            'title' => 'required|string|max:' . $maxLengths['title'],
            'excerpt' => 'required|string|max:' . $maxLengths['excerpt'],
            'content' => 'required|string|max:' . $maxLengths['content'],
            'image' => 'nullable|url|max:' . $maxLengths['image'],
            'category' => 'required|string|exists:categories,name',
            'author' => 'nullable|string|max:' . $maxLengths['author'],
            'tags' => 'nullable|array|max:' . $maxLengths['tags'],
            'tags.*' => 'string|max:' . $maxLengths['tag'],
        ]);

        // Handle tags - convert string to array if needed
        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $validated['tags'] = array_filter(array_map('trim', explode(',', $validated['tags'])));
        }

        // Set default values
        $validated['author'] = $validated['author'] ?? 'Анонімний автор';
        $validated['date'] = now()->format('Y-m-d');
        $validated['views'] = 0;
        $validated['likes'] = 0;

        $news = News::create($validated);

        return response()->json([
            'message' => 'Новину успішно створено',
            'data' => $news
        ], 201);
    }
}
