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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_type_id')->constrained('location_types')->onDelete('cascade');
            $table->string('name'); // Nama lokasi (misalnya: toko, gudang, pelanggan)
            $table->string('address'); // Alamat lokasi
            $table->string('postal_code')->nullable();
            $table->text('description')->nullable(); // Deskripsi tambahan
            $table->string('latitude')->nullable(); // Latitude untuk lokasi
            $table->string('longitude')->nullable(); // Longitude
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
