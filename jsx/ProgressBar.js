/* exported ProgressBar */

/**
 * React ProgressBar.
 *
 * Updates UI automatically when passed a progress value between 0 and 100.
 *
 * Note: To hide progress bar before/after upload, set value to -1.
 *
 */
class ProgressBar extends React.Component {
  render() {
    let style = {
      display: (this.props.value < 0 ? 'none' : 'block')
    };

    return (
      <div id="file-progress" style={style}>
        <div className="progress">
          <div
            id="progressbar"
            className="progress-bar progress-bar-striped active"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={this.props.value}
            style={{width: (this.props.value + '%')}}
          >
          </div>
          <div id="progresslabel">{this.props.value}%</div>
        </div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  value: React.PropTypes.number
};
ProgressBar.defaultProps = {
  value: 0
};
