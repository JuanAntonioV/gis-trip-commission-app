'use client';

import DeleteAlertModal from '@/components/DeleteAlertModal';
import EditLocationTypeFormModal from '@/components/EditLocationTypeFormModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LocationType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Info } from 'lucide-react';

export const columns: ColumnDef<LocationType>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Nama Kendaraan',
        cell: ({ getValue, row }) => (
            <div className="flex items-center space-x-2">
                <span>{getValue() as string}</span>
                {row.original.description && (
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="text-muted-foreground" size={16} />
                        </TooltipTrigger>
                        <TooltipContent>{row.original.description}</TooltipContent>
                    </Tooltip>
                )}
            </div>
        ),
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
                <EditLocationTypeFormModal initialData={row.original} />
                <DeleteAlertModal id={row.original.id} routeKey={'location-types.destroy'} />
            </div>
        ),
    },
];
