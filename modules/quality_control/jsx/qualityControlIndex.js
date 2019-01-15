import React, {Component} from 'react';
import Loader from 'Loader';
import {Tabs, TabPane} from 'Tabs';
import FilterableDataTable from 'FilterableDataTable';
import PropTypes from 'prop-types';

class QualityControlIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImgData: {},
      BehavioralData: {},
      isLoadedImg: false,
      isLoadedBehavioral: false,
      imgFilter: {},
      behavioralFilter: {},
    };
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */

  formatColumn(column, cell, row) {
      let result = <td>{cell}</td>;
      switch (column) {
      case 'Scan Done in MRI PF':
        if (cell == 'Yes') {
          let mpfURL = loris.BaseURL + '/instruments/mri_parameter_form/?commentID=' +
              row.CommentID + '&sessionID=' + row['Session ID'] +
              '&candID=' + row.DCCID;
          result = <td><a href={mpfURL}>{cell}</a></td>;
        }
      case 'Scan Location':
        if (cell == 'In Imaging Browser') {
          let imgURL = loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' +
              row['Session ID'];
          result = <td><a href={imgURL}>{cell}</a></td>;
        }
      case 'Tarchive':
        if (cell == 'In DICOM') {
          let tarchiveURL = loris.BaseURL +
              '/dicom_archive/viewDetails/?tarchiveID=' + row.TarchiveID;
          result = <td><a href = {tarchiveURL}>{cell}</a></td>;
        }
      }
      return result;
  }

  componentDidMount() {
    this.fetchData(this.props.ImgDataURL, 'ImgData')
        .then(() => this.setState({isLoadedImg: true}));
    this.fetchData(this.props.BehavioralDataURL, 'BehavioralData')
        .then(() => this.setState({isLoadedBehavioral: true}));
  }

  fetchData(url, state) {
    return fetch(url, {credentials: 'same-origin'})
        .then((resp) => resp.json())
        .then((data) => this.setState({[state]: data}))
        .catch((error) => {
            this.setState({error: true});
      });
  }

  render() {
    if (!this.state.isLoadedBehavioral || !this.state.isLoadedImg) {
      return <Loader/>;
    }
    let tabList = [
      {id: 'behavioral', label: 'Behavioral'},
      {id: 'imaging', label: 'Imaging'},
    ];

    const ImgOptions = this.state.ImgData.fieldOptions;
    const BehavioralOptions = this.state.BehavioralData.fieldOptions;

    const ImgFields = [
      {label: 'PSCID', show: true, filter: {
        name: 'pSCID',
        type: 'text',
      }},
      {label: 'Session ID', show: true},
      {label: 'DCCID', show: true, filter: {
        name: 'candId',
        type: 'text',
      }},
      {label: 'Site', show: true, filter: {
         name: 'site',
         type: 'select',
         options: ImgOptions.site,
      }},
      {label: 'Project', show: true, filter: {
        name: 'project',
        type: 'select',
        options: ImgOptions.project,
      }},
      {label: 'Subproject', show: true, filter: {
        name: 'subproject',
        type: 'select',
        options: ImgOptions.subproject,
      }},
      {label: 'Visit Label', show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: ImgOptions.visitLabel,
      }},
      {label: 'Scan Type', show: true, filter: {
        name: 'scanType',
        type: 'select',
        options: ImgOptions.scanType,
      }},
      {label: 'MRI Parameter Form', show: true, filter: {
        name: 'mRIParameterForm',
        type: 'select',
        options: ImgOptions.mRIParameterForm,
      }},
      {label: 'Scan Done in MRI PF', show: true, filter: {
        name: 'scanDoneInMRIPF',
        type: 'select',
        options: ImgOptions.scanDoneInMRIPF,
      }},
      {label: 'Tarchive', show: true, filter: {
        name: 'tarchive',
        type: 'select',
        options: ImgOptions.tarchive,
      }},
      {label: 'Scan Location', show: true, filter: {
        name: 'scanLocation',
        type: 'select',
        options: ImgOptions.scanLocation,
      }},
      {label: 'QC Status', show: true, filter: {
        name: 'qCStatus',
        type: 'select',
        options: ImgOptions.qCStatus,
      }},
      {label: 'Uploaded By', show: true, filter: {
        name: 'uploadedBy',
        type: 'select',
        options: ImgOptions.uploadedBy,
      }},
      {label: 'Selected', show: true, filter: {
        name: 'selected',
        type: 'select',
        options: ImgOptions.selected,
      }},
      {label: 'CommentID', show: false},
      {label: 'TarchiveID', show: false},
    ];

    const BehavioralFields = [
      {label: 'Visit Label', show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: BehavioralOptions.visits,
      }},
      {label: 'DCCID', show: true, filter: {
        name: 'candId',
        type: 'text',
      }},
      {label: 'PSCID', show: true, filter: {
        name: 'pSCID',
        type: 'text',
      }},
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: BehavioralOptions.instrument,
      }},
    ];

    const tab0 = (
      <TabPane TabId={tabList[0].id}>
        <FilterableDataTable
          name="quality_control_behavioural"
          data={this.state.BehavioralData.Data}
          fields={BehavioralFields}
          getFormattedCell={this.formatColumn}
        />
      </TabPane>
    );

    const tab1 = (
      <TabPane TabId={tabList[1].id}>
        <FilterableDataTable
          name="quality_control"
          data={this.state.ImgData.Data}
          fields={ImgFields}
          getFormattedCell={this.formatColumn}
        />
      </TabPane>
    );
    return (
      <div>
        <Tabs id = "TabPanes" tabs={tabList} defaultTab={tabList[0].id}
        updateURL={true}>
          {tab0}
          {tab1}
        </Tabs>
      </div>
    );
  }
}

QualityControlIndex.propTypes = {
  ImgDataURL: PropTypes.string.isRequired,
  BehavioralDataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <QualityControlIndex
      ImgDataURL={`${loris.BaseURL}/quality_control/?format=json`}
      BehavioralDataURL = {`${loris.BaseURL}/quality_control/quality_control_behavioral/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});

