import CancelDeliveryButton from '@/components/CancelDeliveryButton';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import LabelItem from '@/components/LabelItem';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DELIVERY_STATUS_COLORS, DELIVERY_STATUSES } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { cn, formatNumber } from '@/lib/utils';
import { Delivery } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';

const DeliveryDetailPage = () => {
    const serverProps = usePage().props;
    const delivery = serverProps.delivery as Delivery;
    const isAdmin = (serverProps.isAdmin as boolean) || false;

    return (
        <AppLayout>
            <Head title="Detail Pengiriman" />

            <main className="p-6">
                <Heading title="Detail Pengiriman" description="Halaman ini menampilkan detail pengiriman." />

                <section className="section">
                    <HeadingSmall title="Informasi Pengiriman" description="Detail informasi pengiriman yang telah dibuat." />
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <LabelItem label="Nomor Pengiriman" value={delivery.id} />
                        <LabelItem label="Jadwal Pengiriman" value={dayjs(delivery.scheduled_at).format('DD MMMM YYYY HH:mm')} />
                        <LabelItem
                            label="Status"
                            value={<Badge className={cn(DELIVERY_STATUS_COLORS[delivery.status.id])}>{delivery.status.name || 'N/A'}</Badge>}
                        />
                        <LabelItem label="Dibuat Oleh" value={delivery.staff.name} />
                        <LabelItem label="Dibuat Pada" value={dayjs(delivery.created_at).format('DD MMMM YYYY HH:mm')} />
                    </div>

                    <HeadingSmall title="Informasi Kendaraan" description="Detail informasi kendaraan yang digunakan." className="mt-10" />
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <LabelItem label="Kendaraan" value={delivery.vehicle ? delivery.vehicle.name : 'N/A'} />
                        <LabelItem label="Pengemudi" value={delivery.driver ? delivery.driver.name : 'N/A'} />
                        <LabelItem label="Kernek" value={delivery.helper ? delivery.helper.name : 'N/A'} />
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <LabelItem
                            label="Dimulai Pada"
                            value={delivery.started_at ? dayjs(delivery.started_at).format('DD MMMM YYYY HH:mm') : 'N/A'}
                        />
                        <LabelItem
                            label="Selesai Pada"
                            value={delivery.finished_at ? dayjs(delivery.finished_at).format('DD MMMM YYYY HH:mm') : 'N/A'}
                        />
                        <LabelItem
                            label="Dikonfirmasi Pada"
                            value={delivery.confirmed_at ? dayjs(delivery.confirmed_at).format('DD MMMM YYYY HH:mm') : 'N/A'}
                        />
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <LabelItem
                            label="Dibatalkan Pada"
                            value={delivery.cancelled_at ? dayjs(delivery.cancelled_at).format('DD MMMM YYYY HH:mm') : 'N/A'}
                        />
                        <LabelItem label="Dibatalkan Oleh" value={delivery.cancelledStaff ? delivery.cancelledStaff.name : 'N/A'} />
                        <LabelItem label="Alasan Pembatalan" value={delivery.cancel_reason || 'N/A'} />
                    </div>

                    <HeadingSmall title="Daftar Barang" description="Daftar barang yang dikirimkan dalam pengiriman ini." className="mt-10" />
                    <Separator className="my-4" />
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <LabelItem label="Total Barang" value={delivery.total_items || 0} />
                        <LabelItem label="Total Berat" value={`${formatNumber(delivery.items.reduce((acc, item) => acc + item.weight, 0))} kg`} />
                        <LabelItem label="Total Lokasi" value={delivery.items.length} />
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lokasi</TableHead>
                                <TableHead>Nomor Invoice</TableHead>
                                <TableHead>Berat (kg)</TableHead>
                                {/* <TableHead className="w-16">Status</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {delivery.items?.length ? (
                                delivery.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.location?.name || 'N/A'}</TableCell>
                                        <TableCell>{item.invoice_number || 'N/A'}</TableCell>
                                        <TableCell>{formatNumber(item.weight)} kg</TableCell>
                                        {/* <TableCell>{item.status || 'N/A'}</TableCell> */}
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

                    {isAdmin &&
                        (delivery.status.id === DELIVERY_STATUSES.DELIVERY_STATUS_PENDING ||
                            delivery.status.id === DELIVERY_STATUSES.DELIVERY_STATUS_IN_PROGRESS) && (
                            <div className="flex items-center gap-4">
                                <CancelDeliveryButton id={delivery.id} />
                            </div>
                        )}
                </section>
            </main>
        </AppLayout>
    );
};
export default DeliveryDetailPage;
