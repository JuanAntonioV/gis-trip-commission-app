import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const DeliveryDetailPage = () => {
    return (
        <AppLayout>
            <Head title="Detail Pengiriman" />

            <main className="p-6">
                <Heading title="Detail Pengiriman" description="Halaman ini menampilkan detail pengiriman." />

                <section className="section">
                    <h1>Content</h1>
                </section>
            </main>
        </AppLayout>
    );
};
export default DeliveryDetailPage;
