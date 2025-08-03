import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TRIP_STATUS_COLORS } from '@/constants';
import { cn, formatNumber } from '@/lib/utils';
import { Trip } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';

export const columns: ColumnDef<Trip>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'delivery_id',
        header: 'Pengiriman ID',
        cell: ({ getValue, row }) => `${getValue() || 'N/A'} (${row.original.delivery?.status.name || 'N/A'})`,
    },
    {
        accessorKey: 'destination_location.name',
        header: 'Lokasi Tujuan',
        cell: ({ getValue }) => `${getValue() || 'N/A'}`,
    },
    {
        accessorKey: 'delivery.driver.name',
        header: 'Pengemudi',
        cell: ({ getValue }) => `${getValue() || 'N/A'}`,
    },
    {
        accessorKey: 'delivery.helper.name',
        header: 'Kernek',
        cell: ({ getValue }) => `${getValue() || '-'}`,
    },
    {
        accessorKey: 'total_items',
        header: 'Total Barang',
        cell: ({ getValue }) => (getValue() ? formatNumber(getValue() as number) : '0'),
    },
    {
        accessorKey: 'ending_km',
        header: 'Total Jarak (km)',
        cell: ({ getValue, row }) => (getValue() ? formatNumber(getValue<number>() - row.original.starting_km) : '0') + ' km',
    },
    {
        accessorKey: 'end_time',
        header: 'Total Waktu',
        cell: ({ getValue, row }) => {
            const diffInSeconds = dayjs(getValue<Date>()).diff(dayjs(row.original.start_time), 'second');
            const minutes = Math.floor(diffInSeconds / 60);
            const seconds = diffInSeconds % 60;
            return `${minutes} menit ${seconds} detik`;
        },
    },
    {
        accessorKey: 'status.name',
        header: 'Status',
        cell: ({ getValue, row }) => <Badge className={cn(TRIP_STATUS_COLORS[row.original.status.id])}>{getValue<string>() || 'N/A'}</Badge>,
    },
    {
        accessorKey: 'actions',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                <Button variant="secondary" size={'icon'} asChild>
                    <Link href={route('trips.show', row.original.id)} className="flex items-center gap-2">
                        <Search />
                    </Link>
                </Button>
            </div>
        ),
    },
];
