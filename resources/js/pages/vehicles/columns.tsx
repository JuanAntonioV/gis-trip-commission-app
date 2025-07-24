'use client';

import { Vehicle } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'license_plate',
        header: 'License Plate',
    },
    {
        accessorKey: 'capacity',
        header: 'Capacity',
    },
    {
        accessorKey: 'available',
        header: 'Available',
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
    },
];
