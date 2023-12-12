import React from 'react';
import PropTypes from 'prop-types';

const NoticeMessage = (props) => {
  let alert;
  // Display load alert if alert is present
  if (props.alertLoaded) {
    alert = (
      <div className='alert alert-success' role='alert'>
        <button type='button'
                className='close'
                aria-label='Close'
                onClick={props.dismissAlert}>
          <span aria-hidden='true'>&times;</span>
        </button>
        <strong>Success</strong> Query Loaded.
      </div>
    );
  }

  // Display save alert if alert is present
  if (props.alertSaved) {
    alert = (
      <div className='alert alert-success' role='alert'>
        <button type='button'
                className='close'
                aria-label='Close'
                onClick={props.dismissAlert}>
          <span aria-hidden='true'>&times;</span>
        </button>
        <strong>Success</strong> Query Saved.
      </div>
    );
  }

  // Display Conflict Query alert
  if (props.alertConflict.show) {
    alert = (
      <div className='alert alert-warning' role='alert'>
        <button type='button'
                className='close'
                aria-label='Close'
                onClick={props.dismissAlert}>
          <span aria-hidden='true'>&times;</span>
        </button>
        <button type='button'
                className='close'
                aria-label='Close'
                onClick={props.dismissAlert}>
          <span aria-hidden='true'>Override</span>
        </button>
        <strong>Error</strong> Query with the same name already exists.
        <a href='#'
           className='alert-link'
           onClick={props.overrideQuery}>Click here to override</a>
      </div>
    );
  }

  return (
    <>
      {alert}
    </>
  );
};
NoticeMessage.propTypes = {
  alertLoaded: PropTypes.bool,
  dismissAlert: PropTypes.func,
  alertSaved: PropTypes.bool,
  alertConflict: PropTypes.object,
  overrideQuery: PropTypes.func,
};

export default NoticeMessage;
