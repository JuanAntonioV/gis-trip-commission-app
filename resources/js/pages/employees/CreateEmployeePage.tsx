import CreateEmployeeForm from '@/components/forms/CreateEmployeeForm';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const CreateEmployeePage = () => {
    return (
        <AppLayout>
            <Head title="Buat Karyawan Baru" />

            <main className="p-6">
                <Heading title="Buat Karyawan Baru" description="Halaman ini digunakan untuk membuat data karyawan baru." />
                <section className="section">
                    <CreateEmployeeForm />
                </section>
            </main>
        </AppLayout>
    );
};
export default CreateEmployeePage;
