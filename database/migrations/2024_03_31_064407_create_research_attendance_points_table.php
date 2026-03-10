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
        Schema::create('research_attendance_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_attendances_id')->constrained('research_attendances')->cascadeOnDelete();
            $table->double('formula');
            $table->double('points');
            $table->string('rating');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_attendance_points');
    }
};
