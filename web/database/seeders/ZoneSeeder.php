<?php

namespace Database\Seeders;

use App\Models\Zone;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $numberOfZones = 5;

        for($i = 0; $i<$numberOfZones; $i++) {
            /*  insert zones   */
            Zone::create([
                'company_id' => rand(1, 3),
                'name' => 'Zone ' . $i
            ]);
        }
    }
}
