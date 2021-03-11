<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;


    /**
     * The logs that belong to the sensor.
     */
    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }
}
