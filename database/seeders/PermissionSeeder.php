<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Permission::count() > 0) {
            $this->command->info('Permissions already exist, skipping seeding.');
            return;
        }

        $permissions = [
            'view dashboard',
            'manage users',
            'manage vehicles',
            'manage deliveries',
            'manage trips',
            'manage stores',
            'manage roles',
            'manage permissions',
            'view commissions',
            'view reports',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $this->command->info('Permissions seeded successfully.');
    }
}
