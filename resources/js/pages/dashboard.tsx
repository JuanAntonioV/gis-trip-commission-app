import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DriverDashboard from '@/components/dashboards/DriverDashboard';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <AdminDashboard />
            <DriverDashboard />
        </AppLayout>
    );
}
