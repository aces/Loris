/* global ReactDOM */

import ImagingUploader from './imaging_uploader';

/**
 * Render imaging_uploader on page load
 */
$(function() {
  var dataURL = loris.BaseURL + "/imaging_uploader/?format=json";
  var imagingUploader = (
    <ImagingUploader
      Module="imaging_uploader"
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const imagingUploaderDOM = document.createElement('div');
  imagingUploaderDOM.id = 'page-imaging-uploader';

  // Append wrapper div to page content
  const rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(imagingUploaderDOM);

  ReactDOM.render(imagingUploader, document.getElementById("page-imaging-uploader"));
});
