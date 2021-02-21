<?php

namespace Database\Factories;

use App\Models\Branches;
use Illuminate\Database\Eloquent\Factories\Factory;

class BranchesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Branches::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->sentence(4,true)
        ];
    }
}
