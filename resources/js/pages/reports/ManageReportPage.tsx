import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/daterangepicker-input';
import AppLayout from '@/layouts/app-layout';
import { ReportCommission } from '@/types';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Sheet } from 'lucide-react';
import { columns } from './columns';

type Props = {
    reports: ReportCommission[];
    from: string;
    to: string;
};

const ManageReportPage = ({ reports, from, to }: Props) => {
    const handleExport = () => {
        const formattedFrom = dayjs(from).format('YYYY-MM-DD');
        const formattedTo = dayjs(to).format('YYYY-MM-DD');
        const url = route('reports.export', { from: formattedFrom, to: formattedTo });
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
    };

    return (
        <AppLayout>
            <Head title="Kelola Laporan Komisi" />

            <main className="p-6">
                <Heading title="Kelola Laporan Komisi" description="Kelola laporan komisi untuk perjalanan yang telah selesai." />

                <section className="section">
                    <DataTable
                        columns={columns}
                        data={reports}
                        dataKey={'reports'}
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
                                    router.get(route('reports.index'), {
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
export default ManageReportPage;
