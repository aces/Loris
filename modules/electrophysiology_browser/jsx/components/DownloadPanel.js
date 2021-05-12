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
        <div style={{
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '250px',
          margin: '0 auto',
        }}>
          {this.state.downloads
            .filter((download) =>
              download.type != 'physiological_fdt_file'
            )
            .map((download, i) => {
              const disabled = (download.file === '');
              return (
                <div
                  key={i}
                  className={'form-group'}
                >
                  <div
                    className='col-lg-offset-1 col-xs-5'
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
                        className='btn disabled col-xs-5'
                        style={{
                          color: '#b3b3b3',
                          cursor: 'not-allowed',
                          border: '1px solid #b3b3b3',
                          margin: 0,
                        }}
                      >Not Available</a>
                    : <a
                        className='btn btn-primary download col-xs-5'
                        href={'/mri/jiv/get_file.php?file=' + download.file}
                        target='_blank'
                        download={this.state.downloads[0].file}
                        style={{
                          margin: 0,
                        }}
                      >Download</a>
                  }
                </div>
              );
            })
          }
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
