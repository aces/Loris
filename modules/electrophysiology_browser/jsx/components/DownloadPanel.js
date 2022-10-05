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
          + '/electrophysiology_browser/annotations',
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
                {panel.links.map((download, j) => {
                  const disabled = (download.file === '');

                  // Hide the download in this particular case
                  // It does not make sense to display Not Available for FDT files
                  if (disabled && download.type === 'physiological_fdt_file') {
                    return null;
                  }

                  return (
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
                            href={this.state.outputType == 'derivative' &&
                              (download.type ==
                              'physiological_annotation_files' ||
                              download.type == 'all_files') ?
                                this.state.annotationsAction
                                + '?physioFileID=' + this.state.physioFileID
                                + '&filePath=' + download.file
                                : '/mri/jiv/get_file.php?file=' + download.file
                            }
                            target='_blank'
                            download={this.state.downloads[0].file}
                            style={{
                              margin: 0,
                            }}
                          >Download</a>
                      }
                    </div>
                  );
                })}
              </div>
            );

            if (this.state.downloads.length > 1) {
              return (
                <Panel
                  id={this.props.id + '-' + i}
                  title={panelName}
                  initCollapsed={i === 0 ? false : true}
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
};

DownloadPanel.defaultProps = {
  downloads: [],
};

export {DownloadPanel};
