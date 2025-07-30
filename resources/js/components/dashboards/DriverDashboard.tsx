import { formatNumber } from '@/lib/utils';
import { driverDeliveryColumns } from '@/pages/deliveries/driverDeliveryColumns';
import { columns as tripColumns } from '@/pages/trips/columns';
import { Delivery, Trip } from '@/types';
import { usePage } from '@inertiajs/react';
import { DataTable } from '../DataTable';
import Heading from '../heading';
import HeadingSmall from '../heading-small';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

const DriverDashboard = () => {
    const serverProps = usePage().props;
    const isDriver = (serverProps?.is_driver as boolean) || false;
    const totalDeliveries = (serverProps?.total_deliveries as number) || 0;
    const totalProgressTrips = (serverProps?.total_progress_trips as number) || 0;
    const totalCompletedTrips = (serverProps?.total_completed_trips as number) || 0;
    const latestDeliveries = (serverProps?.latest_deliveries as Delivery[]) || [];
    const latestTrips = (serverProps?.latest_trips as Trip[]) || [];
    const fastestDurationOfTrip = (serverProps?.fastest_duration_of_trip as { hours: number; minutes: number }) || { hours: 0, minutes: 0 };

    if (!isDriver) {
        return null;
    }

    return (
        <main className="space-y-6 p-6">
            <header>
                <Heading
                    title="Selamat datang di PT. Kencana Abadi Sukses"
                    description="Dashboard ini memberikan ringkasan informasi penting terkait pengiriman dan trip."
                />
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className="p-4">
                    <CardContent className="space-y-2 px-0">
                        <p className="text-xs text-gray-400">Total Pengiriman Hari Ini</p>
                        <div className="text-2xl font-bold">{formatNumber(totalDeliveries)}</div>
                    </CardContent>
                </Card>
                <Card className="p-4">
                    <CardContent className="space-y-2 px-0">
                        <p className="text-xs text-gray-400">Total Waktu Tercepat</p>
                        <div className="text-2xl font-bold">
                            {fastestDurationOfTrip?.hours} <span className="text-sm font-normal text-gray-400">Jam</span>{' '}
                            {fastestDurationOfTrip?.minutes} <span className="text-sm font-normal text-gray-400">Menit</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="p-4">
                    <CardContent className="space-y-2 px-0">
                        <p className="text-xs text-gray-400">Total Trip Belum Selesai</p>
                        <div className="text-2xl font-bold">{formatNumber(totalProgressTrips)}</div>
                    </CardContent>
                </Card>
                <Card className="p-4">
                    <CardContent className="space-y-2 px-0">
                        <p className="text-xs text-gray-400">Total Trip Selesai</p>
                        <div className="text-2xl font-bold">{formatNumber(totalCompletedTrips)}</div>
                    </CardContent>
                </Card>
            </section>

            <section className="section">
                <HeadingSmall title="Pengiriman Saat Ini" description="Daftar pengiriman saat ini yang sedang berlangsung." />
                <Separator className="my-4" />
                <DataTable data={latestDeliveries} columns={driverDeliveryColumns} />
            </section>
            <section className="section">
                <HeadingSmall title="Trip Terakhir" description="Daftar trip terakhir yang telah dibuat." />
                <Separator className="my-4" />
                <DataTable data={latestTrips} columns={tripColumns} />
            </section>
        </main>
    );
};
export default DriverDashboard;
