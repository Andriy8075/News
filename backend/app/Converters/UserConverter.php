<?php

namespace App\Converters;

use App\Models\News;

class UserConverter {
    public static function toResponseArray($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified' => $user->email_verified_at ? true : false,
            'editor' => $user->editor ? true : false,
        ];
    }
}