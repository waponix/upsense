<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $primaryKey = 'company_id';

    /**
     * Get the Zones that belongs to company.
     */
    public function zones()
    {
        return $this->hasMany(Zone::class, 'company_id');
    }
}
