/**
 * This file contains React component for Electrophysiology module.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 *
 */

import Panel from 'jsx/Panel';

class FilePanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
    };

  }

  /**
   * Component did mount.
   */
  componentDidMount() {

  }

  /**
   * Post-Render when we can access the DOM.
   */
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
  }

  render() {

    const styles = {
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
          border: '1px solid #1c4781'
        }
      },
      div: {
        container: {
          details: {
            height: '250px',
            minWidth: '300px',
            paddingBottom: '10px'
          },
          table: {
            minWidth: '300px',
            paddingBottom: '10px'
          },
          download: {
            minWidth: '300px',
            paddingBottom: '10px'
          }
        },
        element: {
          download_title: {
            color: '#074785',
            fontWeight: 'bold',
            lineHeight: '40px',
            textAlign: 'center',
            verticalAlign: 'middle',
          }
        }
      },
      table: {
        style: {
          width: '100%',
          minWidth: '300px'
        },
        caption: {
          fontSize: 15,
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor:'#074785',
        },
        row: {
          height: '30px',
          border: '1px solid gray'
        },
        header: {
          width: '1%',
          color: '#074785',
          paddingLeft: '5px',
          whiteSpace: 'nowrap'
        },
        data: {
          width: '1%',
          whiteSpace: 'nowrap'
        }
      }
    };

    return(
      <Panel id={this.props.id} title={this.props.title}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            <div className={'col-sm-4'} style={styles.div.container.details}>
              ..insert head image here..
            </div>
            <div className={'col-sm-4'} style={styles.div.container.table}>
              <table style={styles.table.style}>
                <caption style={styles.table.caption}>Task Name: FaceHousCheck</caption>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>Sampling Frequency</th>
                  <td style={styles.table.data}>{this.state.data.task.frequency.sampling}</td>
                </tr>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>{this.state.data.task.channel[0].name}</th>
                  <td style={styles.table.data}>{this.state.data.task.channel[0].value}</td>
                </tr>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>{this.state.data.task.channel[1].name}</th>
                  <td style={styles.table.data}>{this.state.data.task.channel[1].value}</td>
                </tr>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>{this.state.data.task.channel[2].name}</th>
                  <td style={styles.table.data}>{this.state.data.task.channel[2].value}</td>
                </tr>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>{this.state.data.task.channel[3].name}</th>
                  <td style={styles.table.data}>{this.state.data.task.channel[3].value}</td>
                </tr>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>EEG Reference</th>
                  <td style={styles.table.data}>{this.state.data.task.reference}</td>
                </tr>
                <tr style={styles.table.row}>
                  <th scope='row' style={styles.table.header}>Powerline Frequency</th>
                  <td style={styles.table.data}>{this.state.data.task.frequency.powerline}</td>
                </tr>
              </table>
            </div>
            <div className={'col-sm-4'} style={styles.div.container.download}>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={styles.div.element.download_title}>EEG File</div>
                <div className={'col-xs-2'}><button style={styles.button.download}>Download</button></div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={styles.div.element.download_title}>Electrode Info</div>
                <div className={'col-xs-2'}><button style={styles.button.download}>Download</button></div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={styles.div.element.download_title}>Channels Info</div>
                <div className={'col-xs-2'}><button style={styles.button.download}>Download</button></div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={styles.div.element.download_title}>Events</div>
                <div className={'col-xs-2'}><button style={styles.button.download}>Download</button></div>
              </div>
              <div className={'form-group row flex-v-center'}>
                <div className={'col-xs-5'} style={styles.div.element.download_title}>All Files</div>
                <div className={'col-xs-2'}><button style={styles.button.download}>Download</button></div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}
FilePanel.propTypes = {
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  data: React.PropTypes.object
};
FilePanel.defaultProps = {
  id: 'file_panel',
  title: 'FILENAME',
  data: {}
};

class DetailsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
    };

    console.log('Check this');
    console.log(this.state.data);

  }

  render() {

    const styles = {
      panel: {
        padding: 0
      },
      container: {
        task: {
          padding: 0
        },
        device: {
          padding: 0
        }
      },
      table: {
        style: {
          maxWidth: '100%',
          minWidth: '300px'
        },
        row: {
          minHeight: '30px',
          border: '1px solid gray'
        },
        header: {
          width: 'auto',
          padding:'10px',
          color: '#074785'
        },
        data: {
          width: '1%',
          padding:'10px 50px 10px 10px',
          whiteSpace: 'nowrap'
        }
      }
    };

    return(
      <Panel id={this.props.id} title={this.props.title} style={styles.panel}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            <div className={'col-xs-6'} style={styles.container.task}>
              <div className='table-responsive' style={{overflowX: 'scroll'}}>
                <table style={styles.table.style}>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Task Description</th>
                    <td style={styles.table.data}>{this.state.data.task.description}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Instructions</th>
                    <td style={styles.table.data}>{this.state.data.instructions}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>EEG Ground</th>
                    <td style={styles.table.data}>{this.state.data.eeg.ground}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Trigger Count</th>
                    <td style={styles.table.data}>{this.state.data.trigger_count}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>EEG Placement Scheme</th>
                    <td style={styles.table.data}>{this.state.data.eeg.placement_scheme}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Record Type</th>
                    <td style={styles.table.data}>{this.state.data.record_type}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>CogAtlas ID</th>
                    <td style={styles.table.data}>{this.state.data.cog.atlas_id}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>CogPOID</th>
                    <td style={styles.table.data}>{this.state.data.cog.poid}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Institution Name</th>
                    <td style={styles.table.data}>{this.state.data.institution.name}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Institution Address</th>
                    <td style={styles.table.data}>{this.state.data.institution.address}</td>
                  </tr>
                </table>
              </div>
            </div>

            <div className={'col-xs-6'} style={styles.container.device}>
              <div className='table-responsive' style={{overflowX: 'scroll'}}>
                <table style={styles.table.style}>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Device Serial Number</th>
                    <td style={styles.table.data}>{this.state.data.device.serial_number}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Misc Channel Count</th>
                    <td style={styles.table.data}>{this.state.data.misc.channel_count}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Manufacturer</th>
                    <td style={styles.table.data}>{this.state.data.manufacturer.name}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Manufacturer Model Name</th>
                    <td style={styles.table.data}>{this.state.data.manufacturer.model_name}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Cap Manufacturer</th>
                    <td style={styles.table.data}>{this.state.data.cap.manufacturer}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Cap Model Name</th>
                    <td style={styles.table.data}>{this.state.data.cap.model_name}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope="row" style={styles.table.header}>Hardware Filters</th>
                    <td style={styles.table.data}>{this.state.data.hardware_filters}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Recording Duration</th>
                    <td style={styles.table.data}>{this.state.data.recording_duration}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Epoch Length</th>
                    <td style={styles.table.data}>{this.state.data.epoch_length}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Device Version</th>
                    <td style={styles.table.data}>{this.state.data.device.version}</td>
                  </tr>
                  <tr style={styles.table.row}>
                    <th scope='row' style={styles.table.header}>Subject Artifact Description</th>
                    <td style={styles.table.data}>{this.state.data.subject_artifact_description}</td>
                  </tr>
                </table>
              </div>
            </div>

          </div>
        </div>
      </Panel>
    );
  }

}
DetailsPanel.propTypes = {
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  data: React.PropTypes.object
};
DetailsPanel.defaultProps = {
  id: 'data_panel',
  title: 'DATA DETAILS',
  data: {

  }
};

export {
  FilePanel,
  DetailsPanel
}