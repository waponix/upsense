<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSensorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sensors', function (Blueprint $table) {
            $table->increments('sensor_id')->unsigned();
            $table->foreignId('hub_id');
            $table->string('serial');
            $table->string('description');
            $table->string('current_temp')->default(0);
            $table->string('signal_strength')->default(0);
            $table->string('battery_status')->default(0);
            $table->string('is_connected')->default(0);
            $table->string('type');
            $table->string('last_seen')->nullable();
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
        Schema::dropIfExists('sensors');
    }
}
