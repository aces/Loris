import InstrumentForm from './InstrumentForm';
import { Evaluator, NullVariableError } from './lib/Parser';
import localizeInstrument from './lib/localize-instrument';

const INPUT_TYPES = ['select', 'date', 'radio', 'text', 'calc', 'checkbox'];

class InstrumentFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.initialData,
      localizedInstrument: localizeInstrument(this.props.instrument, this.props.lang),
      showRequired: false,
      errorMessage: null
    };

    this.updateInstrumentData = this.updateInstrumentData.bind(this);
    this.incompleteRequiredFieldExists = this.incompleteRequiredFieldExists.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
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
      this.state.localizedInstrument.Elements,
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
      this.props.onSave(this.state.data)
    }
  }

  filterElements(elements, data, context, surveyMode) {
    return this.state.localizedInstrument.Elements.filter(
      (element, index) => this.isDisplayed(element, index, data, context, surveyMode)
    );
  }

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
    const { context, options } = this.props;

    return (
      <InstrumentForm
        meta={localizedInstrument.Meta}
        elements={
          this.annotateElements(
            this.filterElements(localizeInstrument.Elements, data, context, options.surveyMode),
            data,
            context
          )
        }
        showRequired={this.state.showRequired}
        errorMessage={this.state.errorMessage}
        onUpdate={this.updateInstrumentData}
        onSave={this.onSaveButtonClick}
      />
    );
  }
}

export default InstrumentFormContainer;
