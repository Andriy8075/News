<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request) {
        // more complicated logic with AI feed expected in real project
        $news = News::latest()->take(config('models.news.feed_count'))->get();

        return view('news.index', compact('news'));
    }

    public function show(Request $request, $id) {
        $news = News::with(['tags', 'user'])->findOrFail($id);

        // Increment views counter
        $news->increment('views');

        // Format response to match frontend expectations
        $response = [
            'id' => $news->id,
            'title' => $news->title,
            'excerpt' => $news->excerpt,
            'content' => $news->content,
            'image' => $news->image 
                ? asset('storage/news_preview_images/' . $news->image)
                : null,
            'category' => $news->category,
            'author' => $news->user ? $news->user->name : 'Unknown author',
            'date' => $news->date instanceof \Carbon\Carbon 
                ? $news->date->format('Y-m-d') 
                : ($news->date ? (string) $news->date : null),
            'views' => $news->views,
            'likes' => $news->likes()->count(), // requires rewriting to decrease database load
            'tags' => $news->tags->pluck('name')->toArray(),
            'liked' => $news->likes()->where('user_id', auth()->id())->exists(),
        ];

        return response()->json($response);
    }

    public function store(Request $request) {
        $maxLengths = config('models.news.validation.max_lengths');

        $validated = $request->validate([
            'title' => 'required|string|max:' . $maxLengths['title'],
            'excerpt' => 'required|string|max:' . $maxLengths['excerpt'],
            'content' => 'required|string|max:' . $maxLengths['content'],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:' . config('models.news.validation.preview_image_max_size'),
            'category' => 'required|string|exists:categories,name',
            'tags' => 'nullable|array|max:' . config('models.news.tags_max_count'),
            'tags.*' => 'string|max:' . $maxLengths['tag'],
        ]);

        // Set default values
        $validated['user_id'] = auth()->id();
        $validated['date'] = now()->format('Y-m-d');
        $validated['views'] = 0;
        $validated['likes'] = 0;

        // Handle image file upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            // Generate random hash for filename
            $hash = Str::random(40) . '_' . time();
            $extension = $image->getClientOriginalExtension();
            $filename = $hash . '.' . $extension;
            
            // Store image in storage/app/public/news_preview_images
            $image->storeAs('news_preview_images', $filename, 'public');
            
            // Save hash as path to preview image in database (full filename: hash.extension)
            $validated['image'] = $filename;
        } else {
            unset($validated['image']);
        }

        // Extract tags from validated data (if present)
        $tagsInput = $validated['tags'] ?? null;
        unset($validated['tags']);

        $news = News::create($validated);

        // Handle tags relationship via Tag model
        if ($tagsInput) {
            // Convert comma-separated string to array if needed
            if (is_string($tagsInput)) {
                $tagsInput = array_filter(array_map('trim', explode(',', $tagsInput)));
            }

            $tagIds = collect($tagsInput)
                ->filter()
                ->map(function ($tagName) {
                    return Tag::firstOrCreate(['name' => $tagName])->id;
                })
                ->all();

            if (!empty($tagIds)) {
                $news->tags()->sync($tagIds);
            }
        }

        return response()->json([
            'message' => 'News created successfully',
            'data' => $news
        ], 201);
    }
}
