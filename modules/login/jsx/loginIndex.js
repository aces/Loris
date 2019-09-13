import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from 'Panel';
import ResetPassword from './resetPassword';
import RequestAccount from './requestAccount';

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
<<<<<<< HEAD
=======
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
      mode: 'login',
>>>>>>> update
      isLoaded: false,
    };
    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
<<<<<<< HEAD
=======
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setForm = this.setForm.bind(this);
    this.setMode = this.setMode.bind(this);
>>>>>>> update
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
<<<<<<< HEAD
          this.setState({isLoaded: true});
=======
          console.log(data);
          const state = Object.assign({}, this.state);
          state.study.description = data.study_description;
          state.study.title = data.study_title;
          this.state.study.logo = window.location.origin
            + '/' + data.study_logo;
          state.isLoaded = true;
          this.setState(state);
>>>>>>> update
        }).catch((error) => {
          console.log('error: ');
          console.log(error);
    });
  }
  /**
<<<<<<< HEAD
=======
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
    let form = document.getElementById('form');
    let inputLogin = document.createElement('input');
    inputLogin.setAttribute('name', 'login');
    inputLogin.setAttribute('value', 'true');
    inputLogin.setAttribute('type', 'hidden');
    form.append(inputLogin);
    form.submit();
  }
  /**
   * Set mode.
   *
   * @param {string} mode - set as mode.
   */
  setMode(mode) {
    console.log(mode);
    const state = Object.assign({}, this.state);
    state.mode = mode;
    this.setState(state);
  }
  /**
>>>>>>> update
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
<<<<<<< HEAD
    return (
      <Panel
        title={'Login to LORIS'}
        class={'panel-login login-panel'}
        collapsing={false}
      >
        <div>test</div>
      </Panel>
    );
=======
    if (this.state.mode === 'login') {
      const study = (
        <div dangerouslySetInnerHTML={{__html: this.state.study.description}}/>
      );
      const login = (
        <div>
          <section className={'study-logo'}>
            <img src={this.state.study.logo}
                 alt={this.state.study.title}/>
          </section>
          <FormElement
            name={'login'}
            action={''}
            id={'form'}
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
            <ButtonElement
              label={'Login'}
              type={'submit'}
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
        />
      );
    }
>>>>>>> update
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
