import ImagingUploader from './ImagingUploader';
import {createRoot} from 'react-dom/client';
import React from 'react';
import i18n from 'I18nSetup';

import hiStrings from '../locale/hi/LC_MESSAGES/imaging_uploader.json';

/**
 * Render imaging_uploader on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  i18n.addResourceBundle('hi', 'imaging_uploader', hiStrings);

  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <div className='page-imaging-uploader'>
      <ImagingUploader
        Module='imaging_uploader'
        DataURL={loris.BaseURL + '/imaging_uploader/?format=json'}
      />
    </div>
  );
});
