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
        Schema::create('intellectual_properties', function (Blueprint $table) {
            $table->id();
            $table->string('property_type');
            $table->string('title');
            $table->string('owner_name');
            $table->string('processor_name');
            $table->string('document_id');
            $table->string('registration_date');
            $table->string('acceptance_date')->nullable();
            $table->string('publication_date')->nullable();
            $table->string('grant_date')->nullable();
            $table->string('expiry_date')->nullable();
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intellectual_properties');
    }
};
