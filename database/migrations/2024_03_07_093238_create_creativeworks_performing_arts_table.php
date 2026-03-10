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
        Schema::create('creativeworks_performing_arts', function (Blueprint $table) {
            $table->id();
            $table->string('creative_works_description');
            $table->string('title');
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creativeworks');
    }
};
