import React, {Component} from 'react';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import PropTypes from 'prop-types';

class ImagingQCIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImgData: {},
      isLoadedImg: false,
      imgFilter: {},
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
    if (!this.state.isLoadedImg) {
      return <Loader/>;
    }
    if (Object.keys(this.state.ImgData).length > 0) {
      const ImgOptions = this.state.ImgData.fieldOptions;

      const ImgFields = [
        {
          label: 'PSCID', show: true, filter: {
            name: 'pSCID',
            type: 'text',
          },
        },
        {label: 'Session ID', show: true},
        {
          label: 'DCCID', show: true, filter: {
            name: 'candId',
            type: 'text',
          },
        },
        {
          label: 'Site', show: true, filter: {
            name: 'site',
            type: 'select',
            options: ImgOptions.site,
          },
        },
        {
          label: 'Project', show: true, filter: {
            name: 'project',
            type: 'select',
            options: ImgOptions.project,
          },
        },
        {
          label: 'Subproject', show: true, filter: {
            name: 'subproject',
            type: 'select',
            options: ImgOptions.subproject,
          },
        },
        {
          label: 'Visit Label', show: true, filter: {
            name: 'visitLabel',
            type: 'select',
            options: ImgOptions.visitLabel,
          },
        },
        {
          label: 'Scan Type', show: true, filter: {
            name: 'scanType',
            type: 'select',
            options: ImgOptions.scanType,
          },
        },
        {
          label: 'MRI Parameter Form', show: true, filter: {
            name: 'mRIParameterForm',
            type: 'select',
            options: ImgOptions.mRIParameterForm,
          },
        },
        {
          label: 'Scan Done in MRI PF', show: true, filter: {
            name: 'scanDoneInMRIPF',
            type: 'select',
            options: ImgOptions.scanDoneInMRIPF,
          },
        },
        {
          label: 'Tarchive', show: true, filter: {
            name: 'tarchive',
            type: 'select',
            options: ImgOptions.tarchive,
          },
        },
        {
          label: 'Scan Location', show: true, filter: {
            name: 'scanLocation',
            type: 'select',
            options: ImgOptions.scanLocation,
          },
        },
        {
          label: 'QC Status', show: true, filter: {
            name: 'qCStatus',
            type: 'select',
            options: ImgOptions.qCStatus,
          },
        },
        {
          label: 'Uploaded By', show: true, filter: {
            name: 'uploadedBy',
            type: 'select',
            options: ImgOptions.uploadedBy,
          },
        },
        {
          label: 'Selected', show: true, filter: {
            name: 'selected',
            type: 'select',
            options: ImgOptions.selected,
          },
        },
        {label: 'CommentID', show: false},
        {label: 'TarchiveID', show: false},
      ];

      const datatable = (
          <FilterableDataTable
            name="imaging_qc"
            data={this.state.ImgData.Data}
            fields={ImgFields}
            getFormattedCell={this.formatColumn}
          />
      );
      return (
        <div>
            {datatable}
        </div>
      );
    } else {
      return (
        <div>
          <h3>An error occurred while loading the page.</h3>
        </div>
      );
    }
  }
}

ImagingQCIndex.propTypes = {
  ImgDataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <ImagingQCIndex
      ImgDataURL={`${loris.BaseURL}/imaging_qc/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});

