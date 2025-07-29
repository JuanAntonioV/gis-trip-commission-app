import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Trip } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';

type Props = {
    trips: Trip[];
};

const ManageTripPage = ({ trips }: Props) => {
    return (
        <AppLayout>
            <Head title="Kelola Trip Pengiriman" />

            <main className="p-6">
                <Heading title="Kelola Trip Pengiriman" description="Halaman ini digunakan untuk mengelola trip pengiriman." />

                <section className="section">
                    <DataTable
                        data={trips}
                        columns={columns}
                        leftHeaderSection={
                            <Button variant={'secondary'} asChild>
                                <Link href={route('trips.create')} className="flex items-center gap-2">
                                    <Plus />
                                    Buat baru
                                </Link>
                            </Button>
                        }
                    />
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageTripPage;
