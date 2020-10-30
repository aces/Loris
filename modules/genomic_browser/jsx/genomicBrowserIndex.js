import React from 'react';
import PropTypes from 'prop-types';
import {TabPane, Tabs} from 'jsx/Tabs';
import Profiles from './tabs_content/profiles';
import GWAS from './tabs_content/gwas';
import SNP from './tabs_content/snp';
import CNV from './tabs_content/cnv';
import Methylation from './tabs_content/methylation';
import Files from './tabs_content/files';

/**
 * Genomic Browser.
 *
 * @description the Genomic Browser of LORIS.
 * @param {param} props the react properties for the component.
 * @return {react} element tabPane of the GenomicBrowser.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
const GenomicBrowser = (props) => {
  const tabList = [
    {id: 'tabProfiles', label: 'Profiles'},
    {id: 'tabGWAS', label: 'GWAS'},
    {id: 'tabSNP', label: 'SNP'},
    {id: 'tabCNV', label: 'CNV'},
    {id: 'tabMethylation', label: 'Methylation'},
    {id: 'tabFiles', label: 'Files'},
  ];

  /**
   * @return {React} render the panels of the GenomicBrowser.
   */
  return (
    <div className={'col-sm-12'}>
      <div className={'row'}>
        <Tabs tabs={tabList} defaultTab='tabProfiles'>
          <TabPane TabId={tabList[0].id}>
            <Profiles baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[1].id}>
            <GWAS baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[2].id}>
            <SNP baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[3].id}>
            <CNV baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[4].id}>
            <Methylation baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[5].id}>
            <Files baseURL={props.baseURL}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
GenomicBrowser.propTypes = {
  baseURL: PropTypes.string.isRequired,
};

/**
 * Render Genomic Browser on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <GenomicBrowser
      baseURL={loris.BaseURL}
    />,
    document.getElementById('lorisworkspace')
  );
});
