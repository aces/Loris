import {ReactNode} from 'react';

type PanelProps = {
    initCollapsed?: boolean
    collapsed?: boolean
    parentId?: string
    id?: string
    height?: string
    title?: string
    class?: string
    children: ReactNode
    views?: object
    collapsing?: boolean
    bold?: boolean
    panelSize?: string
    style?: React.CSSProperties
}

/**
 * The Modal class. See Modal.js
 */
class Panel {
    props: PanelProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a new modal
     */
    constructor(props: PanelProps)

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

export default Panel;
