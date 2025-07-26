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
                'location_type_id' => 3,
                'name' => 'Main Office',
                'address' => 'Jl. Gatot Subroto No.1, Medan, Sumatera Utara',
                'postal_code' => '12345',
                'description' => 'Kantor pusat perusahaan',
                'latitude' => 3.595226750097991,
                'longitude' => 98.67200113297093,
            ],
            [
                'location_type_id' => 1,
                'name' => 'Gudang Utama',
                'address' => 'Jl. Raya Industri No.10, Medan, Sumatera Utara',
                'postal_code' => '67890',
                'description' => 'Depan toko elektronik',
                'latitude' => 3.5858039067676,
                'longitude' => 98.650457630164,
            ],
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
                'location_type_id' => 4,
                'name' => 'SPBU Simpang Lima',
                'address' => 'Jl. Simpang Lima No.1, Medan, Sumatera Utara',
                'postal_code' => '33445',
                'description' => 'SPBU 24 jam',
                'latitude' => 3.5934567890123,
                'longitude' => 98.6701234567890,
            ],
        ];

        foreach ($locations as $location) {
            \App\Models\Location::create($location);
        }

        $this->command->info('Location table seeded successfully.');
    }
}
