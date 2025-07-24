import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';
import { type Table } from '@tanstack/react-table';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

type Props = {
    table: Table<any>;
};

const TablePagination = ({ table }: Props) => {
    return (
        <div className="flex-between border-t pt-4">
            <Select value={table.getState().pagination.pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
                <SelectTrigger className="w-full max-w-32">
                    <SelectValue placeholder={`${table.getState().pagination.pageSize} per page`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Items per page</SelectLabel>
                        {[10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()} onClick={() => table.setPageSize(size)}>
                                {size} items
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Pagination className="justify-end">
                <PaginationContent>
                    {/* Previous Page */}
                    <PaginationItem>
                        <Button variant="ghost" size="icon" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                            <ChevronLeft className="size-4" />
                        </Button>
                    </PaginationItem>

                    {/* Page 1 */}
                    <PaginationItem>
                        <Button
                            variant={table.getState().pagination.pageIndex === 0 ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => table.setPageIndex(0)}
                        >
                            1
                        </Button>
                    </PaginationItem>

                    {/* Ellipsis after Page 1 */}
                    {table.getPageCount() > 5 && table.getState().pagination.pageIndex > 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {/* Dynamic middle pages */}
                    {Array.from({ length: table.getPageCount() }, (_, index) => index)
                        .filter((index) => {
                            const current = table.getState().pagination.pageIndex;
                            return index !== 0 && index !== table.getPageCount() - 1 && Math.abs(index - current) <= 1;
                        })
                        .map((index) => (
                            <PaginationItem key={index}>
                                <Button
                                    variant={table.getState().pagination.pageIndex === index ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => table.setPageIndex(index)}
                                >
                                    {index + 1}
                                </Button>
                            </PaginationItem>
                        ))}

                    {/* Ellipsis before last page */}
                    {table.getPageCount() > 5 && table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {/* Last Page */}
                    {table.getPageCount() > 1 && (
                        <PaginationItem>
                            <Button
                                variant={table.getState().pagination.pageIndex === table.getPageCount() - 1 ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            >
                                {table.getPageCount()}
                            </Button>
                        </PaginationItem>
                    )}

                    {/* Next Page */}
                    <PaginationItem>
                        <Button variant="ghost" size="icon" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                            <ChevronLeft className="size-4 rotate-180" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
export default TablePagination;
