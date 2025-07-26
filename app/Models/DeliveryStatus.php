<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryStatus extends Model
{
    protected $fillable = [
        'name',
    ];

    public function deliveries()
    {
        return $this->hasMany(Delivery::class, 'status');
    }
}
