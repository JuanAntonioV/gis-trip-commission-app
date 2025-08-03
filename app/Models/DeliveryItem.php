<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryItem extends Model
{
    protected $fillable = [
        'delivery_id',
        'location_id',
        'invoice_number',
        'weight',
    ];

    protected $casts = [
        'delivery_id' => 'string',
    ];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function tripItem()
    {
        return $this->hasOne(TripItem::class);
    }

    public function trip()
    {
        return $this->belongsToMany(Trip::class, 'trip_items', 'delivery_item_id', 'trip_id')
            ->withTimestamps();
    }
}
