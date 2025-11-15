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
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
        'views' => 'integer',
        'likes' => 'integer',
    ];
}
