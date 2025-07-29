<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripItem extends Model
{
    protected $table = 'trip_items';
    protected $primaryKey = 'id';
    public $guarded = ['id'];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function deliveryItem()
    {
        return $this->belongsTo(DeliveryItem::class, 'delivery_item_id');
    }
}
