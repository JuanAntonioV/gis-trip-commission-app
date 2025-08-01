<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripStop extends Model
{
    protected $table = 'trip_stops';
    protected $primaryKey = 'id';
    public $guarded = ['id'];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class, 'delivery_id');
    }

    public function status()
    {
        return $this->belongsTo(TripStatus::class, 'status');
    }
}
