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
        Schema::create('published_research_productions', function (Blueprint $table) {
            $table->id();
            $table->string('date');
            $table->string('coverage');
            $table->string('indexing');
            $table->string('journal_name');
            $table->string('issno_vol_pages');
            $table->string('editor_publisher');
            $table->string('article_link');
            $table->integer('num_citations_date');
            $table->string('scopus_link')->nullable();
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
        Schema::dropIfExists('published_research_productions');
    }
};
