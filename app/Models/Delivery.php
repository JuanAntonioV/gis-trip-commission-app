<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'helper_id',
        'scheduled_at',
        'started_at',
        'finished_at',
        'confirmed_at',
        'status',
        'created_by',
        'cancelled_by',
        'cancelled_at',
        'cancel_reason',
    ];

    public function items()
    {
        return $this->hasMany(DeliveryItem::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function status()
    {
        return $this->belongsTo(DeliveryStatus::class, 'status');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function helper()
    {
        return $this->belongsTo(User::class, 'helper_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
