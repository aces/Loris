/**
 * React ProgressBar.
 *
 * Updates UI automatically when passed a progress value between 0 and 100.
 * To hide progress bar before/after upload, set value to -1.
 *
 * Note: This component relies on Bootstrap 3 progress-bar classes
 * (http://getbootstrap.com/components/#progress)
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  render() {
    const progressStyle = {
      display: (this.props.value < 0 ? 'none' : 'block'),
      backgroundColor: '#d3d3d3',
      height: '30px',
      position: 'relative',
    };

    const labelStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1000,
      width: '100%',
      color: '#fff',
      textAlign: 'center',
      lineHeight: '30px',
      fontWeight: '600',
    };

    return (
      <div className="progress" style={progressStyle}>
        <div
          className="progress-bar progress-bar-striped active"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={this.props.value}
          style={{width: (this.props.value + '%')}}
        >
        </div>
        <span style={labelStyle}>{this.props.value}%</span>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  value: PropTypes.number,
};
ProgressBar.defaultProps = {
  value: 0,
};

export default ProgressBar;
