<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sensor extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'sensor_id';

    /**
     * The hub that belong to the zone.
     */
    public function hub()
    {
        return $this->belongsTo(Hub::class, 'hub_id');
    }
}
