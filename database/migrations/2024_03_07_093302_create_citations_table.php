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
        Schema::create('citations', function (Blueprint $table) {
            $table->id();
            $table->string('research_title');
            $table->string('journal_title');
            $table->string('issno_vol_pages');
            $table->string('authors');
            $table->string('date');
            $table->string('publisher_name');
            $table->string('url_link');
            $table->string('cited_authors');
            $table->string('cited_article_title');
            $table->string('scopus_link')->nullable();
            $table->foreignId('researchmonitoringform_id')->constrained('research_monitoring_forms')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citations');
    }
};
