import DeleteAlertModal from '@/components/DeleteAlertModal';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Pencil } from 'lucide-react';

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'name',
        header: 'Nama Karyawan',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'phone',
        header: 'No. Telepon',
        cell: ({ getValue }) => getValue(),
    },
    {
        accessorKey: 'married',
        header: 'Status Menikah',
        cell: ({ getValue }) => (getValue() ? 'Menikah' : 'Belum Menikah'),
    },
    {
        accessorKey: 'joined_at',
        header: 'Tanggal Bergabung',
        cell: ({ getValue }) => dayjs(getValue<Date>()).format('DD/MM/YYYY'),
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
                    <Link href={route('employees.edit', row.original.id)} className="flex items-center gap-2">
                        <Pencil />
                    </Link>
                </Button>
                <DeleteAlertModal id={row.original.id} routeKey={'employees.destroy'} />
            </div>
        ),
    },
];
