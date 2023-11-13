import React from 'react';

type breadcrumb = {
    text: string
    onClick?: (e: React.MouseEvent) => void
}

type breadcrumbProps = {
    baseURL: string,
    breadcrumbs: breadcrumb[],
};


class Breadcrumbs {
    props: breadcrumbProps
    state: {displayCount: number}
    context: object
    refs: {[key: string]: ReactInstance}

    constructor(props: breadcrumbProps)
    render(): ReactNode
    setState(newprops: object): void
    forceUpdate(): void
}

export default Breadcrumbs;
