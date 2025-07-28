import CreateDeliveryForm from '@/components/forms/CreateDeliveryForm';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const CreateDeliveryPage = () => {
    return (
        <AppLayout>
            <Head title="Buat Pengiriman Baru" />

            <main className="p-6">
                <Heading title="Buat Pengiriman Baru" description="Halaman ini digunakan untuk membuat pengiriman barang baru." />

                <section className="section">
                    <CreateDeliveryForm />
                </section>
            </main>
        </AppLayout>
    );
};
export default CreateDeliveryPage;
