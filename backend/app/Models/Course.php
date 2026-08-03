<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    // These fields can be filled when creating a course
   protected $fillable = [
    'course_name',
    'course_code',
    'description',
    'lecturer_id',
    'instructor',
    'image',
];

    // A course belongs to one lecturer (who is a user)
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    // A course can have many materials
    public function materials()
    {
        return $this->hasMany(Material::class, 'course_id');
    }
}