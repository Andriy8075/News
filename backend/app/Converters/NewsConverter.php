<?php

namespace App\Converters;

use App\Models\News;

class NewsConverter {
    public static function toResponseArray($news)   {
        return $news->map(callback: function (News $item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'excerpt' => $item->excerpt,
                'content' => $item->content,
                'image' => $item->image_path
                    ? asset('storage/news_preview_images/' . $item->image_path)
                    : null,
                'category' => $item->category,
                'author' => $item->user ? $item->user->name : 'Unknown author',
                'date' => $item->date instanceof \Carbon\Carbon
                    ? $item->date->format('Y-m-d')
                    : ($item->date ? (string) $item->date : null),
                'views' => $item->views,
                'likes' => $item->likes()->count(),
                'tags' => $item->tags->pluck('name')->toArray(),
            ];
        });
    }
}
