<?php

namespace Database\Seeders;

use App\Helpers\Formatter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Driver A',
                'email' => 'driver@gmail.com',
                'phone' => Formatter::formatPhoneNumber('08123456789'),
                'address' => '123 Admin Street',
                'birth_date' => '1990-01-01',
                'joined_at' => now(),
                'married' => false,
                'password' => Hash::make('user123'),
                'role' => 'driver',
            ],
            [
                'name' => 'Driver B',
                'email' => 'driver_b@gmail.com',
                'phone' => Formatter::formatPhoneNumber('08123456789'),
                'address' => '456 User Lane',
                'birth_date' => '1992-02-02',
                'joined_at' => now(),
                'married' => false,
                'password' => Hash::make('user123'),
                'role' => 'driver',
            ],
            [
                'name' => 'Driver C',
                'email' => 'driver_c@gmail.com',
                'phone' => Formatter::formatPhoneNumber('08123456789'),
                'address' => '789 Driver Blvd',
                'birth_date' => '1994-03-03',
                'joined_at' => now(),
                'married' => false,
                'password' => Hash::make('user123'),
                'role' => 'driver',
            ],
            [
                'name' => "Kernek A",
                'email' => 'kernek@gmail.com',
                'phone' => Formatter::formatPhoneNumber('08123456789'),
                'address' => '321 Kernek Street',
                'birth_date' => '1995-04-04',
                'joined_at' => now(),
                'married' => false,
                'password' => Hash::make('user123'),
                'role' => 'helper',
            ]
        ];

        foreach ($users as $user) {
            $newUser = \App\Models\User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'address' => $user['address'],
                'birth_date' => $user['birth_date'],
                'joined_at' => $user['joined_at'],
                'married' => $user['married'],
                'password' => $user['password'],
            ]);

            $newUser->assignRole($user['role']);
        }
    }
}
