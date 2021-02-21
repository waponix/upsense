<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User as User;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'username' => $this->faker->unique()->name,
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'mobile' => $this->faker->unique()->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'menuroles' => 'user'
        ];
    }

    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'menuroles' => 'user,manager,admin',
            ];
        });
    }
}
