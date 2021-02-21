<?php

namespace Database\Seeders;

use App\Models\Hub;
use App\Models\Sensor;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $numberOfSensors = 10;
        $faker = Faker::create();
        $description = [
            'Freezer',
            'Chiller',
        ];

        for ($i = 0; $i < $numberOfSensors; $i++) {
            /*  insert sensor   */
            Sensor::create([
                'hub_id' => rand(1, 5),
                'serial' => strtoupper(Str::random(10)),
                'description' => ucfirst($faker->citySuffix) . ' ' . $description[rand(0, 1)],
                'current_temp' => rand(-30, 5),
                'type' => 'TDL' . rand(1, 3),
                'is_connected' => $faker->boolean(70),
                'signal_strength' => rand(0, 100),
                'battery_status' => rand(0, 100),
                'last_seen' => now()
            ]);
        }
    }
}
