<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHubsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hubs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('serial');
//            $table->string('description');
            $table->string('hw_version');
            $table->string('sw_version');
            $table->string('fw_version');
            $table->tinyInteger('is_connected')->default(0);
            $table->mediumInteger('signal_strength')->default(0);
            $table->mediumInteger('battery_status')->default(0);
            $table->dateTime('last_seen')->nullable();
            $table->string('min_temp')->default(0);
            $table->string('max_temp')->default(0);
            $table->string('type');
            $table->string('imei');
            $table->foreignId('zone_id');
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
        Schema::dropIfExists('hubs');
    }
}
