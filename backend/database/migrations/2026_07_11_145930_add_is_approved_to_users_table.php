<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            if (! Schema::hasColumn('courses', 'course_code')) {
                $table->string('course_code')->nullable()->after('id');
            }
            if (! Schema::hasColumn('courses', 'course_name')) {
                $table->string('course_name')->nullable()->after('course_code');
            }
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'course_name')) {
                $table->dropColumn('course_name');
            }
            if (Schema::hasColumn('courses', 'course_code')) {
                $table->dropColumn('course_code');
            }
        });
    }
};