<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'file_path',
        'video_link',
        'course_id',
        'lecturer_id',
    ];

    // Automatically add file_url when returning material data
    protected $appends = ['file_url'];

    // Generate full file URL from file_path
    public function getFileUrlAttribute()
    {
        if ($this->file_path) {
            return 'http://127.0.0.1:8000/storage/' . $this->file_path;
        }
        return null;
    }

    // A material belongs to one course
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    // A material belongs to one lecturer
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }
}