<?php

return [
    'title' => 'required|string|max:' . $maxLengths['title'],
    'excerpt' => 'required|string|max:' . $maxLengths['excerpt'],
    'content' => 'required|string|max:' . $maxLengths['content'],
    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:' . config('models.news.validation.preview_image_max_size'),
    'category' => 'required|string|exists:categories,name',
    'tags' => 'nullable|array|max:' . config('models.news.validation.tags_max_count'),
    'tags.*' => 'string|max:' . $maxLengths['tag'],
];  