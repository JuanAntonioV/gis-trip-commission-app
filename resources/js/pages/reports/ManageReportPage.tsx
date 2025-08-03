import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { ReportCommission } from '@/types';
import { Head } from '@inertiajs/react';
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
                    <DataTable columns={columns} data={reports} dataKey={'reports'} />
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageReportPage;
