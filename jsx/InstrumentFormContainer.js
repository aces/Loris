import InstrumentForm from './InstrumentForm';
import { Evaluator, NullVariableError } from './lib/Parser';
import localizeInstrument from './lib/localize-instrument';

const INPUT_TYPES = ['select', 'date', 'radio', 'text', 'calc', 'checkbox'];

/* InstrumentForm and InstrumentFormContainer follow the `presentational vs container`
 * pattern (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0).
 * InstrumentFormContainer is concerned with how things work (managing state) and
 * InstrumentForm is concerned only with how things look.
 */
class InstrumentFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.initialData,
      localizedInstrument: localizeInstrument(this.props.instrument, this.props.lang),
      showRequired: false,
      errorMessage: null,
    };
    
    this.updateInstrumentData = this.updateInstrumentData.bind(this);
    this.incompleteRequiredFieldExists = this.incompleteRequiredFieldExists.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
  }

  getSaveText(lang) {
    switch(lang) {
      case 'en-ca':
        return 'Save';
      case 'fr-ca':
        return 'Enregistrer';
    }
  }

  getSaveWarning(lang) {
    switch(lang) {
      case 'en-ca':
        return 'You cannot modify your answers after clicking this button. Please ensure all answers are correct.';
      case 'fr-ca':
        return 'Vous ne pouvez pas modifier vos réponses après avoir cliqué sur ce bouton. Assurez-vous que toutes les réponses sont correctes.';
    }
  }
  
  /**
   * This function is called when the user inputs or updates an instrument
   * field. It is responsible for updating `state.data`, which involves not
   * only updating the field which the user modified but also any calculated fields
   * that may have changed as a result.
   *
   * @param {string} name - The name of the data point that changed
   * @param value - The new value of the data point
   */
  updateInstrumentData(name, value) {
    const instrumentData = Object.assign({}, this.state.data, {[name]: value});

    const calcElements = this.props.instrument.Elements.filter(
      (element) => (element.Type === 'calc')
    );

    const evaluatorContext = { ...instrumentData, context: this.props.context };
    const calculatedValues = calcElements.reduce((result, element) => {
      try {
        result[element.Name] = String(Evaluator(element.Formula, evaluatorContext));
      } catch (e) {
        if (!(e instanceof NullVariableError)) {
          throw e;
        }
      }
      return result;
    }, {});

    const newData = Object.assign(
      {}, instrumentData, calculatedValues
    );

    this.setState({
      data: newData
    });
  }

  /**
   * Intended to be called before submitting data to the server as part of
   * the front-end validation process.
   *
   * @returns {boolean} Boolean indicating whether any required fields have been left incomplete
   */
  incompleteRequiredFieldExists() {
    const annotatedElements = this.annotateElements(
      this.filterElements(
        this.state.localizedInstrument.Elements,
        this.state.data,
        this.props.context,
        this.props.options.surveyMode
      ),
      this.state.data,
      this.props.context
    );

    let incompleteExists = false;
    annotatedElements.forEach((element) => {
      if (element.Options.RequireResponse && (!element.Value)) {
        incompleteExists = true;
      }
    });

    return incompleteExists;
  }

  /**
   * Determines whether a field should be displayed. The Hidden property can cause a field
   * to be hidden, as can the HiddenSurvey property (only if SurveyMode is enabled). The
   * DisplayIf may contain a string of LorisScript which will be evaluated using the context
   * and current data.
   *
   * @returns {boolean} Boolean indicating whether the field should be displayed
   */
  isDisplayed(element, index, data, context, surveyMode) {
    if (
      (element.Hidden) ||
      (surveyMode && element.HiddenSurvey) ||
      (element.DisplayIf === false)
    ) {
      return false;
    }

    if (element.DisplayIf === '') return true;

    try {
      return Evaluator(element.DisplayIf, { ...data, context});
    } catch(e) {
      if (!(e instanceof NullVariableError)) {
        console.log(`Error evaluating DisplayIf property of element ${index}.\n${e}`);
      }

      return false;
    }
  }

  /**
   * Determines whether a field is required. The RequireResponse of an element can
   * be a simple boolean in which case it is returned. RequireResponse can also be
   * a string of LorisScript which will be evaluated using the context and current data.
   *
   * @returns {boolean} Boolean indicating whether the field is required
   */
  isRequired(element, index, data, context) {
    if (!INPUT_TYPES.includes(element.Type)) return false;

    const requireResponse = element.Options.RequireResponse || false;
    if (typeof(requireResponse) === 'boolean') return requireResponse;

    try {
      return Evaluator(requireResponse, { ...data, context });
    } catch (e) {
      if (!(e instanceof NullVariableError)) {
        console.log(`Error evaluating RequireResponse property of element ${index}.\n${e}`);
      }

      return false;
    }
  }

  onSaveButtonClick() {
    if (this.incompleteRequiredFieldExists()) {
      this.setState({
        errorMessage: 'Please fill in the required fields indicated below.',
        showRequired: true
      });
      const errorDiv = document.getElementById("instrument-error");
      errorDiv.scrollIntoView(false);
    } else {
      this.props.onSave(this.state.data);
      this.setState({
        errorMessage: '',
        showRequired: false
      });
    }
  }

  /**
   * Helper function which filters an instruments elements by applying isDisplay
   * to each.
   *
   * @returns {array} Array of the filtered elements
   */
  filterElements(elements, data, context, surveyMode) {
    return elements.filter(
      (element, index) => this.isDisplayed(element, index, data, context, surveyMode)
    );
  }

  /**
   * Adds a Value property which contains the current value contained in this.state.data
   * to each element. This allows us to avoid passing this.state.data to InstrumentForm and
   * simplifies things in that component. This function will also evaluate any LorisScript contained
   * in a RequireResponse property of an element and replace it with a boolean. Again, this
   * simplifies things in InstrumentForm.
   *
   * @returns {array} Array of the filtered elements
   */
  annotateElements(elements, data, context) {
    return elements.map(
      (element, index) => Object.assign(element, { 
        Value: data[element.Name],
        Options: Object.assign({}, element.Options, {
          RequireResponse: this.isRequired(element, index, data, context)
        })
      })
    );
  }

  render() {
    const { data, localizedInstrument } = this.state;
    const { context, options, lang } = this.props;

    return (
      <InstrumentForm
        meta={localizedInstrument.Meta}
        elements={
          this.annotateElements(
            this.filterElements(localizedInstrument.Elements, data, context, options.surveyMode),
            data,
            context
          )
        }
        showRequired={this.state.showRequired}
        errorMessage={this.state.errorMessage}
        onUpdate={this.updateInstrumentData}
        onSave={this.onSaveButtonClick}
        saveText={this.getSaveText(lang)}
        saveWarning={this.getSaveWarning(lang)}
      />
    );
  }
}

export default InstrumentFormContainer;
