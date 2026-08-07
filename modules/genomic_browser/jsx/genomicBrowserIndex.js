import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import {TabPane, Tabs} from 'jsx/Tabs';
import Profiles from './tabs_content/profiles';
import GWAS from './tabs_content/gwas';
import SNP from './tabs_content/snp';
import CNV from './tabs_content/cnv';
import Methylation from './tabs_content/methylation';
import Files from './tabs_content/files';

import frStrings from '../locale/fr/LC_MESSAGES/genomic_browser.json';

/**
 * Genomic Browser.
 *
 * @description the Genomic Browser of LORIS.
 * @param {object} props the react properties for the component.
 * @return {JSX} element tabPane of the GenomicBrowser.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
const GenomicBrowser = (props) => {
  const {t} = props;
  const tabList = [
    {id: 'tabProfiles', label: t('Profiles', {ns: 'genomic_browser'})},
    {id: 'tabGWAS', label: t('GWAS', {ns: 'genomic_browser'})},
    {id: 'tabSNP', label: t('SNP', {ns: 'genomic_browser'})},
    {id: 'tabCNV', label: t('CNV', {ns: 'genomic_browser'})},
    {id: 'tabMethylation', label: t('Methylation', {ns: 'genomic_browser'})},
    {id: 'tabFiles', label: t('Files', {ns: 'genomic_browser', count: 99})},
  ];

  /**
   * @return {JSX} render the panels of the GenomicBrowser.
   */
  return (
    <div className={'col-sm-12'}>
      <div className={'row'}>
        <Tabs tabs={tabList} defaultTab='tabProfiles'>
          <TabPane TabId={tabList[0].id}>
            <Profiles baseURL={props.baseURL} />
          </TabPane>
          <TabPane TabId={tabList[1].id}>
            <GWAS baseURL={props.baseURL} />
          </TabPane>
          <TabPane TabId={tabList[2].id}>
            <SNP baseURL={props.baseURL} />
          </TabPane>
          <TabPane TabId={tabList[3].id}>
            <CNV baseURL={props.baseURL} />
          </TabPane>
          <TabPane TabId={tabList[4].id}>
            <Methylation baseURL={props.baseURL} />
          </TabPane>
          <TabPane TabId={tabList[5].id}>
            <Files baseURL={props.baseURL} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
GenomicBrowser.propTypes = {
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

/**
 * Render Genomic Browser on page load.
 */
window.addEventListener('load', () => {
  i18n.addResourceBundle('fr', 'genomic_browser', frStrings);
  i18n.addResourceBundle('ja', 'genomic_browser', {});
  i18n.addResourceBundle('zh', 'genomic_browser', {});
  const TranslatedGenomicB = withTranslation(
    ['genomic_browser', 'loris']
  )(GenomicBrowser);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <TranslatedGenomicB
      baseURL={loris.BaseURL}
    />
  );
});
