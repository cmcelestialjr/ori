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
        Schema::create('research_monitoring_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_involvement_type_id')->constrained('research_involvement_types');
            $table->foreignId('users_id')->constrained('users')->cascadeOnDelete();
            $table->string('status');
            $table->string('reviewed_by')->nullable();
            $table->string('reviewed_at')->nullable();
            $table->string('evaluated_at')->nullable();
            $table->longText('rejected_message')->nullable();
            $table->boolean('is_archived');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('researchmonitoringforms');
    }
};
