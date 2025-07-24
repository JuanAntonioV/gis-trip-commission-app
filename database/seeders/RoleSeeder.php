<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Role::count() > 0) {
            $this->command->info('Roles already exist, skipping seeding.');
            return;
        }

        $rolePermissions = [
            'super admin' => [
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
            ],
            'admin' => [
                'view dashboard',
                'manage users',
                'manage vehicles',
                'manage deliveries',
                'manage trips',
                'manage stores',
                'view reports',
            ],
            'driver' => [
                'view dashboard',
                'manage trips',
            ],
            'helper' => [
                'view dashboard',
                'manage trips',
            ],
        ];

        $roles = [
            'super admin',
            'admin',
            'driver',
            'helper',
        ];

        foreach ($roles as $role) {
            $role = Role::create(['name' => $role]);

            if (isset($rolePermissions[$role->name])) {
                foreach ($rolePermissions[$role->name] as $permission) {
                    $role->givePermissionTo($permission);
                }
            }
            $this->command->info("Role '{$role->name}' created with permissions.");
        }
    }
}
