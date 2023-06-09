import {createRoot} from 'react-dom/client';

import {useState, useEffect} from 'react';

/**
 * Update the DQT breadcrumbs based on the active tab
 *
 * @param {string} activeTab - The active tab
 * @param {function} setActiveTab - set the state on click
 */
function useBreadcrumbs(activeTab, setActiveTab) {
    // update breadcrumbs breadcrumbs
    useEffect(() => {
        let breadcrumbs = [
            {
                text: 'Data Query Tool (Alpha)',
                onClick: (e) => {
                    e.preventDefault();
                    setActiveTab('Info');
                },
            },
        ];
        if (activeTab == 'DefineFields'
                || activeTab == 'DefineFilters'
                || activeTab == 'ViewData') {
            breadcrumbs.push({
                text: 'Define Fields',
                onClick: (e) => {
                    e.preventDefault();
                    setActiveTab('DefineFields');
                },
            });
        }
        if (activeTab == 'DefineFilters'
                || activeTab == 'ViewData') {
            breadcrumbs.push({
                text: 'Define Filters',
                onClick: (e) => {
                    e.preventDefault();
                    setActiveTab('DefineFilters');
                },
            });
        }

        if (activeTab == 'ViewData') {
            breadcrumbs.push({
                text: 'View Data',
                onClick: (e) => {
                    e.preventDefault();
                    setActiveTab('View Data');
                },
            });
        }

        if (breadcrumbsRoot) {
            breadcrumbsRoot.render(
                <Breadcrumbs
                    breadcrumbs={breadcrumbs}
                    baseURL={loris.BaseURL}
                />,
            );
        }
    }, [activeTab]);
}

export default useBreadcrumbs;
