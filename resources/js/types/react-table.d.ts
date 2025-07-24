import { MantineStyleProps } from '@mantine/core';
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        ps?: string;
        width?: MantineStyleProps['w'];
    }
}

export interface GlobalFilterTableState<TData extends AnyData> {
    globalFilter: FilterFnOption<TData>;
}

export type FilterFnOption<TData extends AnyData> = 'auto' | BuiltInFilterFn | FilterFn<TData> | 'fuzzy';
