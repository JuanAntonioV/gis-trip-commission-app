<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'location_type_id',
        'name',
        'address',
        'postal_code',
        'description',
        'latitude',
        'longitude',
    ];

    public function type()
    {
        return $this->belongsTo(LocationType::class, 'location_type_id');
    }
}
