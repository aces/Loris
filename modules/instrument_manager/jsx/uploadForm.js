import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Media Upload Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to upload a media file attached to a specific instrument
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
class InstrumentUploadForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileSelected: false,
      loaded: 0,
    };

    this.fileSelected = this.fileSelected.bind(this);
    this.upload = this.upload.bind(this);
  }

  fileSelected() {
    return null;
  }

  upload() {
    return null;
  }

  render() {
    return (
      <h1>UploadForm</h1>
    );
  }
}

InstrumentUploadForm.propTypes = {
  action: PropTypes.string.isRequired,
};

export default InstrumentUploadForm;
