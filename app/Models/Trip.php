<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $table = 'trips';
    protected $primaryKey = 'id';
    public $guarded = ['id'];

    public function items()
    {
        return $this->belongsToMany(DeliveryItem::class, 'trip_items', 'trip_id', 'delivery_item_id')
            ->withTimestamps();
    }

    // Relation to the destination location
    public function destinationLocation()
    {
        return $this->belongsTo(Location::class, 'destination_location_id');
    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class, 'delivery_id');
    }

    public function status()
    {
        return $this->belongsTo(TripStatus::class, 'status');
    }

    public function tripStops()
    {
        return $this->hasMany(TripStop::class, 'after_trip_id');
    }

    // public function deliveryReports()
    // {
    //     return $this->belongsToMany(DeliveryReport::class, 'delivery_report_trips', 'trip_id', 'delivery_id')
    //         ->withTimestamps();
    // }
}
