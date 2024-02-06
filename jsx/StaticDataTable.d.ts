import {ReactNode} from 'react';
/**
 * This file contains a sufficient typescript definition of the StaticDataTable
 * to allow it to be imported into TypeScript with "strict" mode and not trigger
 * errors.
 */

type TableRow = (string|null)[];

type StaticDataTableProps = {
    Headers: string[],
    Data: TableRow[],
    RowNumLabel: string?,
    getFormattedCell: (
        columnname: string,
        celldata: string,
        row: string[],
        headers: string[],
        fieldNo: number
    ) => ReactNode,
    onSort?: () => void
};

/**
 * StaticDataTable class. See StaticDataTable.js
 */
class StaticDataTable {
    props: StaticDataTableProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Create a StaticDataTable
     *
     * @param {StaticDataTableProps} props - React props
     */
    constructor(props: StaticDataTableProps)

    /**
     * React Lifecycle Method
     *
     * @returns {ReactNode} - the StaticDataTable
     */
    render(): ReactNode

    /**
     * React Lifecycle Method
     *
     * @param {object} newstate - the state to overwrite
     */
    setState(newstate: object): void

    /**
     * React Lifecycle Method
     */
    forceUpdate(): void
}

export default StaticDataTable;
