<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use Notifiable;
    use SoftDeletes;
    use HasRoles;
    use HasFactory;

    protected $primaryKey = 'user_id';
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'first_name', 'last_name', 'email', 'mobile', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $dates = [
        'deleted_at'
    ];

    protected $attributes = [
        'menuroles' => 'user',
    ];

    /**
     * The zones that belong to the user.
     */
    public function zones()
    {
        return $this->belongsToMany(Zone::class, 'zone_users', 'user_id', 'zone_id');
    }

}
