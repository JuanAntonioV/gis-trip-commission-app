'use client';

import DeleteAlertModal from '@/components/DeleteAlertModal';
// import EditLocationFormModal from '@/components/EditLocationFormModal';
import { Location } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const columns: ColumnDef<Location>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'name',
        header: 'Nama Lokasi',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'location_type.name',
        header: 'Tipe Lokasi',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'address',
        header: 'Alamat',
        cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
        accessorKey: 'postal_code',
        header: 'Kode Pos',
        cell: ({ getValue }) => getValue() || 'N/A',
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
                <DeleteAlertModal id={row.original.id} routeKey={'locations.destroy'} />
            </div>
        ),
    },
];
