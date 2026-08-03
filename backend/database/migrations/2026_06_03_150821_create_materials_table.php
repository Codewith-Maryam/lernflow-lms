<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // This function creates the materials table
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();                          // auto increment ID
            $table->string('title');               // material title
            $table->enum('type', ['note', 'pdf', 'video']); // type of material
            $table->string('file_path')->nullable(); // path to uploaded file
            $table->string('video_link')->nullable(); // YouTube or video URL
            $table->foreignId('course_id')         // links to courses table
                  ->constrained('courses')
                  ->onDelete('cascade');
            $table->foreignId('lecturer_id')       // links to users table
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};