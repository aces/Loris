/**
 * This file sets up a basic eConsent form without training
 *
 * @author Camille Beaudoin
 *
 */
import Page from './directConsentForm';
import Loader from 'Loader';
import swal from 'sweetalert2';
import SendConfirmation from './sendConfirmation';

/**
 * Basic Page
 *
 * Component for simple version of eConsent form
 *
 * @author Camille Beaudoin
 */
class BasicPage extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      formData: [],
      errors: [],
      openSendConfirmation: false,
    };

    this.submitConsent = this.submitConsent.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.renderSendConfirmation = this.renderSendConfirmation.bind(this);
    this.openSendConfirmation = this.openSendConfirmation.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.setState({
      isLoaded: true,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    let page;

    // create z-json eConsent structure out of basic eConsent display elements
    page = {
      'schema': {
        'elements': {
          'consentPage': {
            'type': 'section',
            'description': {
              'EN': '',
            },
            'options': {
              'order': [
                'title',
                'media',
                'description',
              ],
              'showDesc': false,
            },
          },
          'title': {
            'type': 'text',
            'description': {
              'EN': this.props.consentData.Title,
            },
          },
          'media': {
            'type': 'image',
            'description': {
              'EN': '',
            },
            'src': {
              'EN': this.props.consentData.Media,
            },
            'options': {
              'isDisplayedAsText': false,
              'ifDisplayed': 'render',
            },
          },
          'description': {
            'type': 'text',
            'description': {
              'EN': this.props.consentData.Description,
            },
          },
        },
        'setup': [
          {
            'name': 'consentPage',
            'order': [
              'consentPage',
            ],
          },
        ],
      },
      'ui': {
        'title': {
          'type': 'header',
          'options': {
            'level': 1,
          },
        },
        'media': {
          'type': 'image',
          'options': {
            'percentage': '70',
          },
        },
        'description': {
          'type': 'label',
        },
      },
    };

    let consents = this.props.consentData.consents;
    let button;

    if (this.props.requestStatus !== 'complete') {
      // Add question for each consent code in consent group
      // If not already complete
      for (let property in consents) {
        if (consents.hasOwnProperty(property)) {
          // Create elements for each consent code
          page.schema.elements.consentPage.options.order.push(property);
          page.schema.elements[property] = {
            'type': 'enum',
            'description': {
              'EN': consents[property].Label,
            },
            'options': {
              'values': [
                {
                  'description': {
                    'EN': 'I agree',
                  },
                  'value': 'yes',
                },
                {
                  'description': {
                    'EN': 'I disagree',
                  },
                  'value': 'no',
                },
              ],
              'isSavable': true,
            },
          };
          page.ui[property] = {
            'type': 'select',
          };
        }
      }
      // Add submit button
      button = (
        <div className={'flex-row-container'}
          style={{padding: '20px 0 0 0'}}>
          <button
            type='submit'
            className='btn btn-primary btn-lg'
            onClick={this.submitConsent}
          >
            Submit
          </button>
        </div>
      );
    } else {
      // Add notice that form is complete
      page.schema.elements.consentPage.options.order.push('notice');
      page.schema.elements['notice'] = {
        'type': 'text',
        'description': {
          'EN': 'This form has already been completed. Thank you!',
        },
      };
      page.ui['notice'] = {
        'type': 'label',
      };
    }

    // Render page elements
    let elements = (
      <Page
        elements={page}
        consentAnswers={this.state.formData}
        updateConsentAnswer={this.setFormData}
        errors={this.state.errors}
        page='consentPage'
      />
    );
    if (this.state.openSendConfirmation) {
      return (
        <div>
          {this.renderSendConfirmation()}
          <div id='consent'>
            <div className={'container'}>
            {elements}
            </div>
            <div className={'container'}>
            {button}
            </div>
          </div>

        </div>
      );
    } else {
      return (
        <div>
          <div id='consent'>
            {this.renderSendConfirmation()}
            <div className={'container'}>
            {elements}
            </div>
            <div className={'container'}>
            {button}
            </div>
          </div>
        </div>
      );
    }
  }

  /**
   * Submit consent to update database
   */
  submitConsent() {
    let consents = this.props.consentData.consents;
    let errors = [];

    // Give error if no answer selected
    for (let property in consents) {
      if (this.state.formData[property] == null) {
        errors[property] = 'Answer required';
      }
    }

    let customSwal = function(pageFn) {
      return function() {
        swal.fire({
          type: 'success',
          title: 'Success!',
          text: 'Thank you for completing the eConsent Form! ' +
            'Please click "Send Confirmation" below to receive ' +
            'a confirmation email',
          showCancelButton: true,
          confirmButtonText: 'Send Confirmation',
        }).then((result) => {
          if (result['value']) {
            pageFn();
          }
        });
      };
    }(() => this.openSendConfirmation());

    // Submit if no errors
    if (Object.keys(errors).length == 0) {
      this.props.submit(this.state.formData, customSwal);
    }
    this.setState({
      errors: errors,
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * open send confirmation page
   */
  openSendConfirmation() {
    this.setState({openSendConfirmation: true});
    this.forceUpdate();
  }

  /**
   * Render form to send consent confirmation
   * @return {JSX} - React markup for the component
   */
  renderSendConfirmation() {
    return (
      <SendConfirmation
        data_url={this.props.data_url}
        openSendConfirmation={this.state.openSendConfirmation}
      />
    );
  }
}

export default BasicPage;
