import {ReactNode} from 'react';

type PaginationLinksProps = {
    Total: number,
    onChangePage: (pageNo: number) => void,
    RowsPerPage?: number,
    Active?: number,

}

/**
 * Pagination class. See PaginationLinks.js
 */
class PaginationLinks {
    props: PaginationLinksProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Create a new PaginationLinks node
     *
     * @param {PaginationLinksProps} props - React props
     */
    constructor(props: PaginationLinksProps)

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

export default PaginationLinks;
