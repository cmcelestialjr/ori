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
        Schema::create('completed_research_productions', function (Blueprint $table) {
            $table->id();
            $table->string('date_completed');
            $table->string('nature_fund_source');
            $table->string('target_date_publication');
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->foreignId('research_id')->constrained('research');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('completed_research_productions');
    }
};
