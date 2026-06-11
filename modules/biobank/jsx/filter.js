import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';

import SpecimenTab from './specimenTab';
import ContainerTab from './containerTab';
import PoolTab from './poolTab';
import ShipmentTab from './shipmentTab';

/**
 * Render a filter in the biobank.
 */
class BiobankFilter extends Component {
  /**
   * Render the component
   *
   * @return {JSX}
   */
  render() {
    const {t} = this.props;
    const specimenTab = (
      <SpecimenTab
        data={this.props.data}
        options={this.props.options}
        saveBatchEdit={this.props.saveBatchEdit}
        createPool={this.props.createPool}
        createSpecimens={this.props.createSpecimens}
        updateSpecimens={this.props.updateSpecimens}
        editSpecimens={this.props.editSpecimens}
        history={this.props.history}
        increaseCoordinate={this.props.increaseCoordinate}
        loading={this.props.loading}
      />
    );

    const containerTab = (
      <ContainerTab
        data={this.props.data}
        options={this.props.options}
        createContainers={this.props.createContainers}
        history={this.props.history}
        loading={this.props.loading}
      />
    );

    const poolTab = (
      <PoolTab
        data={this.props.data}
        options={this.props.options}
        createSpecimens={this.props.createSpecimens}
        increaseCoordinate={this.props.increaseCoordinate}
        loading={this.props.loading}
      />
    );

    const shipmentTab = (
      <ShipmentTab
        data={this.props.data}
        setData={this.props.setData}
        options={this.props.options}
      />
    );

    const tabInfo = [];
    const tabList = [];
    if (loris.userHasPermission('biobank_specimen_view')) {
      tabInfo.push({id: 'specimens', content: specimenTab});
      tabList.push({id: 'specimens', label: t('Specimens', {ns: 'biobank'})});
    }
    if (loris.userHasPermission('biobank_container_view')) {
      tabInfo.push({id: 'containers', content: containerTab});
      tabList.push({id: 'containers', label: t('Containers', {ns: 'biobank'})});
    }
    if (loris.userHasPermission('biobank_pool_view')) {
      tabInfo.push({id: 'pools', content: poolTab});
      tabList.push({id: 'pools', label: t('Pools', {ns: 'biobank'})});
    }
    tabInfo.push({id: 'shipments', content: shipmentTab});
    tabList.push({id: 'shipments', label: t('Shipments', {ns: 'biobank'})});

    const tabContent = Object.keys(tabInfo).map((key) => {
      return (
        <TabPane key={key} TabId={tabInfo[key].id}>
          {tabInfo[key].content}
        </TabPane>
      );
    });

    return (
      <div id='biobank-page'>
        <Tabs tabs={tabList} defaultTab={tabList[0].id} updateURL={true}>
          {tabContent}
        </Tabs>
      </div>
    );
  }
}

BiobankFilter.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.object,
  options: PropTypes.object,
  saveBatchEdit: PropTypes.func,
  createPool: PropTypes.func,
  createSpecimens: PropTypes.func,
  updateSpecimens: PropTypes.func,
  editSpecimens: PropTypes.func,
  history: PropTypes.object,
  increaseCoordinate: PropTypes.func,
  loading: PropTypes.bool,
  createContainers: PropTypes.func,
  setData: PropTypes.func,
};

export default withTranslation(['biobank', 'loris'])(BiobankFilter);
