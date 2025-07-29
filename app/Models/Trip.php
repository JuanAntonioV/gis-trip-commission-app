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

    public function delivery()
    {
        return $this->belongsTo(Delivery::class, 'delivery_id');
    }

    public function status()
    {
        return $this->belongsTo(TripStatus::class, 'status');
    }

    // public function deliveryReports()
    // {
    //     return $this->belongsToMany(DeliveryReport::class, 'delivery_report_trips', 'trip_id', 'delivery_id')
    //         ->withTimestamps();
    // }
}
