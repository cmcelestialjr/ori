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
        Schema::create('research_sdg', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sdgmapping_id')->constrained('sdg_mappings')->cascadeOnDelete();
            // CHANGE THIS LINE:
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('research_agenda', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agendamapping_id')->constrained('agenda_mappings')->cascadeOnDelete();
            // CHANGE THIS LINE:
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_sdg');
        Schema::dropIfExists('research_agenda');
    }
};
