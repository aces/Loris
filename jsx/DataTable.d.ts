import {ReactNode} from 'react';

export type TableRow = (string | null)[];

export type Field = {
    show: boolean;
    label: string;
    filter?: {
        name: string;
        type: string;
        options?: any[];
    };
};

export type hideOptions = {
    rowsPerPage: boolean;
    downloadCSV: boolean;
    defaultColumn: boolean;
};

export type Filter = {
    value: string | number | boolean | (string | number)[] | null;
    exactMatch: boolean;
};

export type Filters = Record<string, Filter>;

export interface DataTableProps {
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
    filters?: Filters;
    actions?: (row: TableRow) => ReactNode;
    loading?: boolean;
}

/**
 * The DataTable class. See DataTable.js
 */
class DataTable {
    props: DataTableProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a new modal
     */
    constructor(props: DataTableProps)

    /**
     * React lifecycle method
     *
     * @returns {ReactNode}
     */
    render(): ReactNode

    /**
     * React lifecycle method
     *
     * @param {object} newstate - the state to overwrite
     */
    setState(newstate: object): void

    /**
     * React lifecycle method
     */
    forceUpdate(): void
}

export default DataTable;
