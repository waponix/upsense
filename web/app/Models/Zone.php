<?php

namespace App\Models;

use Carbon\Traits\Timestamp;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Zone extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Timestamp;
    protected $primaryKey = 'zone_id';


    /**
     * The company that belongs to zone
     */
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }


    /**
     * Get the Hubs that belongs to zone.
     */
    public function hubs() {
        return $this->hasMany(Hub::class, 'zone_id');
    }
}
