import {ReactNode} from 'react';
import {DataTableProps} from './types';

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
