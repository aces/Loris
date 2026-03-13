import {ReactNode} from 'react';

export type TableRow = (string | null)[];

export type FilterType = 'text' | 'select' | 'multiselect' |
  'numeric' | 'date' | 'datetime' | 'checkbox' | 'time';

type BaseFilter = {
    name: string;
    hide?: boolean;
};

export type SelectFilterConfig = BaseFilter & {
    type: 'select' | 'multiselect';
    options: { [name: string]: string };
    sortByValue?: boolean;
};

export type OtherFilterConfig = BaseFilter & {
    type: 'text' | 'numeric' | 'date' | 'datetime' | 'checkbox' | 'time';
    options?: never; // Ensures you don't accidentally put options on a text field
};

export type FilterConfig = SelectFilterConfig | OtherFilterConfig;

export interface Field {
    show: boolean;
    label: string;
    filter?: FilterConfig; // Optional here because not every column is a filter
}

export type Filter = {
    value: any; // left as any because of the breadth of potential value types
    exactMatch: boolean;
};

export type Filters = Record<string, Filter>;

export type hideOptions = {
    rowsPerPage: boolean;
    downloadCSV: boolean;
    defaultColumn: boolean;
};


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
    folder?: ReactNode;
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
