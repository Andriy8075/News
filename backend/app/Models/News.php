<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'image',
        'category',
        'author',
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
}
