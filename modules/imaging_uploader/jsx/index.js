/* global ReactDOM */

import ImagingUploader from './ImagingUploader';

/**
 * Render imaging_uploader on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  const imagingUploader = (
    <div className='page-imaging-uploader'>
      <ImagingUploader
        Module='imaging_uploader'
        DataURL={loris.BaseURL + '/imaging_uploader/?format=json'}
      />
    </div>
  );

  ReactDOM.render(imagingUploader, document.getElementById('lorisworkspace'));
});
