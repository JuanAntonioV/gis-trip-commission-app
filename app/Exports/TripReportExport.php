<?php

namespace App\Exports;

use App\Entities\DeliveryStatusEntities;
use App\Entities\TripStatusEntities;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
// Removed unused FromCollection import
use Maatwebsite\Excel\Concerns\WithHeadings;

class TripReportExport implements FromCollection, WithHeadings
{
    use Exportable;

    public $from;
    public $to;

    public function __construct(string|null $from, string|null $to)
    {
        $this->from = $from ? Carbon::parse($from)->startOfDay() : Carbon::now()->subDays(30)->startOfDay()->toDateString();
        $this->to = $to ? Carbon::parse($to)->endOfDay() : Carbon::now()->endOfDay()->toDateString();
    }

    public function collection()
    {
        $trips = DB::table('trips')
            ->join('deliveries', 'trips.delivery_id', '=', 'deliveries.id')
            ->join('trip_statuses', 'trips.status', '=', 'trip_statuses.id')
            ->join('locations as destination', 'trips.destination_location_id', '=', 'destination.id')
            ->join('users as drivers', 'deliveries.driver_id', '=', 'drivers.id')
            ->join('trip_items', 'trips.id', '=', 'trip_items.trip_id')
            ->leftJoin('users as helpers', 'deliveries.helper_id', '=', 'helpers.id')
            ->where('trips.status', TripStatusEntities::COMPLETED)
            ->whereBetween('deliveries.created_at', [$this->from, $this->to])
            ->select(
                'trips.id as trip_id',
                'drivers.id as driver_id',
                'drivers.name as driver_name',
                'helpers.id as helper_id',
                'helpers.name as helper_name',
                'destination.name as destination_name',
                DB::raw('COUNT(trip_items.id) as total_items'),
                DB::raw('SUM(trips.trip_distance) as total_distance'),
                DB::raw('SUM(trips.trip_duration / 60) as total_duration'), // Convert seconds to minutes
                DB::raw('ROUND(SUM(trips.trip_duration / 60) * 200, 2) as total_commission'),
            )
            ->groupBy('trips.id')
            ->get();

        $tripStops = DB::table('trip_stops')
            ->join('trip_statuses', 'trip_stops.status', '=', 'trip_statuses.id')
            ->where('status', TripStatusEntities::COMPLETED)
            ->whereBetween('trip_stops.created_at', [$this->from, $this->to])
            ->select(
                'trip_stops.id as stop_id',
                'destination_name as stop_destination',
                'notes as stop_notes',
                DB::raw('SUM(trip_duration) as total_stop_duration'),
                DB::raw('SUM(trip_distance) as total_stop_distance'),
                'trip_statuses.name as stop_status',
                'after_trip_id',
                'before_trip_id',
                'trip_stops.created_at as stop_created_at',
                'trip_stops.updated_at as stop_updated_at'
            )
            ->groupBy('trip_stops.id')
            ->get();

        $mergedTrips = $trips->map(function ($trip) use ($tripStops) {
            $matchingStops = $tripStops->filter(function ($stop) use ($trip) {
                return $stop->after_trip_id == $trip->trip_id;
            });

            if ($matchingStops->isEmpty()) {
                return (object) [
                    'driver_id' => $trip->driver_id,
                    'driver_name' => $trip->driver_name,
                    'helper_id' => $trip->helper_id ?? '-',
                    'helper_name' => $trip->helper_name ?? '-',
                    'destination_name' => $trip->destination_name,
                    'total_items' => $trip->total_items,
                    'total_distance' => $trip->total_distance,
                    'total_duration' => $trip->total_duration,
                    'total_commission' => $trip->total_commission,
                    'stop_id' => '-',
                    'stop_notes' => '-',
                    'stop_status' => '-',
                    'stop_created_at' => '-',
                    'stop_updated_at' => '-',
                ];
            }

            return $matchingStops->map(function ($stop) use ($trip) {
                return (object) [
                    'driver_id' => $trip->driver_id,
                    'driver_name' => $trip->driver_name,
                    'helper_id' => $trip->helper_id ?? '-',
                    'helper_name' => $trip->helper_name ?? '-',
                    'destination_name' => $stop->stop_destination ?? $trip->destination_name,
                    'total_items' => $trip->total_items ?? '-',
                    'total_distance' => $stop->total_stop_distance ?? $trip->total_distance,
                    'total_duration' => $stop->total_stop_duration ?? $trip->total_duration,
                    'total_commission' => $trip->total_commission ?? '-',
                    'stop_id' => $stop->stop_id ?? '-',
                    'stop_notes' => $stop->stop_notes ?? '-',
                    'stop_status' => $stop->stop_status ?? '-',
                    'stop_created_at' => $stop->stop_created_at ?? '-',
                    'stop_updated_at' => $stop->stop_updated_at ?? '-',
                ];
            })->first();
        })->sortBy('stop_created_at');

        return $mergedTrips;
    }

    public function headings(): array
    {
        return [
            'ID Pengemudi',
            'Nama Pengemudi',
            'ID Helper',
            'Nama Helper',
            'Nama Tujuan',
            'Total Item',
            'Total Jarak (km)',
            'Total Durasi (menit)',
            'Total Komisi',
            'ID Pemberhentian',
            'Catatan Pemberhentian',
            'Status Pemberhentian',
            'Waktu Dibuat Pemberhentian',
            'Waktu Diperbarui Pemberhentian'
        ];
    }
}
