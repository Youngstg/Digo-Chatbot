<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = ['session_id', 'user_name'];

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }
}
