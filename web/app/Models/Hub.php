<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hub extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The hub that belong to the zone.
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }
    /**
     * Get the Sensors that belongs to hub.
     */
    public function sensors()
    {
        return $this->hasMany(Sensor::class, 'hub_id');
    }
}
