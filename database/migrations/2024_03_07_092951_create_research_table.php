<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\ResearchType;
use App\Models\ResearchField;
use App\Models\SocioEconomicObjective;
use App\Models\User;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('research', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('authorship_nature');
            $table->string('authors');
            $table->foreignIdFor(ResearchType::class)->constrained();
            $table->foreignIdFor(SocioEconomicObjective::class)->constrained();
            $table->foreignIdFor(ResearchField::class)->constrained();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research');
    }
};
