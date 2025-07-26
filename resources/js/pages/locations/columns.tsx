'use client';

import DeleteAlertModal from '@/components/DeleteAlertModal';
import { Button } from '@/components/ui/button';
// import EditLocationFormModal from '@/components/EditLocationFormModal';
import { Location } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Pencil } from 'lucide-react';

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
        accessorKey: 'type.name',
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
                <Button variant="secondary" size={'icon'} asChild>
                    <Link href={route('locations.edit', row.original.id)} className="flex items-center gap-2">
                        <Pencil />
                    </Link>
                </Button>
                <DeleteAlertModal id={row.original.id} routeKey={'locations.destroy'} />
            </div>
        ),
    },
];
