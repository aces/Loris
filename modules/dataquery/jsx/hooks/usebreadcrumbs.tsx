import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Breadcrumbs from 'jsx/Breadcrumbs';

// Declared in smarty main.tpl
declare const breadcrumbsRoot: any;
declare const loris: any;

/**
 * Update the DQT breadcrumbs based on the active tab
 *
 * @param {string} activeTab - The active tab
 * @param {function} setActiveTab - set the state on click
 */
function useBreadcrumbs(
  activeTab: string,
  setActiveTab: (newtab: string) => void
) {
  const {t} = useTranslation('dataquery');
  // update breadcrumbs breadcrumbs
  useEffect(() => {
    const breadcrumbs = [
      {
        text: t('Data Query Tool (Beta)', {ns: 'dataquery'}),
        /**
         * OnClick handler for the main breadcrumb
         *
         * @param {React.MouseEvent<HTMLElement>} e - Callback for when hovering over the delete icon
         * @returns {void}
         */
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setActiveTab('Info');
        },
      },
    ];
    if (activeTab == 'DefineFields'
                || activeTab == 'DefineFilters'
                || activeTab == 'ViewData') {
      breadcrumbs.push({
        text: t('Define Fields', {ns: 'dataquery'}),
        /**
         * OnClick handler for the define fields breadcrumb
         *
         * @param {React.MouseEventHandler<HTMLElement>} e - Callback for when hovering over the delete icon
         * @returns {void}
         */
        onClick: (e) => {
          e.preventDefault();
          setActiveTab('DefineFields');
        },
      });
    }
    if (activeTab == 'DefineFilters'
                || activeTab == 'ViewData') {
      breadcrumbs.push({
        text: t('Define Filters', {ns: 'dataquery'}),
        /**
         * OnClick handler for the define filters breadcrumb
         *
         * @param {React.MouseEventHandler<HTMLElement>} e - Callback for when hovering over the delete icon
         * @returns {void}
         */
        onClick: (e) => {
          e.preventDefault();
          setActiveTab('DefineFilters');
        },
      });
    }

    if (activeTab == 'ViewData') {
      breadcrumbs.push({
        text: t('View Data', {ns: 'dataquery'}),
        /**
         * OnClick handler for the View Data breadcrumb
         *
         * @param {React.MouseEventHandler<HTMLElement>} e - Callback for when hovering over the delete icon
         * @returns {void}
         */
        onClick: (e) => {
          e.preventDefault();
          setActiveTab('ViewData');
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
  }, [activeTab, t]);
}

export default useBreadcrumbs;
