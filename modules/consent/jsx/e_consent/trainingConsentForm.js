/**
 * This file contains React form components for Training Consent page
 *
 * @author Camille Beaudoin
 *
 */
import Page from './directConsentForm';
import swal from 'sweetalert2';
import Loader from 'Loader';

/**
 * Basic Page
 *
 * Component for complex training version of eConsent form
 *
 * @author Camille Beaudoin
 */
class TrainingPage extends React.Component {
  /**
    * @constructor
    * @param {object} props - React Component properties
    */
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'index',
      isLoaded: false,
      pageVals: [],
      answers: [],
      consentPageAnswers: [],
      errors: [],
      trainingProgress: [],
      consentVals: [],
    };

    this.acknowledgementNeeded = this.acknowledgementNeeded.bind(this);
    this.sectionHasConsent = this.sectionHasConsent.bind(this);
    this.pageHasConsent = this.pageHasConsent.bind(this);
    this.nextPageAccessible = this.nextPageAccessible.bind(this);
    this.trainingComplete = this.trainingComplete.bind(this);
    this.sectionDone = this.sectionDone.bind(this);
    this.pageDone = this.pageDone.bind(this);
    this.pageQuestions = this.pageQuestions.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getValues = this.getValues.bind(this);
    this.setDisabled = this.setDisabled.bind(this);
    this.updatePageAnswer = this.updatePageAnswer.bind(this);
    this.updateConsentAnswer = this.updateConsentAnswer.bind(this);
    this.determineButtons = this.determineButtons.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPrevPage = this.getPrevPage.bind(this);
    this.submitConsent = this.submitConsent.bind(this);
    this.submitPageAnswer = this.submitPageAnswer.bind(this);
  }

  /**
    * Called by React when the component has been rendered on the page.
    */
  componentDidMount() {
    // set state values
    let consentVals = {};
    let consents = this.props.consentData.consents;
    for (let property in consents) {
      if (consents.hasOwnProperty(property)) {
        consentVals[property] = consents[property].Status;
      }
    }
    this.setState({
      isLoaded: true,
      pageVals: JSON.parse(this.props.consentData.training),
      trainingProgress: JSON.parse(this.props.consentData.trainingProgress)
        ?? [],
      consentVals: consentVals,
    });
  }

  /**
    * Renders the React component.
    *
    * @return {JSX} - React markup for the component
    */
  render() {
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    if (this.state.currentPage === 'index') {
      // If in the index page, set up the eConsent training doors
      let pageVals = this.state.pageVals;
      let setup = pageVals.schema.setup;
      let sections = [];

      // Loop through each section from setup to render clickable door
      for (let i = 0; i<setup.length; i++) {
        const section = setup[i];
        let m = 'Please complete eConsent training before accessing this page';
        if (this.sectionHasConsent(i) && !this.trainingComplete()) {
          // Consent section disabled if training is not complete
          sections.push(
            <div key={section.name}
                 className={'flex-row-item disabled'}
                 onClick={() => swal.fire(
                    'Unavailable',
                    m,
                    'error'
                  )}
            >
              <span id="door-text">{section.description.EN}</span>
              <div id="Media">
                <img src={section.image} id='door-icon'/>
              </div>
            </div>
          );
        } else {
          // Non-disabled doors have link to first page in the section
          sections.push(
            <div key={section.name}
                 className={'flex-row-item'}
                 onClick={() => this.changePage(section.order[0])}
                 disabled={true}
            >
              <span id="door-text">{section.description.EN}</span>
              <div id="Media">
                <img src={section.image} id='door-icon'/>
              </div>
              {this.sectionDone(i) ? <p className={'checkmark'}>&#x2714;️</p>
                : null}
            </div>
          );
        }
      }

      // Add title, description, training boxes
      return (
        <div>
          <div className={'container'}>
            <div
                id='title'
                className='question-container'
            >
               <h3>{this.props.consentData.Title}</h3>
            </div>
            <div
                id='description'
                className='question-container'
            >
                <h4>{this.props.consentData.Description}</h4>
            </div>
          </div>
          <div className={'container'}>
            <div className={'flex-row-container'}
                 style={{padding: '20px 0 0 0'}}>
              {sections}
            </div>
          </div>
        </div>
      );
    } else {
      // If page selected, render page
      let page = this.state.currentPage;
      let prevAnswered = this.getValues();
      let values = {...prevAnswered, ...this.state.answers};
      let consentValues = {...this.state.consentVals,
        ...this.state.consentPageAnswers};

      // Disable questions as needed
      this.setDisabled();

      // render page elements
      let elements = (
        <Page
          elements={this.state.pageVals}
          values={values}
          consentAnswers={consentValues}
          updateAnswer={this.updatePageAnswer}
          updateConsentAnswer={this.updateConsentAnswer}
          errors={this.state.errors}
          page={page}
        />
      );
      // set buttons needed for page
      let buttons = this.determineButtons();
      return (
        <div>
          <div id="consent">
            <div className={'container'}>
            {elements}
            </div>
            {buttons}
          </div>
        </div>
      );
    }
  }

  /**
   * Determines whether non-consent questions in the
   * consent section need to be answered before consent
   *
   * @return {boolean}
   */
  acknowledgementNeeded() {
    let acknowledgementComplete = true;
    let acknowledgementRequired = false;
    let setup = this.state.pageVals.schema.setup;

    // go through doors
    for (let i = 0; i < setup.length; i++) {
      // check consent sections
      if (this.sectionHasConsent(i)) {
        let doors = this.state.pageVals.schema.setup;
        let pages = doors[i].order;
        for (let j = 0; j<pages.length; j++) {
          if (
            this.pageQuestions(pages[j]).length > 0 &&
            !this.pageHasConsent(pages[j])
          ) {
            // if there are non-consent questions, acknowledgement is required
            acknowledgementRequired = true;
            if (!this.state.trainingProgress.includes(pages[j])) {
              // if non-consent questions not answered,
              // acknowledgement is not complete
              acknowledgementComplete = false;
            }
          }
        }
      }
    }
    // Acknowledgement needed if required & incomplete
    return acknowledgementRequired && !acknowledgementComplete;
  }

  /**
   * Determines whether given section has consent questions
   *
   * @param {int} sectionIndex
   * @return {boolean}
   */
  sectionHasConsent(sectionIndex) {
    let pages = this.state.pageVals.schema.setup[sectionIndex].order;
    let hasConsent = false;

    // If any pages from the section have consent, return true
    for (let i = 0; i<pages.length; i++) {
      if (this.pageHasConsent(pages[i])) {
        hasConsent = true;
      }
    }
    return hasConsent;
  }

  /**
   * Determines whether given page has consent questions
   *
   * @param {string} page
   * @return {boolean}
   */
  pageHasConsent(page) {
    let elements = this.state.pageVals.schema.elements;
    let pageElements = elements[page].options.order;
    for (let i = 0; i<pageElements.length; i++) {
      if (elements[pageElements[i]].type == 'enum') {
        return elements[pageElements[i]].options.isSavable;
      }
    }
    return false;
  }

  /**
   * Determines whether participant can navigate to the next page
   *
   * @return {boolean}
   */
  nextPageAccessible() {
    let page = this.state.currentPage;
    let nextPage = this.getNextPage();
    // Return false if last page of section
    if (!nextPage) {
      return false;
    }
    let consentSection = false;
    let setup = this.state.pageVals.schema.setup;
    for (let i = 0; i<setup.length; i++) {
      let order = setup[i].order;
      if (order.includes(page)) {
        consentSection = this.sectionHasConsent(i);
      }
    }

    // If consent section, make sure acknowledgement is complete
    // if the next page is a consent page
    return !consentSection ||
      !this.pageHasConsent(nextPage) ||
      (this.pageHasConsent(nextPage) && !this.acknowledgementNeeded());
  }

  /**
   * Determines every non-consent section has been completed
   *
   * @return {boolean}
   */
  trainingComplete() {
    let setup = this.state.pageVals.schema.setup;
    // go through doors
    for (let i = 0; i<setup.length; i++) {
      // check whether section has been completed
      if (!this.sectionDone(i) && !this.sectionHasConsent(i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines whether a section has all pages complete
   *
   * @param {int} sectionIndex
   * @return {boolean}
   */
  sectionDone(sectionIndex) {
    if (this.state.trainingProgress == [] || !this.state.isLoaded) {
      return false;
    }
    let done = true;
    let doors = this.state.pageVals.schema.setup;
    let pages = doors[sectionIndex].order;
    // if a a page has questions and is not complete, return false
    for (let j = 0; j<pages.length; j++) {
      if (this.pageQuestions(pages[j]).length > 0) {
        if (!this.pageDone(pages[j])) {
          return false;
        }
      }
    }
    return done;
  }

  /**
   * Determine if page has questions / if the questions have been answered
   *
   * @param {string} page
   * @return {boolean}
   */
  pageDone(page) {
    if (this.pageHasConsent(page)) {
      // if consent page, page done all page questions are answered
      let questions = this.pageQuestions(page);
      for (let i=0; i < questions.length; i++) {
        if (this.state.consentVals[questions[i]] == null) {
          return false;
        }
      }
      return true;
    } else {
      // if not consent page, done if set in trainingProgress
      return (this.state.trainingProgress.includes(page));
    }
  }

  /**
   * Get array of questions for a page
   *
   * @param {string} page
   * @return {array} questions
   */
  pageQuestions(page) {
    let elements = this.state.pageVals.schema.elements;
    let pageElements = elements[page].options.order;
    let questions = [];
    for (let i = 0; i<pageElements.length; i++) {
      if (
        elements[pageElements[i]].type == 'enum' ||
        elements[pageElements[i]].type == 'boolean'
      ) {
        questions.push(pageElements[i]);
      }
    }
    return questions;
  }

  /**
   * Update state to given page
   *
   * @param {string} p - page to change to
   */
  changePage(p) {
    this.setState({
      currentPage: p,
      answers: [],
      consentPageAnswers: [],
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Get object of questions and values that have been answered
   *
   * @return {object} values
   */
  getValues() {
    let values = {};
    let sections = this.state.pageVals.schema.setup;
    let elements = this.state.pageVals.schema.elements;
    // Go through each section & pages
    for (let i = 0; i < sections.length; i++) {
      let pages = sections[i].order;
      for (let j = 0; j < pages.length; j++) {
        // if the page is done, return questions & their values
        if (this.pageDone(pages[j])) {
          let questions = this.pageQuestions(pages[j]);
          for (let h = 0; h < questions.length; h++) {
            values[questions[h]] =
              elements[questions[h]].options.correctResponse;
          }
        }
      }
    }
    return values;
  }

  /**
   * Set disabled questions if needed
   */
  setDisabled() {
    let trainingProgress = this.state.trainingProgress;
    let elements = this.state.pageVals.schema.elements;
    // disable questions from answered pages
    for (let i = 0; i < trainingProgress.length; i++) {
      let pageQuestions = this.pageQuestions(trainingProgress[i]);
      for (let j = 0; j < pageQuestions.length; j++) {
        elements[pageQuestions[j]].options.disabled = true;
      }
    }
    // disable consent questions if answered
    // or if acknowledgement is needed
    let consentVals = this.state.consentVals;
    for (let property in consentVals) {
      if (consentVals.hasOwnProperty(property)) {
        if (
          consentVals[property] != null ||
          (this.acknowledgementNeeded())
        ) {
          elements[property].options.disabled = true;
        } else {
          elements[property].options.disabled = false;
        }
      }
    }
  }

  /**
   * Update page answer in state
   *
   * @param {string} fieldName
   * @param {string} value
   */
  updatePageAnswer(fieldName, value) {
    let answers = this.state.answers;
    answers[fieldName] = value;
    this.setState({
      answers: answers,
    });
  }

  /**
   * Update consent answer in state
   *
   * @param {string} consent (name of consent code)
   * @param {string} value (participants answer to consent)
   */
  updateConsentAnswer(consent, value) {
    let answers = this.state.consentPageAnswers;
    answers[consent] = value;
    this.setState({
      consentPageAnswers: answers,
    });
  }

  /**
    * Get buttons needed on page
    *
    * @return {object}
    */
  determineButtons() {
    let buttons = [];
    let submitButton = [];
    let page = this.state.currentPage;
    let hasConsent = this.pageHasConsent(this.state.currentPage);
    let hasQuestion = this.pageQuestions(this.state.currentPage).length > 0;
    let complete = this.pageDone(page);
    let className = 'btn btn-primary btn-lg submit-button';

    // No buttons needed in index page
    if (page !== 'index') {
      // All pages need "return to main page"
      buttons.push(
        <div>
          <button
            type="submit"
            className={className}
            onClick={() => this.changePage('index')}
            disabled={false}
          >
            Return to Main Page
          </button>
        </div>
      );

      // add "Previous" page if not first page
      if (this.getPrevPage()) {
        buttons.push(
          <div>
            <button
              type="submit"
              className={className}
              onClick={() => this.changePage(this.getPrevPage())}
              disabled={false}
            >
              Previous
            </button>
          </div>
        );
      }

      let page = this.state.currentPage;
      // Next page not enabled if they have not answered
      // the current page questions
      let disableNextPage = false;
      let questions = this.pageQuestions(page);
      if (questions.length > 0 && !this.pageDone(page)) {
        disableNextPage = true;
      }
      // Add "Next" page if next page accessible
      if (this.nextPageAccessible(page)) {
        buttons.push(
          <div>
            <button
              type="submit"
              className={className}
              onClick={() => this.changePage(this.getNextPage())}
              disabled={disableNextPage}
              title='Please complete question(s) to go to next page'
            >
              Next
            </button>
          </div>
        );
      }

      // Add "submit consent" if consent page and unanswered
      if (hasConsent && !complete) {
        submitButton = (
          <div>
            <button
              type="submit"
              className={className}
              onClick={this.submitConsent}
              disabled={false}
            >
              Submit consent
            </button>
          </div>
        );
      } else if (hasQuestion && !hasConsent && !complete) {
        // Add "submit " if not page has questions, not consent page & unanswered
        submitButton = (
          <div>
            <button
              type="submit"
              className={className}
              onClick={this.submitPageAnswer}
              disabled={false}
            >
              Submit
            </button>
          </div>
        );
      }
    }

    return (
      <div>
        <div className={'container'}>
          <div className={'flex-row-container'}
            style={{padding: '20px 0 0 0'}}>
            {submitButton}
          </div>
        </div>
        <br/><br/>
        <div className={'container'}>
          <div className={'flex-row-container'}
            style={{padding: '20px 0 0 0'}}>
            {buttons}
          </div>
        </div>
      </div>
    );
  }

  /**
    * Get next page if available
    *
    * @return {string}
    */
  getNextPage() {
    let setup = this.state.pageVals.schema.setup;
    let page = this.state.currentPage;
    let nextPageIndex;
    let setupIndex;

    // If last page in section, return null
    for (let i = 0; i<setup.length; i++) {
      for (let j = 0; j<setup[i].order.length; j++) {
        if (setup[i].order[j] == page) {
          // if last page in section, return null
          // Otherwise, go to next page
          if (j === setup[i].order.length - 1) {
            return null;
          } else {
            setupIndex = i;
            nextPageIndex = j + 1;
          }
        }
      }
    }
    return setup[setupIndex].order[nextPageIndex];
  }

  /**
    * Get previous page if available
    *
    * @return {string}
    */
  getPrevPage() {
    let setup = this.state.pageVals.schema.setup;
    let page = this.state.currentPage;
    let pageIndex;
    let setupIndex;

    for (let i = 0; i<setup.length; i++) {
      for (let j = 0; j<setup[i].order.length; j++) {
        if (setup[i].order[j] == page) {
          // if first page in section, go to last page
          // of previous section. Otherwise, go to previous page
          if (j === 0) {
            return null;
          } else {
            setupIndex = i;
            pageIndex = j - 1;
          }
        }
      }
    }
    return setup[setupIndex].order[pageIndex];
  }


  /**
    * Submit consent values
    */
  submitConsent() {
    let questions = this.pageQuestions(this.state.currentPage);
    let errors = [];

    // Give error if answer not selected
    for (let i = 0; i < questions.length; i++) {
      if (this.state.consentPageAnswers[questions[i]] == null) {
        errors[questions[i]] = 'Must enter consent answer before submitting';
      }
    }
    if (errors.length == 0
        && Object.keys(this.state.consentPageAnswers).length > 0
      ) {
      // Anonymous function for a custom swal including "next page" button
      let customSwal = null;
      if (this.nextPageAccessible()) {
        customSwal = function(pageFn) {
          return function() {
            swal.fire({
              type: 'success',
              title: 'Success!',
              text: 'Thank you for completing this step!',
              showCancelButton: true,
              cancelButtonText: 'OK',
              confirmButtonText: 'Next page',
            }).then((result) => {
              if (result['value']) {
                pageFn();
              }
            });
          };
        }(() => this.changePage(this.getNextPage()));
      } else {
        customSwal = function(pageFn) {
          return function() {
            swal.fire({
              type: 'success',
              title: 'Success!',
              text: 'Thank you for completing this step!',
              showCancelButton: true,
              cancelButtonText: 'OK',
              confirmButtonText: 'Return to Main Page',
            }).then((result) => {
              if (result['value']) {
                pageFn();
              }
            });
          };
        }(() => this.changePage('index'));
      }
      // submit consent through props function
      this.props.submit(this.state.consentPageAnswers, customSwal);
      this.setState({
        consentVals: {...this.state.consentVals,
          ...this.state.consentPageAnswers},
      });
    }

    this.setState({
      errors: errors,
    });
  }

  /**
    * Submit non-consent values
    *
    * @return {object} promise
    */
  submitPageAnswer() {
    let answers = this.state.answers;
    let errors = [];
    let questions = this.pageQuestions(this.state.currentPage);
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      // Check that question was answered
      // Don't check for other errors if not answered
      if (!(question in answers)) {
        errors[question] = 'Please select answer before submitting';
        break;
      }

      let options = this.state.pageVals.schema.elements[question].options;
      // Check that answer is correct
      let correctResponse = options.correctResponse;
      if (answers[question] !== correctResponse) {
        errors[question] = 'Incorrect! Please review and try again.';
      }
    }

    if (Object.keys(errors).length === 0) {
      // Add page to training progress
      let trainingProgress = this.state.trainingProgress;
      trainingProgress.push(this.state.currentPage);
      let progress = JSON.stringify(trainingProgress);

      // submit progress
      let formObj = new FormData();
      formObj.append('progress', progress);
      let actionUrl = this.props.data_url + '&action=progress';

      return fetch(actionUrl, {
        method: 'POST',
        body: formObj,
        cache: 'no-cache',
      })
      .then((response) => {
        if (response.ok) {
          // if successful, set state & disabled questions
          this.setState({
            trainingProgress: trainingProgress,
            errors: [],
          });
          this.setDisabled();
          // Give swal with next page option if relevant
          if (this.nextPageAccessible()) {
            swal.fire({
              type: 'success',
              title: 'Success!',
              text: 'Thank you! You may continue to the next step.',
              showCancelButton: true,
              cancelButtonText: 'OK',
              confirmButtonText: 'Next page',
            }).then((result) => {
              if (result['value']) {
                this.changePage(this.getNextPage());
              }
            });
          } else {
            // otherwise, give swal with return to main page option
            swal.fire({
              type: 'success',
              title: 'Success!',
              text: 'Thank you! You may continue to the next step.',
              showCancelButton: true,
              cancelButtonText: 'OK',
              confirmButtonText: 'Return to Main Page',
            }).then((result) => {
              if (result['value']) {
                this.changePage('index');
              }
            });
          }
          return Promise.resolve();
        } else {
          // Display error if could not update progress
          let msg = response.statusText ?
            response.statusText : 'Submission Error!';
          swal.fire(msg, '', 'error');
          console.error(msg);
          return Promise.reject();
        }
      });
    }
    this.setState({
      errors: errors,
    });
  }
}

export default TrainingPage;
