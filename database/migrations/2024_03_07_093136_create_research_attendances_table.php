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
        Schema::create('research_attendances', function (Blueprint $table) {
            $table->id();
            $table->string('date');
            $table->string('organizer');
            $table->string('research_title');
            $table->string('place');
            $table->string('coverage');
            $table->string('attendance_nature');
            $table->string('fund_source_nature');
            $table->string('conference_type');
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_attendances');
    }
};
