/* exported ImagingUploader */
/* global formatColumn */

const propTypes = {};
const defaultProps = {};

class ImagingUploader extends React.Component {
  render() {
    return (
      <div id="mri_upload_table">
        <DynamicDataTable
          DataURL={this.props.DataURL}
          getFormattedCell={formatColumn}
        />
      </div>
    );
  }
}

ImagingUploader.propTypes = propTypes;
ImagingUploader.defaultProps = defaultProps;
