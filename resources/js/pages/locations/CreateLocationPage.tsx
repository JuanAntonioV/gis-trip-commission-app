import CreateLocationForm from '@/components/forms/CreateLocationForm';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const CreateLocationPage = () => {
    return (
        <AppLayout>
            <Head title="Buat Lokasi" />

            <main className="p-6">
                <Heading title="Buat Lokasi" description="Isi informasi lokasi baru yang akan ditambahkan." />
                <section className="section">
                    <CreateLocationForm />
                </section>
            </main>
        </AppLayout>
    );
};
export default CreateLocationPage;
