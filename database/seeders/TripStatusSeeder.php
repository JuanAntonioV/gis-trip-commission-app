<?php

namespace Database\Seeders;

use App\Models\TripStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TripStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (TripStatus::count() > 0) {
            $this->command->info('TripStatus table already seeded.');
            return;
        }

        $statuses = [
            ['name' => 'In Progress'],
            ['name' => 'Completed'],
            ['name' => 'Cancelled'],
        ];

        foreach ($statuses as $status) {
            TripStatus::create($status);
        }

        $this->command->info('TripStatus table seeded successfully.');
    }
}
