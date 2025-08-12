<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (\App\Models\Location::count() > 0) {
            $this->command->info('Location table already seeded!');
            return;
        }

        $locations = [
            [
                'location_type_id' => 2,
                'name' => 'Toko A',
                'address' => 'Jl. Taman Sari No.5, Medan, Sumatera Utara',
                'postal_code' => '54321',
                'description' => 'Sebelah indomaret',
                'latitude' => 3.5910293137163,
                'longitude' => 98.65487791062,
            ],
            [
                'location_type_id' => 2,
                'name' => 'Toko B',
                'address' => 'Jl. Ahmad Yani No.20, Medan, Sumatera Utara',
                'postal_code' => '11223',
                'description' => 'Depan pasar tradisional',
                'latitude' => 3.592828217387,
                'longitude' => 98.663246402746,
            ],
            [
                'location_type_id' => 2,
                'name' => 'Toko C',
                'address' => 'Jl. Sisingamangaraja No.30, Medan, Sumatera Utara',
                'postal_code' => '33445',
                'description' => 'Dekat dengan kampus',
                'latitude' => 3.6244693021269,
                'longitude' => 98.674321665966,
            ]
        ];

        foreach ($locations as $location) {
            \App\Models\Location::create($location);
        }

        $this->command->info('Location table seeded successfully.');
    }
}
