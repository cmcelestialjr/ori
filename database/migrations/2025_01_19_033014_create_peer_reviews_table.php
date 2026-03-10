<?php

use App\Models\ResearchMonitoringForm;
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
        Schema::create('peer_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('journal_name')->nullable();
            $table->string('article_title')->nullable();
            $table->integer('article_reviewed')->nullable();
            $table->integer('abstract_reviewed')->nullable();
            $table->string('abstract_title')->nullable();
            $table->string('date_reviewed');
            $table->string('organization');
            $table->string('coverage');
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peer_reviews');
    }
};
