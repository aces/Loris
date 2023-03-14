import ImagingUploader from './ImagingUploader';
import {createRoot} from 'react-dom/client';
import React from 'react';

/**
 * Render imaging_uploader on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  const root = createRoot(document.getElementById('lorisworkspace'));
  root.render(
    <div className='page-imaging-uploader'>
      <ImagingUploader
        Module='imaging_uploader'
        DataURL={loris.BaseURL + '/imaging_uploader/?format=json'}
      />
    </div>
  );
});
