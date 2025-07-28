import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DELIVERY_STATUS_COLORS } from '@/constants';
import { cn } from '@/lib/utils';
import { Delivery } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';

export const columns: ColumnDef<Delivery>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'vehicle.name',
        header: 'Kendaraan',
        cell: ({ getValue, row }) => `${getValue()} (${row.original.vehicle?.license_plate || 'N/A'})`,
    },
    {
        accessorKey: 'driver.name',
        header: 'Pengemudi',
        cell: ({ getValue }) => `${getValue() || 'N/A'}`,
    },
    {
        accessorKey: 'helper.name',
        header: 'Kernek',
        cell: ({ getValue }) => `${getValue() || 'N/A'}`,
    },
    {
        accessorKey: 'total_items',
        header: 'Total Barang',
        cell: ({ getValue }) => `${getValue() || 0}`,
    },
    {
        accessorKey: 'status.name',
        header: 'Status',
        cell: ({ getValue, row }) => <Badge className={cn(DELIVERY_STATUS_COLORS[row.original.status.id])}>{getValue<string>() || 'N/A'}</Badge>,
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
                <Button variant="secondary" size={'icon'} asChild>
                    <Link href={route('deliveries.show', row.original.id)} className="flex items-center gap-2">
                        <Search />
                    </Link>
                </Button>
            </div>
        ),
    },
];
