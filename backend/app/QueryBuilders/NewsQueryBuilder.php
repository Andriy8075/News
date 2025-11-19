<?php

namespace App\QueryBuilders;

class NewsQueryBuilder
{
    public static function build($type = null, $search = null, $user = null)
    {
        // Base query
        $query = \App\Models\News::query()->with(['tags', 'user', 'category']);

        // Filter according to type
        if ($type === 'liked') {
            if ($user) {
                $query->whereHas('likes', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            }
        } elseif ($type === 'created') {
            if ($user) {
                $query->where('user_id', $user->id);
            }
        }

        // Apply search filter (search in title, excerpt, content, or tag name)
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhereHas('tags', function($qt) use ($search) {
                      $qt->where('name', 'like', "%{$search}%");
                  });
            });
        }

        return $query;
    }
}

