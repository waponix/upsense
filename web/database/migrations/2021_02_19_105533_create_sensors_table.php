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
            $table->increments('id')->unsigned();
            $table->foreignId('hub_id');
            $table->string('serial');
            $table->string('description');
            $table->mediumInteger('current_temp')->default(0);
            $table->mediumInteger('signal_strength')->default(0);
            $table->mediumInteger('battery_status')->default(0);
            $table->tinyInteger('is_connected')->default(0);
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
