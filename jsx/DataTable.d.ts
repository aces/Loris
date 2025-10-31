
import {ReactNode} from 'react';

type TableRow = (string|null)[]

type Field = {
    show: boolean
    label: string
}

type hideOptions = {
    rowsPerPage: boolean
    downloadCSV: boolean
    defaultColumn: boolean
}
type DataTableProps = {
    data: TableRow[]
    rowNumLabel?: string
    getFormattedCell: (label: string,
        data: string,
        row: TableRow,
        headers: string[],
        fieldNo: number) => ReactNode
    onSort?: () => void
    hide?: hideOptions
    fields: Field[]
    nullTableShow?: boolean
    noDynamicTable?: boolean
    getMappedCell?: (
        label: string,
        data: string|null,
        row: TableRow,
        headers: string[],
        fieldNo: number) => string|(string|null)[]|null
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
