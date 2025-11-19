<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'image_path',
        'category_id',
        'user_id',
        'date',
        'views',
        'likes',
    ];

    protected $casts = [
        'date' => 'date',
        'views' => 'integer',
        'likes' => 'integer',
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'news_tags');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'news_user_likes');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
