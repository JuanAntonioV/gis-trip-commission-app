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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();

            $table->string('delivery_id')->constrained('deliveries')->onDelete('cascade');

            $table->foreignId('origin_location_id')->nullable()->constrained('locations')->onDelete('cascade');
            $table->foreignId('destination_location_id')->nullable()->constrained('locations')->onDelete('cascade');

            $table->foreignId('status')->constrained('trip_statuses')->onDelete('cascade');
            $table->text('notes')->nullable(); // Catatan tambahan untuk trip
            $table->text('cancellation_reason')->nullable(); // Alasan pembatalan trip jika ada

            $table->datetime('start_time'); // Waktu mulai trip
            $table->datetime('end_time'); // Waktu selesai trip
            $table->integer('starting_km');
            $table->integer('ending_km');

            $table->integer('trip_weight')->default(0); // Total berat barang dalam trip
            $table->integer('trip_distance')->default(0); // Total jarak tempuh
            $table->integer('trip_duration')->default(0);  // Dalam menit

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
