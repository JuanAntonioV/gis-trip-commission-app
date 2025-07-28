import Heading from '@/components/heading';
import EditEmployeeSection from '@/components/sections/EditEmployeeSection';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const EditEmployeePage = () => {
    return (
        <AppLayout>
            <Head title="Edit Karyawan" />

            <main className="p-6">
                <Heading title="Edit Karyawan" description="Halaman ini digunakan untuk mengedit data karyawan." />
                <EditEmployeeSection />
            </main>
        </AppLayout>
    );
};
export default EditEmployeePage;
