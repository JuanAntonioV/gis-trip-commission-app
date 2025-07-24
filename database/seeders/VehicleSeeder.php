<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Vehicle::count() > 0) {
            $this->command->info('Vehicles table already seeded.');
            return;
        }

        $vehicles = [
            ['name' => 'Toyota Avanza', 'license_plate' => 'B 1234 ABC', 'type' => 'MPV', 'capacity' => 7, 'available' => true],
            ['name' => 'Honda CR-V', 'license_plate' => 'B 5678 DEF', 'type' => 'SUV', 'capacity' => 5, 'available' => true],
            ['name' => 'Suzuki Carry', 'license_plate' => 'B 9101 GHI', 'type' => 'Pickup', 'capacity' => 3, 'available' => false],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }

        $this->command->info('Vehicles table seeded successfully.');
    }
}
