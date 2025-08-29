<?php

namespace App\Exports;

use App\Entities\DeliveryStatusEntities;
use App\Entities\TripStatusEntities;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
// Removed unused FromCollection import
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CommissionReportExport implements FromCollection, WithHeadings
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
        $reports = DB::table('trips')
            ->join('deliveries', 'trips.delivery_id', '=', 'deliveries.id')
            ->join('users as drivers', 'deliveries.driver_id', '=', 'drivers.id')
            ->leftJoin('users as helpers', 'deliveries.helper_id', '=', 'helpers.id')
            ->where('deliveries.status', DeliveryStatusEntities::COMPLETED)
            ->where('trips.status', TripStatusEntities::COMPLETED)
            ->whereBetween('deliveries.created_at', [$this->from, $this->to])
            ->select(
                DB::raw('COUNT(trips.id) as total_trips'),
                DB::raw('SUM(trips.trip_distance) as total_distance'),
                DB::raw('SUM(trips.trip_duration / 60) as total_duration'),
                'drivers.id as driver_id',
                'drivers.name as driver_name',
                'helpers.name as helper_name',
                'helpers.id as helper_id',
                DB::raw('ROUND(SUM(trips.trip_distance) * 200, 2) as total_commission'),
                DB::raw('MAX(trips.created_at) as last_trip_date')
            )
            ->groupBy('deliveries.driver_id')
            // ->groupBy('deliveries.helper_id')
            ->get();

        return $reports->map(function ($report) {
            return [
                'driver_id' => $report->driver_id,
                'driver_name' => $report->driver_name,
                'helper_id' => $report->helper_id ?? '-',
                'helper_name' => $report->helper_name ?? '-',
                'total_trips' => $report->total_trips ?? 0,
                'total_distance' => $report->total_distance ?? 0,
                'total_duration' => $report->total_duration ?? 0,
                'total_commission' => $report->total_commission ?? 0,
                'last_trip_date' => $report->last_trip_date ? Carbon::parse($report->last_trip_date)->format('Y-m-d H:i:s') : '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID Pengemudi',
            'Nama Pengemudi',
            'ID Helper',
            'Nama Helper',
            'Total Perjalanan',
            'Total Jarak (km)',
            'Total Durasi (menit)',
            'Total Komisi (IDR)',
            'Tanggal Perjalanan Terakhir',
        ];
    }
}
