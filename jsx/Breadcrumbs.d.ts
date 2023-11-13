import React from 'react';

type breadcrumb = {
    text: string
    onClick?: (e: React.MouseEvent) => void
}

type breadcrumbProps = {
    baseURL: string,
    breadcrumbs: breadcrumb[],
};


/**
 * Breadcrumbs class See Breadcrumbs.js
 */
class Breadcrumbs {
    props: breadcrumbProps
    state: {displayCount: number}
    context: object
    refs: {[key: string]: ReactInstance}

    /**
     * Create a Breadcrumbs node
     *
     * @param {breadcrubProps} props - React props
     */
    constructor(props: breadcrumbProps)

    /**
     * React Lifecycle Method
     *
     * @param {ReactNode} - the breadcrumbs
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

export default Breadcrumbs;
