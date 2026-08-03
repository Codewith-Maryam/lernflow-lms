<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // These fields can be filled when creating a user
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    // These fields are hidden when returning JSON (never expose password)
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Password is automatically hashed
    protected $casts = [
        'password' => 'hashed',
    ];

    // One user (lecturer) can have many courses
    public function courses()
    {
        return $this->hasMany(Course::class, 'lecturer_id');
    }

    // One user (lecturer) can have many materials
    public function materials()
    {
        return $this->hasMany(Material::class, 'lecturer_id');
    }
}