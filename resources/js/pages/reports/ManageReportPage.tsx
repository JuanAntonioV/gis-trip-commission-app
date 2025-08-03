import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { DateRangePicker } from '@/components/ui/daterangepicker-input';
import AppLayout from '@/layouts/app-layout';
import { ReportCommission } from '@/types';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { columns } from './columns';

type Props = {
    reports: ReportCommission[];
};

const ManageReportPage = ({ reports }: Props) => {
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
