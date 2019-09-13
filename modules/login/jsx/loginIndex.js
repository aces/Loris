import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';

/**
 * Login form.
 *
 * @description form for login.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      isLoaded: false,
    };
    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
  }
  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    this.fetchInitializerData();
  }
  /**
   * Used with sending POST data to the server.
   * @param {object} json - json object converted for POST.
   * @return {string} send in POST to server.
   */
  urlSearchParams(json) {
    return Object.keys(json).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
    }).join('&');
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchInitializerData() {
    const url = window.location.origin + '/login/AjaxLogin';
    const send = this.urlSearchParams({
      command: 'initialize',
    });
    fetch(
      url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: send,
      }
    ).then((response) => {
      console.log(JSON.stringify(response));
      response.json();
    })
      .then(
        (data) => {
          console.log('success');
          this.setState({isLoaded: true});
        }).catch((error) => {
          console.log('error: ');
          console.log(error);
    });
  }
  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    return (
      <Panel
        title={'Login to LORIS'}
        class={'panel-login login-panel'}
        collapsing={false}
      >
        <div>test</div>
      </Panel>
    );
  }
}
Login.propTypes = {
  module: PropTypes.string,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <Login
      module={'login'}
    />,
    document.getElementsByClassName('main-content')[0]
  );
});
