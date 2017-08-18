import InstrumentForm from './InstrumentForm';
import { Evaluator, NullVariableError } from './lib/Parser';
import localizeInstrument from './lib/localize-instrument';

class InstrumentFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.initialData
    };

    this.updateInstrumentData = this.updateInstrumentData.bind(this);
  }

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

  render() {
    const { instrument, lang, context, onSave } = this.props;

    return (
      <InstrumentForm
        instrument={localizeInstrument(instrument, this.state.lang)}
        data={this.state.data}
        lang={lang}
        context={context}
        onUpdate={this.updateInstrumentData}
        options={this.state.options}
        onSave={onSave}
      />
    );
  }
}

export default InstrumentFormContainer;
