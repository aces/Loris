/**
 * This file contains React form components for eConsents
 *
 * @author Camille Beaudoin
 *
 */
import DOMPurify from 'dompurify';
import Modal from 'Modal';
import PropTypes from 'prop-types';
import {
  CheckboxElement,
} from 'jsx/Form';

/**
 *  THIS ELEMENT IS FOR DEVELOPMENT PURPOSES ONLY
 */
class NotImplement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
      super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        {this.props.type} is not yet implemented
      </div>
    );
  }
}

NotImplement.propTypes = {
  type: PropTypes.string.isRequired
};

/**
 * Set up Page
 */
class Page extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
      super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let pageElements =
      this.props.elements.schema.elements[this.props.page].options.order;
    let DirectEntryFormElements = [];
    // Go through form elements to render each one
    for (let i = 0; i<pageElements.length; i++) {
      DirectEntryFormElements.push(
        <DirectEntryFormElement
          name={pageElements[i]}
          element={this.props.elements.schema.elements[pageElements[i]]}
          ui={this.props.elements.ui[pageElements[i]]}
          values={{...this.props.values, ...this.props.consentAnswers}}
          updateAnswer={this.props.updateAnswer}
          updateConsentAnswer={this.props.updateConsentAnswer}
          errors={this.props.errors}
        />
      );
    }

    return (
      <div>
        {DirectEntryFormElements}
      </div>
    );
  }
}

Page.propTypes = {
  elements: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  consentAnswers: PropTypes.object,
  updateAnswer: PropTypes.func.isRequired,
  updateConsentAnswer: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

/**
 * Render form element
 */
class DirectEntryFormElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
      super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let element;
    let errorMessage;
    let questionClass='question-container col-xs-12 col-sm-10 col-sm-offset-1';

    switch (this.props.ui.type) {
      case 'select':
        element = (
          <SelectElement
            name={this.props.name}
            element={this.props.element}
            value={this.props.values[this.props.name]}
            updateAnswer={this.props.updateAnswer}
            updateConsentAnswer={this.props.updateConsentAnswer}
            error={this.props.errors[this.props.name]}
          />
        );
        break;
      case 'label':
        element = (
          <LabelElement element={this.props.element} />
        );
        break;
      case 'header':
        element = (
          <HeaderElement
            element={this.props.element}
            level={this.props.ui.options.level}
          />
        );
        break;
      case 'image':
        // Check if modal image element or image element
        if (
          this.props.element.options.isDisplayedAsText &&
          this.props.element.options.ifDisplayed === 'modal'
        ) {
          element = (
            <ModalImageElement
              element={this.props.element}
              percentage={this.props.ui.options.percentage}
            />
          );
        } else {
          element = (
            <ImageElement
              element={this.props.element}
              percentage={this.props.ui.options.percentage}
            />
          );
        }
        break;
      case 'link':
        element = (
          <LinkElement
            element={this.props.element}
            downloadable={this.props.ui.options.isDownloadable}
            href={this.props.ui.options.href}
          />
        );
        break;
      case 'checkbox':
        element = (
          <div className='checkboxText'>
            <CheckboxElement
              name={this.props.name}
              label={this.props.element.description.EN}
              value={this.props.values[this.props.name]}
              onUserInput={this.props.updateAnswer}
              disabled={this.props.element.options.disabled}
              elementClass={'checkbox-inline'}
           />
         </div>
        );
        break;
      default:
        element = (
          <NotImplement
            element={this.props.element}
            type={this.props.ui.type}
          />
        );
    }

    // Set error display if needed
    if (this.props.errors[this.props.name]) {
      questionClass += ' questionError';
      errorMessage = (
        <h4 className='col-xs-12 has-error'>
          * {this.props.errors[this.props.name]}
        </h4>
      );
    }

    return (
      <div
          id={this.props.name}
          className={questionClass}
      >
        {element}
        {errorMessage}
      </div>
    );
  }
}

DirectEntryFormElement.propTypes = {
  ui: PropTypes.object.isRequired,
  name: PropTypes.string,
  element: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  updateAnswer: PropTypes.func.isRequired,
  updateConsentAnswer: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

/**
 * Render select element
 */
class SelectElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
      super(props);
      this.state = {
        value: '',
      };
  }

  /**
   * Call update answer when selected
   * @param {string} value
   */
  onSelect(value) {
    let updateAnswer;
    if (this.props.element.options.isSavable) {
      updateAnswer = this.props.updateConsentAnswer;
    } else {
      updateAnswer = this.props.updateAnswer;
    }
    if (this.props.value !== value) {
      updateAnswer(this.props.name, value);
    } else {
      updateAnswer(this.props.name, null);
    }
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let options = [];
    let optionLabel;
    let optionVals = this.props.element.options.values;

    // render each option in the select element
    for (let i = 0; i < optionVals.length; i++) {
      let checked;
      if (optionVals[i].value === '') {
        continue;
      } else if (optionVals[i].value === this.props.value) {
        checked = (
          <i className="glyphicon glyphicon-ok" ></i>
        );
      }
      optionLabel = optionVals[i].description.EN;
      let description = (
        <div dangerouslySetInnerHTML=
          {{__html: DOMPurify.sanitize(optionLabel)}} />
      );

      // Render as disabled if needed
      if (this.props.element.options.disabled) {
        options.push(
          <div key={optionVals[i].value} className="col-xs-12">
            <div className="col-xs-offset-1 selectBox">
              <label className="btn btn-default btn-circle disabled">
                {checked}
              </label>
            </div>
            <div className="selectOption">
              {description}
            </div>
          </div>
        );
      } else {
        options.push(
          <div
            key={optionVals[i].value}
            className="col-xs-12 select-option"
            onClick={this.onSelect.bind(this, optionVals[i].value)}
          >
            <div className="col-xs-offset-1 selectBox">
              <label className="btn btn-default btn-circle">
                {checked}
              </label>
            </div>
            <div className="selectOption">
              {description}
            </div>
          </div>
        );
      }
    }

    const element = (
      <div className='row field_input' data-toggle="buttons">
        {options}
      </div>
    );

    let classInfo = 'col-xs-12 field_question';

    if (this.props.error) {
      classInfo += ' has-error';
    }

    let description = '';
    if (this.props.element.description.EN) {
      let label = (
        <div dangerouslySetInnerHTML=
          {{__html: DOMPurify.sanitize(this.props.element.description.EN)}} />
      );

      description = (
        <h3 className={classInfo}>
          {label}
        </h3>
      );
    }

    return (
      <div>
        {description}
        {element}
      </div>
    );
  }
}

SelectElement.propTypes = {
  element: PropTypes.object.isRequired,
  error: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  updateAnswer: PropTypes.func.isRequired,
  updateConsentAnswer: PropTypes.func.isRequired,
};

/**
 * Render label element
 */
class LabelElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
      super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = this.props.element.description.EN;
    let description = (
      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(label)}} />
    );
    return (
      <div>
        <p className='labelText'>{description}</p>
      </div>
    );
  }
}

LabelElement.propTypes = {
  element: PropTypes.object.isRequired,
};

/**
 * Render header element
 */
class HeaderElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
      super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = this.props.element.description.EN;
    if (this.props.level == 2) {
      let description = (
        <h3 className='col-xs-12 field_question'>
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(label)}} />
        </h3>
      );
      return (
        <div>
          {description}
        </div>
      );
    } else {
      let element = (
        <h1>
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(label)}} />
        </h1>
      );
      return (
        <div>
          {element}
        </div>
      );
    }
  }
}

LinkElement.propTypes = {
  element: PropTypes.object.isRequired,
  level: PropTypes.string,
};

/**
 * Render link element
 */
class LinkElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = this.props.element.description.EN;
    let description = (
      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(label)}} />
    );

    if (this.props.downloadable) {
      return (
        <div id='linkElement'>
          <a href={this.props.href} download>
            <p className='downloadText'>{description}</p>
          </a>
        </div>
      );
    } else {
      return (
        <div className='linkElement'>
          <p><a href={this.props.href} target="_blank">{description}</a></p>
        </div>
      );
    }
  }
}

LinkElement.propTypes = {
  downloadable: PropTypes.string,
  href: PropTypes.string,
  element: PropTypes.object.isRequired,
};

/**
 * Image element
 */
class ImageElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let width = this.props.percentage + '%';
    return (
      <div
        id='Media'
      >
        <img src={this.props.element.src.EN} width={width}/>
      </div>
    );
  }
}

ImageElement.propTypes = {
  percentage: PropTypes.string,
  element: PropTypes.object.isRequired,
};

/**
 * Image element in modal window
 */
class ModalImageElement extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModalWindow = this.renderModalWindow.bind(this);
  }
  /**
   * Render component
   * @return {JSX} - React markup for the component
   */
  render() {
    let label = this.props.element.description.EN;
    let description = (
      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(label)}} />
    );

    return (
      <div>
        <a href="#" onClick={this.openModal}>
          <p className='downloadText'>{description}</p>
        </a>
        {this.renderModalWindow()}
      </div>
    );
  }
  /**
   * Open window
   */
  openModal() {
    this.setState({
      isOpen: true,
    });
  }
  /**
   * Close window
   */
  closeModal() {
    this.setState({
      isOpen: false,
    });
  }
  /**
   * Render modal window
   * @return {JSX} - React markup for the component
   */
  renderModalWindow() {
    let width = this.props.percentage + '%';
    return (
      <Modal
        onClose={this.closeModal}
        show={this.state.isOpen}
      >
        <div>
          <img
            className='modal-image'
            src={this.props.element.src.EN}
            width={width}
          />
        </div>
      </Modal>
    );
  }
}

ModalImageElement.propTypes = {
  percentage: PropTypes.string,
  element: PropTypes.object.isRequired,
};

export default Page;
