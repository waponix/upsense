<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->string('image')->nullable();
            $table->string('username')->nullable();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('salt')->nullable();
            $table->string('mobile')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', array('user', 'manager', 'admin'))->default('user');
            $table->foreignId('zone_id');
            $table->integer('refresh_token_id')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
