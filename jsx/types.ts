import {ReactNode} from 'react';

export type TableRow = (string | null)[];

export type Field = {
    show: boolean;
    label: string;
    filter?: {
        name: string;
        type: string;
        options?: any;
    };
};

export type hideOptions = {
    rowsPerPage: boolean;
    downloadCSV: boolean;
    defaultColumn: boolean;
};

export type DataTableProps = {
    data: TableRow[];
    rowNumLabel?: string;
    getFormattedCell: (
        label: string,
        data: string,
        row: TableRow,
        headers: string[],
        fieldNo: number
    ) => ReactNode;
    onSort?: () => void;
    hide?: hideOptions;
    fields: Field[];
    nullTableShow?: boolean;
    noDynamicTable?: boolean;
    getMappedCell?: (
        label: string,
        data: string | null,
        row: TableRow,
        headers: string[],
        fieldNo: number
    ) => string | (string | null)[] | null;
    filters?: FiltersState;
    actions?: any;
    loading?: boolean;
};

export interface FilterValue {
    value: any;
    exactMatch: boolean;
}

export type FiltersState = Record<string, FilterValue>;

export type FilterableDataTableProps = DataTableProps & {
    name: string;
    title: string;
    filterPresets?: any;
    columns?: number;
    updateFilterCallback?: (filters: FiltersState) => void;
    progress?: number;
    loading?: boolean;
    folder?: string;
    actions?: any;
    children?: ReactNode;
};
