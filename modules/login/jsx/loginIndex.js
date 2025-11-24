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
import SummaryStatistics from './summaryStatistics';
import {PolicyButton} from 'jsx/PolicyButton';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import jaStrings from '../locale/ja/LC_MESSAGES/login.json';

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
        partner_logos: [],
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
      summaryStatistics: null,
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
    this.fetchData();
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
        state.study.partner_logos = json?.login?.partner_logos
          ? [...json?.login?.partner_logos] : [];
        // request account setup.
        state.component.requestAccount = json.requestAccount;
        state.oidc = json.oidc;
        this.setState(state);
      }).then(() => {
        fetch(window.location.origin + '/login/summary_statistics', {
          method: 'GET',
        })
          .then((resp) => resp.json())
          .then((json) => {
            this.setState({
              summaryStatistics: json,
              isLoaded: true,
            });
          });
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
      const policy = this.state.component.requestAccount.policy;
      const policyButton = policy ?
        <PolicyButton
          onClickPolicy={
            this.state.component.requestAccount.policy
          }
          style={{marginTop: '10px'}}
          anon={true}
        />
        : null;
      const oidc = this.state.oidc ? this.getOIDCLinks() : '';
      const partnerLogos = this.state.study.partner_logos.map((logo) => (
        <>
          <img
            src={logo}
            alt={`${(logo ?? '').split('/').pop().split('.')[0]} Logo`}
          />
        </>
      ));
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
              placeholder={this.props.t('Username', {ns: 'loris'})}
              class={'col-sm-12'}
              autoComplete={'username'}
              required={true}
            />
            <PasswordElement
              name={'password'}
              value={this.state.form.value.password}
              onUserInput={this.setForm}
              placeholder={this.props.t('Password', {ns: 'loris'})}
              class={'col-sm-12'}
              required={true}
              autoComplete={'current-password'}
            />
            {error}
            <ButtonElement
              label={this.props.t('Login', {ns: 'login'})}
              type={'submit'}
              name={'login'}
              id={'login'}
              columnSize={'col-sm-12'}
              buttonClass={'btn btn-primary btn-block'}
            />
          </FormElement>
          <div className={'help-links'}>
            <a onClick={() => this.setMode('reset')}
              style={{cursor: 'pointer'}}>{this.props.t(
                'Forgot your password?',
                {ns: 'login'}
              )}</a>
            <br/>
            <a onClick={() => this.setMode('request')}
              style={{cursor: 'pointer'}}>{this.props.t(
                'Request Account',
                {ns: 'login'}
              )}</a>
            <br />
            {policyButton}
          </div>
          {oidc}
        </div>
      );
      return (
        <div className={'container'}>
          <div className={'row'}>
            <section className={'col-md-4 col-md-push-8'}>
              <Panel
                title={this.props.t('Login to LORIS', {ns: 'login'})}
                class={'panel-default login-panel'}
                collapsing={false}
                bold={true}
              >
                {login}
              </Panel>
              {partnerLogos.length > 0 ? (
                <Panel
                  title="Our Partners"
                  class="panel-default partner-container-desktop"
                  collapsing={false}
                  bold
                >
                  {partnerLogos}
                </Panel>
              ) : <></>}
            </section>
            <section className={'col-md-8 col-md-pull-4'}>
              <Panel
                title={this.state.study.title}
                class={'panel-default login-panel'}
                collapsing={false}
                bold={true}
              >
                <div
                  className='study-description'
                >
                  {
                    this.state.summaryStatistics
                    && <SummaryStatistics data={this.state.summaryStatistics}/>
                  }
                  {study}
                </div>
              </Panel>
              {partnerLogos.length > 0 ? (
                <Panel
                  title="Our Partners"
                  class="panel-default partner-container-mobile"
                  collapsing={false}
                  bold
                >
                  {partnerLogos}
                </Panel>
              ) : <></>}
            </section>
            <section>
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
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const getParam = (name, deflt) => {
    return params.has(name) ? params.get(name) : deflt;
  };
  i18n.addResourceBundle('ja', 'login', jaStrings);
  const TLogin = withTranslation(['login', 'loris'])(Login);

  createRoot(
    document.getElementsByClassName('main-content')[0]
  ).render(
    <TLogin
      defaultmode={getParam('page', null)}
      defaultRequestFirstName={getParam('firstname', '')}
      defaultRequestLastName={getParam('lastname', '')}
      defaultRequestEmail={getParam('email', '')}
      redirect={getParam('redirect', null)}
      module={'login'}
    />
  );
});
