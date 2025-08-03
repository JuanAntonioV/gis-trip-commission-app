import CancelTripButton from '@/components/CancelTripButton';
import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import LabelItem from '@/components/LabelItem';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TRIP_STATUS_COLORS, TRIP_STATUSES } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { cn, formatNumber } from '@/lib/utils';
import { Trip, TripStop } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { tripStopColumns } from './tripStopColumns';

const TripDetailPage = () => {
    const serverProps = usePage().props;
    const trip = serverProps.trip as Trip;
    const isAdmin = (serverProps.isAdmin as boolean) || false;
    const tripStops = serverProps.tripStops as TripStop[];
    return (
        <AppLayout>
            <Head title={`Trip Detail - ${trip.destination_location.name}`} />

            <main className="p-6">
                <Heading title="Detail Pengiriman" description="Halaman ini menampilkan detail pengiriman." />

                <section className="section">
                    <HeadingSmall title="Informasi Pengiriman" description="Detail informasi pengiriman yang telah dibuat." />
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <LabelItem label="ID Trip" value={trip.id} />
                        <LabelItem label="ID Pengiriman" value={trip.delivery_id} />
                        <LabelItem label="Tujuan Pengiriman" value={trip.destination_location.name} />
                        <LabelItem label="Alamat" value={trip.destination_location.address} />
                        <LabelItem label="Dimulai pada" value={dayjs(trip.start_time).format('DD MMMM YYYY HH:mm')} />
                        <LabelItem label="Selesai pada" value={dayjs(trip.end_time).format('DD MMMM YYYY HH:mm')} />
                        <LabelItem
                            label="Status"
                            value={<Badge className={cn(TRIP_STATUS_COLORS[trip.status.id])}>{trip.status.name || '-'}</Badge>}
                        />
                    </div>

                    {trip.status.id === TRIP_STATUSES.CANCELLED && (
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <LabelItem label="Alasan Pembatalan" value={trip.cancellation_reason || '-'} />
                        </div>
                    )}

                    <Separator className="my-6" />

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <LabelItem label="Pengemudi" value={trip.delivery.driver?.name || '-'} />
                        <LabelItem label="Kernek" value={trip.delivery.helper?.name || '-'} />
                        <LabelItem label="Kendaraan" value={trip.delivery.vehicle?.name || '-'} />
                        <LabelItem label="Nomor Polisi" value={trip.delivery.vehicle?.license_plate || '-'} />
                    </div>

                    <HeadingSmall title="Daftar Barang" description="Daftar barang yang dikirimkan dalam pengiriman ini." className="mt-10" />
                    <Separator className="my-4" />
                    <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <LabelItem label="Total Barang" value={formatNumber(trip.total_items || 0)} />
                        <LabelItem label="Total Berat" value={`${formatNumber(trip.items.reduce((acc, item) => acc + item.weight, 0))} kg`} />
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lokasi</TableHead>
                                <TableHead>Nomor Invoice</TableHead>
                                <TableHead>Berat (kg)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trip.items?.length ? (
                                trip.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.location?.name || '-'}</TableCell>
                                        <TableCell>{item.invoice_number || '-'}</TableCell>
                                        <TableCell>{formatNumber(item.weight)} kg</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="h-20">
                                    <TableCell colSpan={4} className="text-center">
                                        Tidak ada barang yang dikirimkan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {isAdmin && trip.status.id === TRIP_STATUSES.IN_PROGRESS && (
                        <div className="mt-6 flex items-center gap-4">
                            <CancelTripButton id={trip.id} btnClassName="w-fit" withRedirect={false} />
                        </div>
                    )}
                </section>

                <section className="mt-6 section">
                    <HeadingSmall title="Riwayat Perhentian" description="Riwayat perhentian yang dilakukan selama trip ini." />

                    <Separator className="my-4" />

                    <DataTable columns={tripStopColumns} data={tripStops} dataKey={'tripStops'} />
                </section>
            </main>
        </AppLayout>
    );
};
export default TripDetailPage;
