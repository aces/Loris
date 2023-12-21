/**
 * This file contains React component for EConsent entry
 *
 * @author Camille Beaudoin
 *
 */
import React from 'react';
import BasicPage from './e_consent/basicConsentForm';
import TrainingPage from './e_consent/trainingConsentForm';
import Loader from 'Loader';
import swal from 'sweetalert2';

/**
 * Consent Entry
 *
 * Mdule component of eConsent entry
 *
 * @author Camille Beaudoin
 */
class ConsentEntry extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    // set up state values
    let url = window.location;
    if (!window.location.origin) {
    url.origin = url.protocol
      + '//' + url.hostname
      + (url.port ? ':' + url.port: '');
    }

    this.state = {
      consentData: {},
      requestStatus: '',
      isLoaded: false,
      not_found: false,
      data_url: url.origin + '/consent/direct_consent' + url.search,
    };

    this.fetchData = this.fetchData.bind(this);
    this.submit = this.submit.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
    this.setState({
      isLoaded: true,
    });
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.state.data_url, {
      credentials: 'same-origin',
    })
      .then((resp) => resp.json())
      .then((data) => this.setState({
          consentData: data.consentData,
          requestStatus: data.requestStatus,
          not_found: data.not_found,
        }))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Submit consent to update database
   *
   * @param {array} consentAnswers - Consent answer per consent code
   * @param {object} customSwal - Customized swal object for success
   * @return {object} promise
   */
  submit(consentAnswers, customSwal = null) {
    // Add each consent answer to form object
    let formObj = new FormData();
    for (let property in consentAnswers) {
      if (consentAnswers.hasOwnProperty(property)) {
        formObj.append(property, consentAnswers[property]);
      }
    }

    // Post data
    let actionUrl = this.state.data_url + '&action=submit';
    return fetch(actionUrl, {
      method: 'POST',
      body: formObj,
      cache: 'no-cache',
    })
    .then((response) => {
      if (response.ok) {
        // Give success message in swal
        // Customizeable for specific swal message / buttons
        if (customSwal === null) {
          swal.fire(
            'Success!',
            'Thank you for completing this section of the eConsent form',
            'success'
          );
        } else {
          customSwal();
        }
        this.fetchData();
        this.render();
        return Promise.resolve();
      } else {
        // If errors, give error message
        let msg = response.statusText ?
        response.statusText : 'Submission Error!';
        swal.fire(msg, '', 'error');
        console.error(msg);
        return Promise.reject();
      }
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Render basic eConsent page or eConsent training page,
    // not found page, or loading page
    if (this.state.not_found) {
      return (
        <div>
          <h3>Sorry, we could not find the form you are looking for</h3>
        </div>
      );
    } else if (
      Object.keys(this.state.consentData).length === 0 ||
      !this.state.isLoaded
    ) {
      return <Loader />;
    } else if (this.state.consentData.training) {
      return (
        <TrainingPage
          consentData={this.state.consentData}
          submit={this.submit}
          data_url={this.state.data_url}
        />
      );
    } else {
      return (
        <BasicPage
          consentData={this.state.consentData}
          requestStatus={this.state.requestStatus}
          submit={this.submit}
          data_url={this.state.data_url}
        />
      );
    }
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <div id="lorisworkspace" style={{margin: 'auto'}}>
      <ConsentEntry/>
    </div>,
    document.getElementById('lorisworkspace')
  );
});
