import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';

/**
 * File Panel
 *
 * This file contains React component for Electrophysiology module.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 */
class FilePanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const styles = {
      table: {
        caption: {
          fontSize: 15,
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#074785',
        },
        header: {
          color: '#074785',
          padding: '5px 10px',
          wordWrap: 'break-word',
          width: '200px',
        },
        style: {
          background: '#fff',
          width: '100%',
        },
        data: {
          padding: '5px 10px',
          wordWrap: 'break-word',
        },
      },
    };

    return (
      <Panel id={this.props.id} title={this.props.title}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            {this.props.children}
          </div>
          <Panel
            id={this.props.id + '_details'}
            title={'Acquisition Details for ' + this.props.title}
           >
            <div className={'container-fluid'}>
              <div
                className={'row no-gutters'}
              >
                <div
                  className={'no-gutters'}
                  style={{background: '#efefef'}}
                >
                  <div className={'col-xs-6'}>
                    <div className='table-responsive'>
                      <table
                        style={styles.table.style}
                        className='table-bordered'
                      >
                        <tbody>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Task Description
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.task.description}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Instructions
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.instructions}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              EEG Ground
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.eeg.ground}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Trigger Count
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.trigger_count}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              EEG Placement Scheme
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.eeg.placement_scheme}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Record Type
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.record_type}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              CogAtlas ID
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.cog.atlas_id}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              CogPOID
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.cog.poid}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Institution Name
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.institution.name}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Institution Address
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.institution.address}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={'col-xs-6'}>
                    <div className='table-responsive'>
                      <table
                        style={styles.table.style}
                        className='table-bordered'
                      >
                        <tbody>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Device Serial Number
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.device.serial_number}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Misc Channel Count
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.misc.channel_count}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Manufacturer
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.manufacturer.name}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Manufacturer Model Name
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.manufacturer.model_name}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Cap Manufacturer
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.cap.manufacturer}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Cap Model Name
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.cap.model_name}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Hardware Filters
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.hardware_filters}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Recording Duration
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.recording_duration}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Epoch Length
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.epoch_length}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Device Version
                            </th>
                            <td style={styles.table.data}>
                              {this.state.data.details.device.version}
                            </td>
                          </tr>
                          <tr>
                            <th scope='row' style={styles.table.header}>
                              Subject Artifact Description
                            </th>
                            <td style={styles.table.data}>
                              {
                                this.state.data.details
                                .subject_artifact_description
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
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

