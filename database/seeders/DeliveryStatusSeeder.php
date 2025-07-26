<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeliveryStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (\App\Models\DeliveryStatus::count() > 0) {
            $this->command->info('DeliveryStatus table already seeded!');
            return;
        }

        $statuses = [
            ['name' => 'Pending'],
            ['name' => 'In Progress'],
            ['name' => 'Completed'],
            ['name' => 'Cancelled'],
        ];

        foreach ($statuses as $status) {
            \App\Models\DeliveryStatus::create($status);
        }

        $this->command->info('DeliveryStatus table seeded successfully.');
    }
}
