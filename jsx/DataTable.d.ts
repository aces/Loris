import {ReactNode} from 'react';

type TableRow = (string | number | null | any)[];

type Field = {
    show: boolean;
    label: string;
    filter?: { name: string };
    freezeColumn?: boolean;
};

type Action = {
    label: string;
    action: (event: any) => void;
    show?: boolean;
};

type hideOptions = {
    rowsPerPage?: boolean;
    downloadCSV?: boolean;
    defaultColumn?: boolean;
};

export type DataTableProps = {
    data?: TableRow[];
    rowNumLabel?: string;
    getFormattedCell?: (
        label: string,
        data: any,
        row: TableRow,
        headers: string[],
        fieldNo: number
    ) => ReactNode;
    actions?: Action[];
    hide?: hideOptions;
    nullTableShow?: boolean;
    noDynamicTable?: boolean;
    getMappedCell?: (
        label: string,
        data: any,
        row: TableRow,
        headers: string[],
        fieldNo: number
    ) => string | any;
    fields: Field[];
    RowNameMap?: Record<number, string | number>;
    filters?: Record<string, any>;
    freezeColumn?: string;
    loading?: boolean;
    folder?: ReactNode;
};

// Define it as a Functional Component, not a Class
declare const DataTable: (props: DataTableProps) => JSX.Element;

export default DataTable;
