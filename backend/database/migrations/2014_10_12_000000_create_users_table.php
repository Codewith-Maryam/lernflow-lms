<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // This function creates the users table
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                          // auto increment ID
            $table->string('name');                // user's full name
            $table->string('email')->unique();     // email must be unique
            $table->string('password');            // hashed password
            $table->enum('role', ['admin', 'lecturer', 'student']); // user role
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // account status
            $table->timestamps();                  // created_at and updated_at
        });
    }

    // This function deletes the table if we roll back
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};