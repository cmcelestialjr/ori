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
        Schema::create('awards_management', function (Blueprint $table) {
            $table->id();
            $table->decimal('min_range_points',8,2);
            $table->decimal('max_range_points',8,2)->nullable();
            $table->integer('incentive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('awards_management');
    }
};
