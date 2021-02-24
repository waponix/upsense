<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\RoleHierarchy;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $numberOfUsers = 10;
        $faker = Faker::create();

        /* Create roles */
        $adminRole = Role::create(['name' => 'admin']);
        RoleHierarchy::create([
            'role_id' => $adminRole->id,
            'hierarchy' => 1,
        ]);
        $managerRole = Role::create(['name' => 'manager']);
        RoleHierarchy::create([
            'role_id' => $managerRole->id,
            'hierarchy' => 2,
        ]);
        $userRole = Role::create(['name' => 'user']);
        RoleHierarchy::create([
            'role_id' => $userRole->id,
            'hierarchy' => 3,
        ]);

        /*  insert users   */
        $user = User::create([
//            'username' => 'admin',
            'image' => '1.jpg',
            'first_name' => 'admin',
            'last_name' => 'admin',
            'mobile' => '1234567890',
            'email' => 'admin@admin.com',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'menuroles' => 'user,manager,admin',
            'zone_id' => 1
        ]);

        $user->assignRole(['user', 'manager', 'admin']);
        $imgNum = 2;
        for ($i = 0; $i < $numberOfUsers; $i++) {

            $user = User::create([
//                'username' => Str::random(8),
                'image' => $imgNum++ . '.jpg',
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'mobile' => $faker->unique()->phoneNumber,
                'email' => $faker->unique()->safeEmail(),
                'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
                'remember_token' => Str::random(10),
                'menuroles' => 'user',
                'zone_id' => rand(1, 5),
            ]);

            $user->assignRole('user');
        }
    }
}
