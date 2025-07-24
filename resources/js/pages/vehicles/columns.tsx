'use client';

import DeleteAlertModal from '@/components/DeleteAlertModal';
import EditVehicleFormModal from '@/components/EditVehicleFormModal';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const columns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Nama Kendaraan',
    },
    {
        accessorKey: 'type',
        header: 'Tipe',
    },
    {
        accessorKey: 'license_plate',
        header: 'Plat Nomor',
    },
    {
        accessorKey: 'capacity',
        header: 'Kapasitas',
    },
    {
        accessorKey: 'available',
        header: 'Tersedia',
        cell: ({ getValue }) => <Badge variant={getValue() ? 'secondary' : 'destructive'}>{getValue() ? 'Ya' : 'Tidak'}</Badge>,
    },
    {
        accessorKey: 'created_at',
        header: 'Dibuat Pada',
        cell: ({ getValue }) => dayjs(getValue() as string).format('DD MMM YYYY HH:mm'),
    },
    {
        accessorKey: 'actions',
        header: 'Aksi',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                <EditVehicleFormModal initialData={row.original} />
                <DeleteAlertModal id={row.original.id} routeKey={'vehicles.destroy'} />
            </div>
        ),
    },
];
