<?php

namespace Database\Seeders;

use App\Models\Hub;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $numberOfHubs = 5;
        $faker = Faker::create();
//        $description = [
//            'Freezer',
//            'Chiller',
//        ];
        for($i = 0; $i<$numberOfHubs; $i++) {
            /*  insert hubs   */
            Hub::create([
                'zone_id' => rand(1, 5),
                'serial' => strtoupper(Str::random(10)),
//                'description' => ucfirst($faker->citySuffix) . ' ' . $description[rand(0,1)],
                'hw_version' => $faker->randomFloat(2,1,20),
                'sw_version' => $faker->randomFloat(2,1,10),
                'fw_version' => $faker->randomFloat(2,1,10),
                'min_temp' => rand(-30, -10),
                'max_temp' => rand(-10, 10),
                'type' => 'BRM.' . $faker->randomFloat(3,20,30),
                'imei' => $faker->creditCardNumber,
                'is_connected' => $faker->boolean(75),
                'signal_strength' => rand(0, 100),
                'battery_status' => rand(0, 100),
                'last_seen' => now()
            ]);
        }
    }
}
