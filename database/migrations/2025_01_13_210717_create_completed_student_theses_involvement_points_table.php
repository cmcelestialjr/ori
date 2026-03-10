<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('completed_student_theses_involvement_points', function (Blueprint $table) {
            $table->id();
            $table->string('research_involvement');
            $table->decimal('undergraduate_points', 8,2);
            $table->decimal('graduate_points', 8,2);
            $table->decimal('dissertation', 8,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('completed_student_theses_involvement_points');
    }
};
