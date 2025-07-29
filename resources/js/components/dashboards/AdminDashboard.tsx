import { formatNumber } from '@/lib/utils';
import { columns as deliveryColumns } from '@/pages/deliveries/columns';
import { columns as tripColumns } from '@/pages/trips/columns';
import { Delivery, Trip } from '@/types';
import { usePage } from '@inertiajs/react';
import { DataTable } from '../DataTable';
import Heading from '../heading';
import HeadingSmall from '../heading-small';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';

const AdminDashboard = () => {
    const serverProps = usePage().props;
    const isAdmin = (serverProps?.is_admin as boolean) || false;
    const totalDeliveries = (serverProps?.total_deliveries as number) || 0;
    const totalAvailableVehicles = (serverProps?.total_available_vehicles as number) || 0;
    const totalProgressTrips = (serverProps?.total_progress_trips as number) || 0;
    const totalCompletedTrips = (serverProps?.total_completed_trips as number) || 0;
    const latestDeliveries = (serverProps?.latest_deliveries as Delivery[]) || [];
    const latestTrips = (serverProps?.latest_trips as Trip[]) || [];

    if (!isAdmin) {
        return null;
    }

    return (
        <main className="space-y-6 p-6">
            <header>
                <Heading
                    title="Selamat datang di PT. Kencana Abadi Sukses"
                    description="Aplikasi ini digunakan untuk mengelola data perjalanan dan komisi driver."
                />
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className="p-4">
                    <CardContent className="space-y-2 px-0">
                        <p className="text-xs text-gray-400">Total Pengiriman</p>
                        <div className="text-2xl font-bold">{formatNumber(totalDeliveries)}</div>
                    </CardContent>
                </Card>
                <Card className="p-4">
                    <CardContent className="space-y-2 px-0">
                        <p className="text-xs text-gray-400">Total Kendaraan Aktif</p>
                        <div className="text-2xl font-bold">{formatNumber(totalAvailableVehicles)}</div>
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
                <HeadingSmall title="Pengiriman Terakhir" description="Daftar pengiriman terakhir yang telah dibuat." />
                <Separator className="my-4" />
                <DataTable data={latestDeliveries || []} columns={deliveryColumns} />
            </section>
            <section className="section">
                <HeadingSmall title="Trip Terakhir" description="Daftar trip terakhir yang telah dibuat." />
                <Separator className="my-4" />
                <DataTable data={latestTrips || []} columns={tripColumns} />
            </section>
        </main>
    );
};
export default AdminDashboard;
