<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sensor extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The sensor that belong to the hub.
     */
    public function hub()
    {
        return $this->belongsTo(Hub::class);
    }

    /**
     * The logs that belong to the sensor.
     */
    public function logs()
    {
        return $this->hasMany(Log::class, 'sensor_id');
    }
}
