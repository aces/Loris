import {ReactNode} from 'react';

type ModalProps = {
    title?: string
    onSubmit: () => Promise<any>,
    onClose: () => void,
    show: boolean,
    throwWarning?: boolean,
    children: React.ReactNode,
    width?: string

}

/**
 * The Modal class. See Modal.js
 */
class Modal {
    props: ModalProps
    state: any
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Construct a new modal
     */
    constructor(props: ModalProps)

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

export default Modal;
