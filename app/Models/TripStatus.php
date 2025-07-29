<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripStatus extends Model
{
    protected $table = 'trip_statuses';
    protected $primaryKey = 'id';
    public $guarded = ['id'];

    public function trips()
    {
        return $this->hasMany(Trip::class, 'status');
    }
}
