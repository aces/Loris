import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';
import swal from 'sweetalert2';

/**
 * File Panel
 *
 * This file contains React component for Electrophysiology module.
 *
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
      id: this.props.fileId,
    };
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const halfSize = this.state.data.length/2;
    const columns = [
      this.state.data.slice(0, halfSize),
      this.state.data.slice(halfSize),
    ];

    return (
      <Panel id={this.props.id} title={this.props.title}>
        <div className={'container-fluid'}>
          <div className={'row'}>
            {this.props.children}
          </div>
          <Panel
            id={this.props.id + '_details'}
            title={'Acquisition Details for Recording '
              + this.props.title.split('.').slice(0, -1).join('.')
            }
           >
            <div className={'container-fluid'}>
              <div className={'row no-gutters'}>
                <div className={'no-gutters'}>
                  {columns.map((column, i) => (
                    <div
                      key={i}
                      className={'col-md-6'}
                    >
                      <div className='table-responsive'>
                        <table
                          style={{
                            background: '#fff',
                            width: '100%',
                          }}
                          className='table-bordered'
                        >
                          <tbody>
                            {column.map((row, j) => {
                              const {name, value} = row;
                              return (
                                <tr key={j}>
                                  <th
                                    scope='row'
                                    style={{
                                      color: '#074785',
                                      padding: '5px 10px',
                                      wordWrap: 'break-word',
                                      width: '200px',
                                    }}
                                  >{name}</th>
                                  <td style={{
                                    padding: '5px 10px',
                                    wordWrap: 'break-word',
                                  }}>{value}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </Panel>
    );
  }

    /**
     * Called by download all or download annotations button to
     * update the annotation files before downloading
     */
    handleClick() {
        console.log('The link was clicked.');
        console.log(this.state.id);
        const data = {physioFileID: this.state.id};

        fetch(this.props.url, {
            method: 'PUT',
            body: JSON.stringify(data),
        }).then((response) => {
            if (!response.ok) {
                console.error(response.status);
                return;
            }

            response.json().then((data) => {
                let msgType = 'success';
                let message = 'Your files will be downloaded in 2 seconds!';
                this.showAlertMessage(msgType, message);
                console.log(message);
            });
        }).catch((error) => {
            console.error(error);

            let msgType = 'error';
            let message = 'Failed to update annotation files';
            this.showAlertMessage(msgType, message);
            console.log(message);
        });
    }

    /**
     * Display a success/error alert message after form submission
     * @param {string} msgType - error/success message
     * @param {string} message - message content
     */
    showAlertMessage(msgType, message) {
        let type = 'success';
        let title = 'Files updated!';
        let text = message || '';
        let timer = null;
        let confirmation = true;
        let callback = function() {};

        if (msgType === 'success') {
            title = 'Files Updated!';
            timer = 2000;
            confirmation = false;
        } else if (msgType === 'error') {
            type = 'error';
            title = 'Error!';
        }

        swal.fire({
            title: title,
            type: type,
            text: text,
            timer: timer,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: confirmation,
        }, callback.bind(this));
    }
}

FilePanel.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.array,
};

FilePanel.defaultProps = {
  id: 'file_panel',
  title: 'FILENAME',
  data: [],
};

export {
  FilePanel,
};
