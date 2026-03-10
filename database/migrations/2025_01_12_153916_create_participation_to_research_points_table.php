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
        Schema::create('participation_to_research_points', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('coverage');
            $table->decimal('points', 8, 2);
            $table->string('legend')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participation_to_research_points');
    }
};
