import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Delivery } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';

type Props = {
    deliveries: Delivery[];
};

const ManageDeliveryPage = ({ deliveries }: Props) => {
    return (
        <AppLayout>
            <Head title="Kelola Pengiriman Barang" />

            <main className="p-6">
                <Heading title="Kelola Pengiriman Barang" description="Halaman ini digunakan untuk mengelola pengiriman barang." />

                <section className="section">
                    <section className="section">
                        <DataTable
                            data={deliveries}
                            columns={columns}
                            leftHeaderSection={
                                <Button variant={'secondary'} asChild>
                                    <Link href={route('deliveries.create')} className="flex items-center gap-2">
                                        <Plus />
                                        Buat baru
                                    </Link>
                                </Button>
                            }
                        />
                    </section>
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageDeliveryPage;
