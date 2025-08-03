import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import LabelItem from '@/components/LabelItem';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { formatNumber } from '@/lib/utils';
import { ReportCommission, Trip } from '@/types';
import { Deferred, Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { columns } from '../trips/columns';

type Props = {
    report: ReportCommission;
    allTrips: Trip[];
};

const ReportDetailPage = ({ report, allTrips }: Props) => {
    return (
        <AppLayout>
            <Head title="Detail Laporan Komisi" />

            <main className="p-6">
                <Heading title="Detail Laporan Komisi" description="Lihat detail laporan komisi untuk pengemudi atau kernek tertentu." />

                <Separator className="my-4" />

                <Deferred data={['report']} fallback={<Skeleton className="h-42" />}>
                    <section className="section">
                        <HeadingSmall
                            title={`Laporan Komisi untuk ${report?.driver_name} ${report?.helper_name ? `dan ${report?.helper_name}` : ''}`}
                            description={'Laporan ini mencakup semua trip yang telah selesai.'}
                        />

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            <LabelItem label="Nama Pengemudi" value={report?.driver_name} />
                            <LabelItem label="Nama Kernek" value={report?.helper_name || '-'} />
                            <LabelItem label="Total Trip" value={formatNumber(report?.total_trips)} />
                            <LabelItem label="Total Jarak" value={`${formatNumber(report?.total_distance)} km`} />
                            <LabelItem label="Total Durasi" value={`${formatNumber(report?.total_duration)} menit`} />
                            <LabelItem label="Total Komisi" value={`Rp ${formatNumber(report?.total_commission)}`} />
                            <LabelItem label="Tanggal Trip Terakhir" value={dayjs(report?.last_trip_date).format('DD MMM YYYY HH:mm')} />
                        </div>
                    </section>
                </Deferred>
                <section className="mt-6 section">
                    <HeadingSmall
                        title="Riwayat Trip Pengemudi"
                        description="Lihat riwayat trip yang telah dilakukan oleh pengemudi atau kernek ini."
                    />

                    <Separator className="my-4" />

                    <DataTable columns={columns} data={allTrips} dataKey={'allTrips'} />
                </section>
            </main>
        </AppLayout>
    );
};
export default ReportDetailPage;
