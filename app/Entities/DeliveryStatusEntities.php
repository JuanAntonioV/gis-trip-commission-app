<?php

namespace App\Entities;

class DeliveryStatusEntities
{
    const PENDING = 1;
    const IN_PROGRESS = 2;
    const COMPLETED = 3;
    const CANCELLED = 4;

    public static function getStatuses(): array
    {
        return [
            self::PENDING,
            self::IN_PROGRESS,
            self::COMPLETED,
            self::CANCELLED,
        ];
    }
}
