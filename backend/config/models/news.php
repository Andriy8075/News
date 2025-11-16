<?php

return [
    "feed_count" => 9,
    "preview_image_max_size" => 5120,
    "tags_max_count" => 10,

    "validation" => [
        "max_lengths" => [
            "title" => 255,
            "excerpt" => 500,
            "image" => 500,
            "author" => 255,
            "tag" => 50,
            "content" => 10000,
        ],
    ],
];
