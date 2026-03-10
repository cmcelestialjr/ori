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
        Schema::create('presented_research_productions', function (Blueprint $table) {
            $table->id();
            $table->string('date_presented');
            $table->string('conference_name');
            $table->string('conference_type');
            $table->string('conference_nature');
            $table->string('conference_place');
            $table->string('presentation_title');
            $table->string('presenter_name');
            $table->string('conference_organization');
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presented_research_productions');
    }
};
