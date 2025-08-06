import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DELIVERY_STATUS_COLORS, DELIVERY_STATUSES } from '@/constants';
import { cn } from '@/lib/utils';
import { Delivery } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';

export const driverDeliveryColumns: ColumnDef<Delivery>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'vehicle.name',
        header: 'Kendaraan',
        cell: ({ getValue, row }) => `${getValue()} (${row.original.vehicle?.license_plate || '-'})`,
    },
    {
        accessorKey: 'driver.name',
        header: 'Pengemudi',
        cell: ({ getValue }) => `${getValue() || '-'}`,
    },
    {
        accessorKey: 'helper.name',
        header: 'Helper',
        cell: ({ getValue }) => `${getValue() || '-'}`,
    },
    {
        accessorKey: 'total_items',
        header: 'Total Barang',
        cell: ({ getValue }) => `${getValue() || 0}`,
    },
    {
        accessorKey: 'status.name',
        header: 'Status',
        cell: ({ getValue, row }) => <Badge className={cn(DELIVERY_STATUS_COLORS[row.original.status.id])}>{getValue<string>() || '-'}</Badge>,
    },
    {
        accessorKey: 'scheduled_at',
        header: 'Dijadwalkan',
        cell: ({ getValue }) => dayjs(getValue<string>()).format('DD/MM/YYYY HH:mm'),
    },
    {
        accessorKey: 'started_at',
        header: 'Dimulai Pada',
        cell: ({ getValue }) => (getValue() ? dayjs(getValue<string>()).format('DD/MM/YYYY HH:mm') : 'Belum Dimulai'),
    },
    {
        accessorKey: 'finished_at',
        header: 'Diselesaikan Pada',
        cell: ({ getValue }) => (getValue() ? dayjs(getValue<string>()).format('DD/MM/YYYY HH:mm') : 'Belum Selesai'),
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Dibuat',
        cell: ({ getValue }) => dayjs(getValue<Date>()).format('DD/MM/YYYY'),
    },
    {
        accessorKey: 'actions',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                {row.original.status.id === DELIVERY_STATUSES.DELIVERY_STATUS_PENDING ||
                row.original.status.id === DELIVERY_STATUSES.DELIVERY_STATUS_IN_PROGRESS ? (
                    <Button variant="secondary" size={'icon'} asChild>
                        <Link href={route('deliveries.showMaps', row.original.id)} className="flex items-center gap-2">
                            <Search />
                        </Link>
                    </Button>
                ) : null}
            </div>
        ),
    },
];
