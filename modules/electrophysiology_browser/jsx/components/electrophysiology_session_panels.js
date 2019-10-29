/**
 * This file contains React component for Electrophysiology module.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';


class FilePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  /**
   * Component did mount.
   */
  componentDidMount() {
    console.log('componentDidUpdate check:');
    console.log(JSON.stringify(this.state.data.downloads));
    let downloads = [
      'download_eeg_file',
      'download_electrode_info',
      'download_channels_info',
      'download_events',
      'download_all_files',
      'download_fdt_file',
    ];
    for (let i=0; i<this.state.data.downloads.length; i++) {
      console.log(this.state.data.downloads[i]);
      if (this.state.data.downloads[i].file === '') {
        document.getElementById(downloads[i]).removeAttribute('href');
        let downloadButton = document.getElementById('btn_' + downloads[i]);
        downloadButton.disabled = true;
        downloadButton.style.border = '1px solid #b3b3b3';
        downloadButton.style.color = '#b3b3b3';
        downloadButton.style.cursor = 'not-allowed';
        downloadButton.innerHTML = 'Not Available';
        if (this.state.data.downloads[i].type === 'physiological_fdt_file') {
          downloadButton.style.display = 'none';
          let fdtTitle = document.getElementById('fdt_title');
          fdtTitle.style.display = 'none';
        }
      }
    }
  }

  /**
   * Post-Render when we can access the DOM.
   *
   * @param {object} prevProps
   * @param {object} prevState
   *
   */
  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    const stylesFile = {
      button: {
        download: {
          height: '40px',
          width: '140px',
          outline: 'none',
          color: '#1c4781',
          cursor: 'pointer',
          borderRadius: '40px',
          textDecoration: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid #1c4781',
        },
      },
      div: {
        container: {
          details: {
            height: '250px',
            minWidth: '300px',
            paddingBottom: '10px',
          },
          table: {
            minWidth: '300px',
            paddingBottom: '10px',
          },
          download: {
            minWidth: '300px',
            paddingBottom: '10px',
          },
        },
        element: {
          download_title: {
            color: '#074785',
            fontWeight: 'bold',
            lineHeight: '40px',
            textAlign: 'center',
            verticalAlign: 'middle',
          },
        },
      },
      table: {
        style: {
          width: '100%',
          minWidth: '300px',
        },
        caption: {
          fontSize: 15,
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#074785',
        },
        row: {
          height: '30px',
          border: '1px solid gray',
        },
        header: {
          width: '1%',
          color: '#074785',
          paddingLeft: '10px',
          whiteSpace: 'nowrap',
        },
        data: {
          width: '1%',
          paddingLeft: '10px',
          whiteSpace: 'nowrap',
        },
      },
    };

    const stylesDetails = {
      panel: {
        padding: 0,
      },
      container: {
        task: {
          padding: 0,
        },
        device: {
          padding: 0,
        },
      },
      table: {
        style: {
          width: '100%',
          height: 'auto',
          tableLayout: 'fixed',
        },
        row: {
          minHeight: '30px',
          border: '1px solid gray',
          height: 'auto',
        },
        header: {
          width: '190px',
          padding: '10px',
          color: '#074785',
          height: 'auto',
        },
        data: {
          padding: '10px 50px 10px 10px',
          height: 'auto',
          wordWrap: 'break-word',
        },
      },
    };

    return (
      <Panel id={this.props.id} title={this.props.title}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            {/* <div className={'col-sm-4'} style={stylesFile.div.container.details}> */}
              {/* ..insert head image here.. */}
            {/* </div> */}
            <div className={'col-sm-6'} style={stylesFile.div.container.table}>
              <table style={stylesFile.table.style}>
                <caption style={stylesFile.table.caption}>Acquisition Summary</caption>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>Sampling Frequency</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.frequency.sampling}</td>
                </tr>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>{this.state.data.task.channel[0].name}</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.channel[0].value}</td>
                </tr>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>{this.state.data.task.channel[1].name}</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.channel[1].value}</td>
                </tr>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>{this.state.data.task.channel[2].name}</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.channel[2].value}</td>
                </tr>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>{this.state.data.task.channel[3].name}</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.channel[3].value}</td>
                </tr>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>EEG Reference</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.reference}</td>
                </tr>
                <tr style={stylesFile.table.row}>
                  <th scope='row' style={stylesFile.table.header}>Powerline Frequency</th>
                  <td style={stylesFile.table.data}>{this.state.data.task.frequency.powerline}</td>
                </tr>
              </table>
            </div>
            <div className={'col-sm-6'} style={stylesFile.div.container.download}>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={stylesFile.div.element.download_title}>All Files</div>
                <div className={'col-xs-2'}>
                  <a id='download_all_files' href={loris.BaseURL + '/electrophysiology_browser/ajax/FileDownload.php?File=' + this.state.data.downloads[4].file} target='_blank' download={this.state.data.downloads[0].file}>
                    <button id='btn_download_all_files' style={stylesFile.button.download}>Download</button>
                  </a>
                </div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={stylesFile.div.element.download_title}>EEG File</div>
                <div className={'col-xs-2'}>
                  <a id='download_eeg_file' href={loris.BaseURL + '/electrophysiology_browser/ajax/FileDownload.php?File=' + this.state.data.downloads[0].file} target='_blank' download={this.state.data.downloads[0].file}>
                    <button id='btn_download_eeg_file' style={stylesFile.button.download}>Download</button>
                  </a>
                </div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={stylesFile.div.element.download_title}>Electrode Info</div>
                <div className={'col-xs-2'}>
                  <a id='download_electrode_info' href={loris.BaseURL + '/electrophysiology_browser/ajax/FileDownload.php?File=' + this.state.data.downloads[1].file} target='_blank' download={this.state.data.downloads[0].file}>
                    <button id='btn_download_electrode_info' style={stylesFile.button.download}>Download</button>
                  </a>
                </div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={stylesFile.div.element.download_title}>Channels Info</div>
                <div className={'col-xs-2'}>
                  <a id='download_channels_info' href={loris.BaseURL + '/electrophysiology_browser/ajax/FileDownload.php?File=' + this.state.data.downloads[2].file} target='_blank' download={this.state.data.downloads[0].file}>
                    <button id='btn_download_channels_info' style={stylesFile.button.download}>Download</button>
                  </a>
                </div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={stylesFile.div.element.download_title}>Events</div>
                <div className={'col-xs-2'}>
                  <a id='download_events' href={loris.BaseURL + '/electrophysiology_browser/ajax/FileDownload.php?File=' + this.state.data.downloads[3].file} target='_blank' download={this.state.data.downloads[0].file}>
                    <button id='btn_download_events' style={stylesFile.button.download}>Download</button>
                  </a>
                </div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} id='fdt_title' style={stylesFile.div.element.download_title}>FDT File</div>
                <div className={'col-xs-2'}>
                  <a id='download_fdt_file' href={loris.BaseURL + '/electrophysiology_browser/ajax/FileDownload.php?File=' + this.state.data.downloads[5].file} target='_blank' download={this.state.data.downloads[0].file}>
                    <button id='btn_download_fdt_file' style={stylesFile.button.download}>Download</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Panel id={this.props.id + '_details'} title={'Acquisition Details for ' + this.props.title} style={stylesDetails.panel}>
          <div className={'container-fluid'}>
            <div className={'row'}>
              <div className={'col-xs-6'} style={stylesDetails.container.task}>
                <div className='table-responsive'>
                  <table style={stylesDetails.table.style}>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Task Description</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.task.description}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Instructions</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.instructions}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>EEG Ground</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.eeg.ground}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Trigger Count</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.trigger_count}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>EEG Placement Scheme</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.eeg.placement_scheme}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Record Type</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.record_type}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>CogAtlas ID</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.cog.atlas_id}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>CogPOID</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.cog.poid}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Institution Name</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.institution.name}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Institution Address</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.institution.address}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <div className={'col-xs-6'} style={stylesDetails.container.device}>
                <div className='table-responsive'>
                  <table style={stylesDetails.table.style}>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Device Serial Number</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.device.serial_number}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Misc Channel Count</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.misc.channel_count}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Manufacturer</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.manufacturer.name}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Manufacturer Model Name</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.manufacturer.model_name}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Cap Manufacturer</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.cap.manufacturer}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Cap Model Name</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.cap.model_name}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Hardware Filters</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.hardware_filters}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Recording Duration</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.recording_duration}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Epoch Length</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.epoch_length}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Device Version</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.device.version}</td>
                    </tr>
                    <tr style={stylesDetails.table.row}>
                      <th scope='row' style={stylesDetails.table.header}>Subject Artifact Description</th>
                      <td style={stylesDetails.table.data}>{this.state.data.details.subject_artifact_description}</td>
                    </tr>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </Panel>
      </Panel>
    );
  }
}
FilePanel.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
};
FilePanel.defaultProps = {
  id: 'file_panel',
  title: 'FILENAME',
  data: {},
};

export {
  FilePanel,
};
