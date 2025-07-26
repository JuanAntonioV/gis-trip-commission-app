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

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
