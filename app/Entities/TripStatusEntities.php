<?php

namespace App\Entities;

class TripStatusEntities
{
    const IN_PROGRESS = 1;
    const COMPLETED = 2;
    const CANCELLED = 3;

    public static function getStatuses(): array
    {
        return [
            self::IN_PROGRESS,
            self::COMPLETED,
            self::CANCELLED,
        ];
    }
}
