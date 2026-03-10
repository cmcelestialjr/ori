<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\ResearchMonitoringForm;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('research_documents', function (Blueprint $table) {
            $table->id();
            $table->string('file_path')->nullable();
            $table->string('status')->nullable();
            $table->foreignId('researchmonitoringform_id')
                    ->constrained('research_monitoring_forms')
                    ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_documents');
    }
};
