import React from 'react';
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
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class GenomicBrowser extends React.Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
  }
  /**
   * @return {DOMRect}
   */
  render() {
    const tabList = [
      {id: 'tabProfiles', label: 'Profiles'},
      {id: 'tabGWAS', label: 'GWAS'},
      {id: 'tabSNP', label: 'SNP'},
      {id: 'tabCNV', label: 'CNV'},
      {id: 'tabMethylation', label: 'Methylation'},
      {id: 'tabFiles', label: 'Files'},
    ];
    return (
      <div className={'col-sm-12'}>
        <div className={'row'}>
          <Tabs tabs={tabList} defaultTab='tabProfiles'>
            <TabPane TabId={tabList[0].id}><Profiles/></TabPane>
            <TabPane TabId={tabList[1].id}><GWAS/></TabPane>
            <TabPane TabId={tabList[2].id}><SNP/></TabPane>
            <TabPane TabId={tabList[3].id}><CNV/></TabPane>
            <TabPane TabId={tabList[4].id}><Methylation/></TabPane>
            <TabPane TabId={tabList[5].id}><Files/></TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

/**
 * Render Genomic Browser on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <GenomicBrowser/>,
    document.getElementById('lorisworkspace')
  );
});
