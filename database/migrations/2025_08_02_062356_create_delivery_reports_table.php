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
        Schema::create('delivery_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('delivery_id')->index();
            $table->unsignedBigInteger('vehicle_id')->index();
            $table->unsignedBigInteger('driver_id')->index();
            $table->unsignedBigInteger('helper_id')->nullable()->index();
            $table->integer('total_weight')->default(0); // Total weight of the delivery
            $table->integer('total_distance')->default(0); // Total distance of the delivery
            $table->integer('total_duration')->default(0); // Total duration of the delivery
            $table->integer('commission_price')->default(0); // Commission for the delivery
            $table->integer('total_commission')->default(0); // Total commission for the delivery
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_reports');
    }
};
