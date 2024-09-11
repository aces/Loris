/**
 * This file contains React component for Electrophysiology module.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * EEG Download Panel
 *
 * Display EEG files fto download
 */
class DownloadPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      downloads: this.props.downloads,
      physioFileID: this.props.physioFileID,
      annotationsAction: loris.BaseURL
        + '/electrophysiology_browser/events',
      outputType: this.props.outputType,
    };
  }


  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <Panel
        id={this.props.id}
        title={'File Download'}
      >
        <div
          style={{minHeight: '300px'}}
          id={this.props.id + '-group'}
        >
          {this.state.downloads.map((panel, i) => {
            const panelName = panel.groupName;
            const links = (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: '250px',
                  margin: '0 auto',
                }
                }>
                {Object.entries(panel.links).map(([type, download], j) => {
                  const disabled = (download.file === '');

                  // Ignore physiological_coord_system_file
                  return type !== 'physiological_coord_system_file'
                    ? (
                      <div
                        key={j}
                        className={'form-group'}
                      >
                        <div
                          className='col-xs-6'
                          style={{
                            color: '#074785',
                            fontWeight: 'bold',
                            lineHeight: '30px',
                            verticalAlign: 'middle',
                            paddingLeft: 0,
                          }}
                        >{download.label}</div>
                        {disabled
                          ? <a
                            className='btn disabled col-xs-6'
                            style={{
                              color: '#b3b3b3',
                              cursor: 'not-allowed',
                              border: '1px solid #b3b3b3',
                              margin: 0,
                            }}
                          >Not Available</a>
                          : <a
                            className='btn btn-primary download col-xs-6'
                            href={
                              (type ==
                                'physiological_event_files' ||
                                type == 'all_files') ?
                                this.state.annotationsAction
                                + '?physioFileID=' + this.state.physioFileID
                                + '&filePath=' + download.file
                                : '/mri/jiv/get_file.php?file=' + download.file
                            }
                            target='_blank'
                            style={{
                              margin: 0,
                            }}
                          >
                            Download
                          </a>
                        }
                      </div>
                    )
                    : null;
                })}
              </div>
            );

            if (this.state.downloads.length > 1) {
              return (
                <Panel
                  id={this.props.id + '-' + i}
                  title={panelName}
                  initCollapsed={i !== 0}
                  key={i}
                  parentId={this.props.id + '-group'}
                >
                  {links}
                </Panel>
              );
            } else {
              return links;
            }
          })}
        </div>
      </Panel>
    );
  }
}


DownloadPanel.propTypes = {
  downloads: PropTypes.array,
  physioFileID: PropTypes.number,
  outputType: PropTypes.string,
  id: PropTypes.string,
};

DownloadPanel.defaultProps = {
  downloads: [],
};

export {DownloadPanel};
