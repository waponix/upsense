<?php

namespace Database\Seeders;

use App\Models\Log;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class LogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $numberOfLogs = 25;
        $faker = Faker::create();

        for($i = 0; $i<$numberOfLogs; $i++) {
            /*  insert logs   */
            Log::create([
                'sensor_id' => rand(1, 10),
                'duration' => rand(1, 10),
                'min_temp' => rand(-30, -10),
                'max_temp' => rand(-10, 10),
                'alert_datetime' => now()
            ]);
        }
    }
}
