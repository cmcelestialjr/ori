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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fname');
            $table->string('lname');
            $table->string('mi')->nullable();
            $table->string('suffix')->nullable();
            $table->string('image_path')->nullable();
            $table->string('academic_rank')->nullable();
            $table->string('unit')->nullable();
            $table->string('college')->nullable();
            $table->string('email');
            $table->string('password');
			$table->string('sso_token')->nullable();
			$table->timestamp('sso_token_expires_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
