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
      study: {
        logo: '',
        title: '',
        links: [],
        description: '',
      },
      form: {
        value: {
          username: '',
          password: '',
        },
        error: '',
      },
      isLoaded: false,
    };
    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
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
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: send,
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          console.log('success');
          console.log(data);
          const state = Object.assign({}, this.state);
          state.study.description = data.study_description;
          state.study.title = data.study_title;
          this.state.study.logo = data.study_logo;
          state.isLoaded = true;
          this.setState(state);
        }).catch((error) => {
          console.log('error: ');
          console.log(error);
    });
  }
  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setForm(formElement, value) {
    const state = Object.assign({}, this.state);
    state.form.value[formElement] = value;
    this.setState(state);
  }
  /**
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    const state = Object.assign({}, this.state);
    const send = this.urlSearchParams({
      command: 'login',
      username: state.form.username,
      password: state.form.password,
    });
    const url = window.location.origin + '/login/AjaxLogin';
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
    ).then((response) => response.json())
      .then(
        (data) => {
          if (data.status === 'error') {
            // Populate the form errors.
            if (data.errors) {
              console.log('errors');
            }
          } else {
            console.log('success');
            // this.setState({success: true});
          }
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
    const study = (
      <div dangerouslySetInnerHTML={{__html: this.state.study.description}}/>
    );
    const login = (
      <div>
        <section className={'study-logo'}>
          <img src={this.state.study.logo} alt={this.state.study.title}/>
        </section>
        <FormElement
          name={'login'}
          fileUpload={'false'}
          onSubmit={this.handleSubmit}
        >
          <TextboxElement
            name={'username'}
            value={this.state.form.value.username}
            onUserInput={this.setForm}
            placeholder={'Username'}
            class={'col-sm-12'}
            required={true}
          />
          <TextboxElement
            name={'password'}
            value={this.state.form.value.password}
            onUserInput={this.setForm}
            placeholder={'Password'}
            class={'col-sm-12'}
            required={true}
          />
          <ButtonElement
            label={'Login'}
            type={'submit'}
            columnSize={'col-sm-12'}
            buttonClass={'btn btn-primary btn-block'}
          />
        </FormElement>
        <div className={'help-links'}>
          <a href={'/login/password-reset/'}>Forgot your password?</a>
          <br/>
          <a href={'/login/request-account/'}>Request Account</a>
        </div>
        <div className={'help-text'}>
          A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)
        </div>
      </div>
    );
    return (
      <div className={'container'}>
        <div className={'row'}>
          <section className={'col-md-4 col-md-push-8'}>
            <Panel
              title={'Login to LORIS'}
              class={'panel-login login-panel'}
              collapsing={false}
            >
              {login}
            </Panel>
          </section>
          <section className={'col-md-8 col-md-pull-4'}>
            <Panel
              title={this.state.study.title}
              class={'panel-login login-panel'}
              collapsing={false}
            >
              {study}
            </Panel>
          </section>
        </div>
      </div>
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
