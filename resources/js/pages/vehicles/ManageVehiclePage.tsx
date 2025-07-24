import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Vehicle } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Kendaraan',
        href: '/kelola-kendaraan',
    },
];

type Props = {
    vehicles: Vehicle[];
};

const ManageVehiclePage = ({ vehicles }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Kendaraan" />

            <main className="p-6">
                <Heading title="Kelola Kendaraan" description="Kelola kendaraan yang tersedia untuk perjalanan." />
                <section className="section">
                    <DataTable data={vehicles} columns={columns} />
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageVehiclePage;
