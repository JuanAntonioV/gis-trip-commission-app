import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import { ReportCommission } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Truck } from 'lucide-react';

export const columns: ColumnDef<ReportCommission>[] = [
    {
        accessorKey: 'driver_name',
        header: 'Nama Pengemudi',
        cell: ({ getValue }) => getValue() || '-',
    },
    {
        accessorKey: 'helper_name',
        header: 'Nama Helper',
        cell: ({ getValue }) => getValue() || '-',
    },
    {
        accessorKey: 'total_trips',
        header: 'Total Trip',
        cell: ({ getValue }) => formatNumber(getValue<number>()),
    },
    {
        accessorKey: 'total_distance',
        header: 'Total Jarak',
        cell: ({ getValue }) => formatNumber(getValue<number>()) + ' km',
    },
    {
        accessorKey: 'total_duration',
        header: 'Total Durasi',
        cell: ({ getValue }) => {
            const totalSeconds = getValue<number>();
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes} menit ${seconds} detik`;
        },
    },

    {
        accessorKey: 'total_commission',
        header: 'Total Komisi',
        cell: ({ row }) => 'Rp ' + formatNumber(row.original.total_commission),
    },
    {
        accessorKey: 'last_trip_date',
        header: 'Tanggal Trip Terakhir',
        cell: ({ getValue }) => dayjs(getValue<Date>()).format('DD MMM YYYY HH:mm'),
    },
    {
        accessorKey: 'actions',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => {
            const queryParams = new URLSearchParams(window.location.search);
            const from = queryParams.get('from');
            const to = queryParams.get('to');

            return (
                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="secondary" size={'icon'} asChild>
                                <Link
                                    href={
                                        route('reports.show', {
                                            id: row.original.driver_id,
                                        }) +
                                        (from ? `?from=${from}` : '') +
                                        (to ? `&to=${to}` : '')
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <Truck />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Lihat Riwayat Trip Pengemudi</p>
                        </TooltipContent>
                    </Tooltip>
                    {/* {row.original.helper_id && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="secondary" size={'icon'} asChild>
                                    <Link
                                        href={
                                            route('reports.show', {
                                                id: row.original.helper_id,
                                            }) +
                                            (from ? `?from=${from}` : '') +
                                            (to ? `&to=${to}` : '')
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <Truck />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Lihat Riwayat Trip Helper</p>
                            </TooltipContent>
                        </Tooltip>
                    )} */}
                </div>
            );
        },
    },
];
