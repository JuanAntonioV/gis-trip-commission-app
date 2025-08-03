import { Badge } from '@/components/ui/badge';
import { TRIP_STATUS_COLORS } from '@/constants';
import { cn, formatNumber } from '@/lib/utils';
import { TripStop } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const tripStopColumns: ColumnDef<TripStop>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'destination_name',
        header: 'Nama Lokasi Pemberhentian',
        cell: ({ getValue }) => `${getValue() || 'N/A'}`,
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
            return `${minutes || 0} menit ${seconds || 0} detik`;
        },
    },
    {
        accessorKey: 'status.name',
        header: 'Status',
        cell: ({ getValue, row }) => <Badge className={cn(TRIP_STATUS_COLORS[row.original.status.id])}>{getValue<string>() || 'N/A'}</Badge>,
    },
];
