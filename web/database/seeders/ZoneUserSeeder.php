<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ZoneUser;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class ZoneUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $faker = Faker::create();
        $users = User::all();

        foreach($users as $user) {
            /*  insert zones   */
            ZoneUser::create([
                'user_id' => $user->id,
                'zone_id' => rand(1, 5)
            ]);
        }
    }
}
