import PasswordExpired from './passwordExpiry';
import RequestAccount from './requestAccount';
import ResetPassword from './resetPassword';
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
        error: {
          toggle: false,
          message: '',
        },
      },
      mode: 'login',
      component: {
        requestAccount: null,
        expiredPassword: null,
      },
      isLoaded: false,
    };
    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
    this.setMode = this.setMode.bind(this);
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
          const state = Object.assign({}, this.state);
          // login setup.
          state.study.description = data.login.description;
          state.study.title = data.login.title;
          state.study.logo = window.location.origin
            + '/' + data.login.logo;
          // request account setup.
          data.requestAccount.site[''] = 'Choose your site:';
          state.component.requestAccount = data.requestAccount;
          state.isLoaded = true;
          this.setState(state);
        }).catch((error) => {
      // error shouldn't happen.
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
    const url = window.location.origin + '/login/AjaxLogin';
    const send = this.urlSearchParams({
      login: true,
      command: 'login',
      username: state.form.value.username,
      password: state.form.value.password,
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
          if (data.expired) {
            // expired - password expired.
            const state = Object.assign({}, this.state);
            state.component.expiredPassword = {
              message: data.error,
              username: state.form.value.username,
            };
            state.mode = 'expired';
            this.setState(state);
          }
          if (data.error) {
            // error - incorrect password.
            const state = Object.assign({}, this.state);
            state.form.error.toggle = true;
            state.form.error.message = data.error;
            this.setState(state);
          } else {
            // success - refresh page and user is logged in.
            window.location.href = window.location.origin;
          }
        }).catch((error) => {
      // error shouldn't happen.
    });
  }

  /**
   * Set mode.
   *
   * @param {string} mode - set as mode.
   */
  setMode(mode) {
    const state = Object.assign({}, this.state);
    state.mode = mode;
    this.setState(state);
  }
  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    // const state = Object.assign({}, this.state);
    const send = this.urlSearchParams({
      command: 'login',
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
    if (this.state.mode === 'login') {
      const study = (
        <div dangerouslySetInnerHTML={{__html: this.state.study.description}}/>
      );
      const error = this.state.form.error.toggle ? (
        <StaticElement
          text={this.state.form.error.message}
          class={'col-xs-12 col-sm-12 col-md-12 text-danger'}
        />
      ) : null;
      const login = (
        <div>
          <section className={'study-logo'}>
            <img src={this.state.study.logo}
                 alt={this.state.study.title}/>
          </section>
          <FormElement
            action={''}
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
              type={'password'}
            />
            {error}
            <ButtonElement
              label={'Login'}
              type={'submit'}
              name={'login'}
              id={'login'}
              columnSize={'col-sm-12'}
              buttonClass={'btn btn-primary btn-block'}
            />
          </FormElement>
          <div className={'help-links'}>
            <a onClick={() => this.setMode('reset')}
               style={{cursor: 'pointer'}}>Forgot your password?</a>
            <br/>
            <a onClick={() => this.setMode('request')}
               style={{cursor: 'pointer'}}>Request Account</a>
          </div>
          <div className={'help-text'}>
            A WebGL-compatible browser is required for full functionality
            (Mozilla Firefox, Google Chrome)
          </div>
        </div>
      );
      return (
        <div className={'container'}>
          <div className={'row'}>
            <section className={'col-md-4 col-md-push-8'}>
              <Panel
                title={'Login to LORIS'}
                class={'panel-default login-panel'}
                collapsing={false}
              >
                {login}
              </Panel>
            </section>
            <section className={'col-md-8 col-md-pull-4'}>
              <Panel
                title={this.state.study.title}
                class={'panel-default login-panel'}
                collapsing={false}
              >
                {study}
              </Panel>
            </section>
          </div>
        </div>
      );
    }
    if (this.state.mode === 'reset') {
      return (
        <ResetPassword
          module={'reset'}
          setMode={this.setMode}
        />
      );
    }
    if (this.state.mode === 'request') {
      return (
        <RequestAccount
          module={'reset'}
          setMode={this.setMode}
          data={this.state.component.requestAccount}
        />
      );
    }
    if (this.state.mode === 'expired') {
      return (
        <PasswordExpired
          module={'expired'}
          setMode={this.setMode}
          data={this.state.component.expiredPassword}
        />
      );
    }
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
