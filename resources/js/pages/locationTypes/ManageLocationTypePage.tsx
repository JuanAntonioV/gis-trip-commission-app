import AddLocationTypeFormModal from '@/components/AddLocationTypeFormModal';
import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { LocationType } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';

type Props = {
    locationTypes: LocationType[];
};

const ManageLocationTypePage = ({ locationTypes }: Props) => {
    return (
        <AppLayout>
            <Head title="Kelola Tipe Lokasi" />

            <main className="p-6">
                <Heading title="Kelola Tipe Lokasi" description="Kelola tipe lokasi yang tersedia untuk perjalanan." />
                <section className="section">
                    <DataTable data={locationTypes} columns={columns} leftHeaderSection={<AddLocationTypeFormModal />} />
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageLocationTypePage;
