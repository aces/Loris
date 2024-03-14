import PasswordExpired from './passwordExpiry';
import RequestAccount from './requestAccount';
import ResetPassword from './resetPassword';
import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import DOMPurify from 'dompurify';
import {
    FormElement,
    StaticElement,
    TextboxElement,
    PasswordElement,
    ButtonElement,
} from 'jsx/Form';

/**
 * Login form.
 *
 * @description form for login.
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
class Login extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
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
      mode: props.defaultmode || 'login',
      oidc: null,
      component: {
        requestAccount: null,
        expiredPassword: null,
      },
      isLoaded: false,
    };
    // Bind component instance to custom methods
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.setForm = this.setForm.bind(this);
    this.setMode = this.setMode.bind(this);
    this.getOIDCLinks = this.getOIDCLinks.bind(this);
  }

  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(window.location.origin + '/login/Authentication',
      {credentials: 'same-origin'}
    )
      .then((resp) => resp.json())
      .then((json) => {
        const state = JSON.parse(JSON.stringify(this.state));
        // login setup.
        state.study.description = json.login.description;
        state.study.title = json.login.title;
        state.study.logo = window.location.origin
          + '/' + json.login.logo;
        // request account setup.
        state.component.requestAccount = json.requestAccount;
        state.oidc = json.oidc;
        state.isLoaded = true;
        this.setState(state);
      }).catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setForm(formElement, value) {
    const state = JSON.parse(JSON.stringify(this.state));
    state.form.value[formElement] = value;
    this.setState(state);
  }

  /**
   * Handle form submission
   *
   * @param {object} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();

    const state = JSON.parse(JSON.stringify(this.state));
    fetch(
      window.location.origin + '/login/Authentication', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: 'true',
          command: 'login',
          username: state.form.value.username,
          password: state.form.value.password,
        }),
      })
      .then((response) => {
        if (response.ok) {
          response.json().then(() => {
            // Redirect if there is a "redirect" param, refresh the page otherwise
            window.location.href = this.props.redirect !== null
              ? this.props.redirect
              : window.location.origin;
          });
        } else {
          response.json().then((data) => {
            if (data.error) {
              const state = JSON.parse(JSON.stringify(this.state));
              if (data.error === 'password expired') {
                // password expired
                state.component.expiredPassword = {
                  message: 'Password expired for user.',
                  username: state.form.value.username,
                };
                state.mode = 'expired';
              } else {
                // incorrect password
                state.form.error.toggle = true;
                state.form.error.message = data.error;
              }
              this.setState(state);
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error! ' + error);
      });
  }

  /**
   * Set mode.
   *
   * @param {string} mode - set as mode.
   */
  setMode(mode) {
    const state = JSON.parse(JSON.stringify(this.state));
    state.mode = mode;
    this.setState(state);
  }

  /**
   * @return {DOMRect|void}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    if (this.state.mode === 'login') {
      const study = (
        <div dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(this.state.study.description),
        }}/>
      );
      const error = this.state.form.error.toggle ? (
        <StaticElement
          text={this.state.form.error.message}
          class={'col-xs-12 col-sm-12 col-md-12 text-danger'}
        />
      ) : null;
      const oidc = this.state.oidc ? this.getOIDCLinks() : '';
      const login = (
        <div>
          <section className={'study-logo'}>
            <img src={this.state.study.logo}
                 alt={this.state.study.title}/>
          </section>
          <FormElement
            name={'loginIndex'}
            action={''}
            fileUpload={false}
            onSubmit={this.handleSubmit}
          >
            <TextboxElement
              name={'username'}
              value={this.state.form.value.username}
              onUserInput={this.setForm}
              placeholder={'Username'}
              class={'col-sm-12'}
              autoComplete={'username'}
              required={true}
            />
            <PasswordElement
              name={'password'}
              value={this.state.form.value.password}
              onUserInput={this.setForm}
              placeholder={'Password'}
              class={'col-sm-12'}
              required={true}
              autoComplete={'current-password'}
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
          {oidc}
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
                bold={true}
              >
                {login}
              </Panel>
            </section>
            <section className={'col-md-8 col-md-pull-4'}>
              <Panel
                title={this.state.study.title}
                class={'panel-default login-panel'}
                collapsing={false}
                bold={true}
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
          defaultFirstName={this.props.defaultRequestFirstName}
          defaultLastName={this.props.defaultRequestLastName}
          defaultEmail={this.props.defaultRequestEmail}
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

  /**
   * Return the OpenID Connect links for this LORIS instance.
   *
   * @return {JSX}
   */
  getOIDCLinks() {
      if (!this.state.oidc) {
          return null;
      }
      return (<div className={'oidc-links'}>
        {this.state.oidc.map((val) => {
            return <div>
                <a href={'/oidc/login?loginWith=' + val}>
                    Login with {val}
                </a>
            </div>;
        })}
      </div>);
  }
}

Login.propTypes = {
  module: PropTypes.string,
  defaultmode: PropTypes.string,
  defaultRequestFirstName: PropTypes.string,
  defaultRequestLastName: PropTypes.string,
  defaultRequestEmail: PropTypes.string,
  redirect: PropTypes.string,
};

window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const getParam = (name, deflt) => {
    return params.has(name) ? params.get(name) : deflt;
  };

  createRoot(
    document.getElementsByClassName('main-content')[0]
  ).render(
    <Login
      defaultmode={getParam('page', null)}
      defaultRequestFirstName={getParam('firstname', '')}
      defaultRequestLastName={getParam('lastname', '')}
      defaultRequestEmail={getParam('email', '')}
      redirect={getParam('redirect', null)}
      module={'login'}
    />
  );
});
