<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Tag;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\ValidationRules\News as NewsValidationRules;
use App\Converters\NewsConverter;
use App\QueryBuilders\NewsQueryBuilder;

class NewsController extends Controller
{
    public function index(Request $request) {
        // more complicated logic with AI feed expected in real project

        $newsQuery = NewsQueryBuilder::build($request->input('type'), $request->input('search'), auth()->user());
        $news = $newsQuery->latest()->take(config('models.news.feed_count'))->get();

        $response = NewsConverter::toResponseArray($news);

        return response()->json($response, 200);
    }

    public function show(Request $request, $id) {
        $news = News::with(['tags', 'user', 'category'])->findOrFail($id);

        $news->increment('views');

        $response = [
            'id' => $news->id,
            'title' => $news->title,
            'excerpt' => $news->excerpt,
            'content' => $news->content,
            'image' => $news->image_path 
                ? asset('storage/news_preview_images/' . $news->image_path)
                : null,
            'category' => $news->category ? $news->category->name : null,
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
        $ValidationRules = NewsValidationRules::getRules();

        $validated = $request->validate($ValidationRules);

        $validated['user_id'] = auth()->id();
        $validated['date'] = now()->format('Y-m-d');
        $validated['views'] = 0;
        $validated['likes'] = 0;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Storage::disk('public')->putFile('news_preview_images', $image);
            $validated['image_path'] = basename($filename);
        }

        $category = Category::firstOrCreate(['name' => $validated['category']]);
        $validated['category_id'] = $category->id;
        unset($validated['category']);

        $tagsInput = $validated['tags'] ?? null;
        unset($validated['tags']);

        $news = News::create($validated);

        if ($tagsInput) {
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
            'id' => $news->id
        ], 201);
    }

    public function update(Request $request, $id) {
        $news = News::findOrFail($id);

        // Check authorization: user must be the owner or an editor
        if ($news->user_id !== auth()->id() && !auth()->user()->editor) {
            return response()->json([
                'message' => 'Forbidden. You can only update your own news.'
            ], 403);
        }

        $ValidationRules = NewsValidationRules::getRules();
        $validated = $request->validate($ValidationRules);

        if ($request->hasFile('image')) {
            if ($news->image_path) {
                Storage::disk('public')->delete('news_preview_images/' . $news->image_path);
            }

            $image = $request->file('image');
            $filename = Storage::disk('public')->putFile('news_preview_images', $image);
            $validated['image_path'] = basename($filename);
        }

        // Handle category - create if it doesn't exist
        if (isset($validated['category'])) {
            $category = Category::firstOrCreate(['name' => $validated['category']]);
            $validated['category_id'] = $category->id;
        }
        unset($validated['category']);

        // Extract tags from validated data
        $tagsInput = $validated['tags'] ?? null;
        unset($validated['tags']);

        // Don't allow updating user_id, views, or likes through this endpoint
        unset($validated['user_id'], $validated['views'], $validated['likes']);

        // Update news
        $news->update($validated);

        if ($tagsInput !== null) {
            if (is_string($tagsInput)) {
                $tagsInput = array_filter(array_map('trim', explode(',', $tagsInput)));
            }

            $tagIds = collect($tagsInput)
                ->filter()
                ->map(function ($tagName) {
                    return Tag::firstOrCreate(['name' => $tagName])->id;
                })
                ->all();

            $news->tags()->sync($tagIds);
        }
        $news->load(['tags', 'user']);

        return response()->json([
            'message' => 'News updated successfully',
            'data' => $news
        ], 200);
    }

    public function destroy(Request $request, $id) {
        $news = News::findOrFail($id);

            // Delete associated image if it exists
        if ($news->image_path) {
            Storage::disk('public')->delete('news_preview_images/' . $news->image_path);
        }

        // Delete the news item (tags will be automatically detached due to cascade)
        $news->delete();

        return response()->json([
            'message' => 'News deleted successfully'
        ], 200);
    }

    // public function myNews(Request $request) {
    //     $news = News::with(['tags', 'user', 'category'])
    //         ->where('user_id', auth()->id())
    //         ->latest()
    //         ->take(config('models.news.feed_count'))
    //         ->get();
    //     $response = NewsConverter::toResponseArray($news);

    //     return response()->json($response);
    // }
}
