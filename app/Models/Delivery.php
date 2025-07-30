<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Delivery extends Model
{
    protected $fillable = [
        'id',
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
    protected $keyType = 'string';
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    protected $casts = [
        'id' => 'string',
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public static function generateId()
    {
        $datePart = Carbon::now()->format('ymd');
        $randomPart = strtoupper(Str::random(5));
        return strtoupper("D-{$datePart}-{$randomPart}");
    }

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

    public function staff()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function cancelledStaff()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }
}
