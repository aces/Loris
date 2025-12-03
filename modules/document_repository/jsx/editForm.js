/* exported DocEditForm */
import Loader from 'Loader';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import {
  FormElement,
  TextboxElement,
  TextareaElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';
import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';
import hiStrings from '../locale/hi/LC_MESSAGES/document_repository.json';

/**
 * Document Edit Form
 *
 * Fetches data corresponding to a given file from Loris backend and
 * displays a form allowing meta information of the media file
 *
 * @author Shen Wang
 * @version 1.0.0
 */
class DocEditForm extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      docData: {},
      formData: {},
      uploadResult: null,
      isLoaded: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    i18n.addResourceBundle('hi', 'document_repository', hiStrings);
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Fetch data
   *
   * @return {Promise}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
        const formData = data.docData;
        this.setState({
          data: data,
          docData: data.docData,
          formData: formData,
        });
      })
      .catch((error) => {
        this.setState({error: true});
      });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // Data loading error
    if (this.state.error) {
      return <h3>{t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <Loader/>
      );
    }

    let categoryDisabled =
      !loris.userHasPermission('document_repository_categories');

    return (
      <div>
        <FormElement
          name="docEdit"
          onSubmit={this.handleSubmit}
        >
          <h3>{t('Edit Document Repository File',
            {ns: 'document_repository'})}</h3>
          <br />
          <SelectElement
            name="category"
            label={t('Category', {ns: 'document_repository'})}
            options={this.state.data.categories}
            onUserInput={this.setFormData}
            required={true}
            disabled={categoryDisabled}
            value={this.state.docData.category}
          />
          <SelectElement
            name="forSite"
            label={t('Site', {ns: 'loris', count: 1})}
            options={this.state.data.sites}
            onUserInput={this.setFormData}
            required={true}
            disabled={true}
            value={this.state.docData.forSite}
          />
          <SelectElement
            name="instrument"
            label={t('Instrument', {ns: 'loris', count: 1})}
            options={this.state.data.instruments}
            onUserInput={this.setFormData}
            value={this.state.docData.instrument}
          />
          <TextboxElement
            name="pscid"
            label={t('PSCID', {ns: 'loris'})}
            onUserInput={this.setFormData}
            disable = {true}
            value={this.state.docData.pscid}
          />
          <TextboxElement
            name="visitLabel"
            label={t('Visit Label', {ns: 'loris'})}
            onUserInput={this.setFormData}
            value={this.state.docData.visitLabel}
          />
          <TextareaElement
            name="comments"
            label={t('Comments', {ns: 'document_repository'})}
            onUserInput={this.setFormData}
            value={this.state.docData.comments}
          />
          {
            loris.userHasPermission('document_repository_hidden') &&
                (<SelectElement
                  name="hiddenFile"
                  label={t('Restrict access to the file?',
                    {ns: 'document_repository'})}
                  options={this.state.data.hiddenVideo}
                  sortByValue={false}
                  onUserInput={this.setFormData}
                  value={this.state.docData.hiddenVideo}
                />)
          }
          <TextboxElement
            name="version"
            label={t('Version', {ns: 'document_repository'})}
            onUserInput={this.setFormData}
            value={this.state.docData.version}
          />
          <ButtonElement label={t('Update File', {ns: 'document_repository'})}/>
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submition event
   */
  handleSubmit(e) {
    e.preventDefault();
    let formData = this.state.docData;
    fetch(this.props.action, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then(()=>{
        swal.fire('Updated Successful!', '', 'success');
        this.fetchData();
      });
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let docData = this.state.docData;
    docData[formElement] = value;
    this.setState({
      docData: docData,
    });
  }
}

DocEditForm.propTypes = {
  dataURL: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['document_repository', 'loris'])(DocEditForm);
