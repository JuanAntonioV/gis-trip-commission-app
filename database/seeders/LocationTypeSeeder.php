<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (\App\Models\LocationType::count() > 0) {
            $this->command->info('Location types already seeded.');
            return;
        }

        $locationTypes = [
            ['name' => 'Gudang', 'description' => 'Tempat penyimpanan barang'],
            ['name' => 'Toko', 'description' => 'Tempat tujuan pengiriman barang'],
            ['name' => 'Kantor', 'description' => 'Tempat administrasi dan manajemen'],
            ['name' => 'Bengkel', 'description' => 'Tempat perbaikan kendaraan'],
            ['name' => 'Rest Area', 'description' => 'Area istirahat bagi pengemudi'],
            ['name' => 'Rumah Makan', 'description' => 'Tempat makan dan minum'],
            ['name' => 'Pemasok', 'description' => 'Penyedia barang atau jasa'],
            ['name' => 'Lainnya', 'description' => 'Jenis lokasi lainnya'],
        ];

        foreach ($locationTypes as $type) {
            \App\Models\LocationType::create($type);
        }

        $this->command->info('Location types seeded successfully.');
    }
}
