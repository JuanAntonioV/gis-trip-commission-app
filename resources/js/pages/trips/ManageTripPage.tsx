import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/daterangepicker-input';
import AppLayout from '@/layouts/app-layout';
import { Trip } from '@/types';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Sheet } from 'lucide-react';
import { columns } from './columns';

type Props = {
    trips: Trip[];
    from: string;
    to: string;
};

const ManageTripPage = ({ trips, from, to }: Props) => {
    const handleExport = () => {
        const formattedFrom = dayjs(from).format('YYYY-MM-DD');
        const formattedTo = dayjs(to).format('YYYY-MM-DD');
        const url = route('trips.export', { from: formattedFrom, to: formattedTo });
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    };
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
                            <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2">
                                <Sheet />
                                Ekspor Laporan
                            </Button>
                        }
                        rightHeaderSection={
                            <DateRangePicker
                                showCompare={false}
                                onUpdate={(values) => {
                                    const { from, to } = values.range;
                                    const formattedFrom = dayjs(from).format('YYYY-MM-DD');
                                    const formattedTo = dayjs(to).format('YYYY-MM-DD');
                                    router.get(route('trips.index'), {
                                        from: formattedFrom,
                                        to: formattedTo,
                                    });
                                }}
                            />
                        }
                    />
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageTripPage;
