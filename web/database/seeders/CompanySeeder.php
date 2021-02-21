<?php

namespace Database\Seeders;

use App\Models\Company;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $numberOfCompanies = 3;
        $faker = Faker::create();

        for($i = 0; $i<$numberOfCompanies; $i++) {
            /*  insert companies   */
            Company::create([
                'name' => $faker->company,
            ]);
        }
    }
}
