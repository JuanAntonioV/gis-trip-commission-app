import EditLocationForm from '@/components/forms/EditLocationForm';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const EditLocationPage = () => {
    return (
        <AppLayout>
            <Head title="Edit Lokasi" />

            <main className="p-6">
                <Heading title="Edit Lokasi" description="Ubah informasi lokasi." />
                <section className="section">
                    <EditLocationForm />
                </section>
            </main>
        </AppLayout>
    );
};
export default EditLocationPage;
