'use client';

import {
    ColumnDef,
    ColumnMeta,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useDebounce from '@/hooks/useDebounce';
import { cn, valueUpdater } from '@/lib/utils';
import { compareItems, RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import { ColumnFiltersState, FilterFn, GlobalFilterTableState, SortingFn, SortingState } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import TablePagination from './TablePagination';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    primaryKey?: string; // Optional primary key for row identification
    leftHeaderSection?: React.ReactNode; // Optional left header section
    rightHeaderSection?: React.ReactNode; // Optional right header section
    loading?: boolean; // Optional loading state
}

export function DataTable<TData, TValue>({
    columns,
    data,
    primaryKey = 'id',
    leftHeaderSection,
    rightHeaderSection,
    loading,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [searchInput, setSearchInput] = useState('');
    const globalSearch = useDebounce(searchInput, 500);

    const fuzzyFilter: FilterFn<TData> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });
        return itemRank.passed;
    };

    const fuzzySort: SortingFn<TData> = (rowA, rowB, columnId) => {
        const aMeta = rowA.columnFiltersMeta[columnId] as RankingInfo | undefined;
        const bMeta = rowB.columnFiltersMeta[columnId] as RankingInfo | undefined;

        if (aMeta && bMeta) {
            const dir = compareItems(aMeta, bMeta);
            if (dir !== 0) {
                return dir;
            }
        }

        return sortingFns.alphanumeric(rowA, rowB, columnId);
    };

    useEffect(() => {
        if (globalSearch) {
            setColumnFilters([{ id: 'global', value: globalSearch }]);
        } else {
            setColumnFilters([]);
        }
    }, [globalSearch]);

    const fallbackData = useMemo(() => data || [], [data]);

    const table = useReactTable({
        data: fallbackData,
        columns,
        pageCount: Math.ceil(fallbackData.length / pagination.pageSize),
        globalFilterFn: 'fuzzy' as GlobalFilterTableState['globalFilter'],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: primaryKey ? (row: any) => row[primaryKey!] : undefined,
        enableMultiSort: false,
        onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
        onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
        onPaginationChange: (updaterOrValue) => valueUpdater(updaterOrValue, pagination),
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        sortingFns: {
            fuzzy: fuzzySort,
        },
        state: {
            columnFilters,
            sorting,
            pagination,
        },
    });

    const handleColSort = (columnId: string) => {
        const column = table.getColumn(columnId);
        if (column) {
            // Cycle through: off -> asc -> desc -> off
            const currentSort = column.getIsSorted();
            if (!currentSort) {
                column.toggleSorting(false); // set to asc
            } else if (currentSort === 'asc') {
                column.toggleSorting(true); // set to desc
            } else if (currentSort === 'desc') {
                // turn sorting off
                column.clearSorting();
            }
        }
    };

    const handleResetSearch = () => {
        setSearchInput('');
    };

    return (
        <div>
            <div className="flex w-full flex-wrap items-center justify-between gap-4 pb-4 md:flex-nowrap">
                <div className="flex w-full flex-wrap items-center gap-2">
                    <div className="relative items-center">
                        <Input
                            className="w-full max-w-[270px] pl-8"
                            placeholder="Cari..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setSearchInput(e.currentTarget.value);
                                }
                            }}
                        />
                        <span className="absolute inset-y-0 start-0 flex items-center justify-center px-2">
                            <Search className="size-4 text-muted-foreground" />
                        </span>
                    </div>
                    {searchInput && (
                        <Button variant="outline" onClick={handleResetSearch}>
                            Reset Filter
                        </Button>
                    )}
                    {leftHeaderSection}
                </div>
                {rightHeaderSection && <div className="flex w-full flex-wrap items-center justify-end gap-2">{rightHeaderSection}</div>}
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as ColumnMeta<TData, TValue>;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: meta?.width || 'auto' }}
                                            className={cn(header.column.getCanSort() && 'hover:bg-secondary')}
                                            onClick={() => header.column.toggleSorting()}
                                        >
                                            <div
                                                className={cn(
                                                    'relative flex-between p-3 text-nowrap select-none',
                                                    header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default',
                                                )}
                                                style={{ width: meta?.width || 'auto' }}
                                            >
                                                <span className="mr-6">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>

                                                {header.column.getCanSort() && (
                                                    <span
                                                        className={cn(
                                                            "absolute top-0 right-3 bottom-0 h-full w-3 before:absolute before:bottom-1/2 before:left-0 before:text-xs before:!leading-none before:text-gray-300 before:content-['▲'] after:absolute after:top-1/2 after:left-0 after:text-xs after:!leading-none after:text-gray-300 after:content-['▼'] dark:before:text-gray-500 dark:after:text-gray-500",
                                                            header.column.getIsSorted() ? 'opacity-100' : 'opacity-0',
                                                            header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default',
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as ColumnMeta<TData, TValue>;

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn('whitespace-nowrap')}
                                                style={{ paddingLeft: meta?.ps || '1.25rem' }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data yang ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination table={table} />
        </div>
    );
}
