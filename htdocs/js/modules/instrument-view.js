import InstrumentForm from '../../../jsx/InstrumentForm';
import { Evaluator } from '../../../jsx/lib/Parser';
import localizeInstrument from '../../../jsx/lib/localize-instrument';

const INPUT_ELEMENT_TYPES = ['radio', 'text', 'calc', 'checkbox'];

const SaveButton = ({onSave}) => {
  return (
    <button onClick={onSave} type="button" className="btn btn-default btn-lg">
      <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Save
    </button>
  );
}

class InstrumentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      context: {},
      options: {}
    };

    this.updateInstrumentData = this.updateInstrumentData.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  updateInstrumentData(name, value) {
    const instrumentData = Object.assign({}, this.state.data, {[name]: value});

    const calcElements = this.props.instrument.Elements.filter(
      (element) => (element.Type === 'calc')
    );

    const evaluatorContext = Object.assign({}, this.state.context, instrumentData);
    const calculatedValues = calcElements.reduce((result, element) => {
      try {
        result[element.Name] = String(Evaluator(element.Formula, evaluatorContext));
      } catch (e) {
        if (!(e instanceof TypeError)) {
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

  onSave() {
    const saveURL = window.location.href;
    $.post(saveURL, this.state.data, function( responseData, textStatus, jqXHR ) {
      console.log('saved!');
    }).fail(() => {
      console.log('failed to save!');
    });
  }

  render() {
    const { instrument, lang, context } = this.props;

    return (
      <div>
        <InstrumentForm
          instrument={localizeInstrument(instrument, this.state.lang)}
          data={this.state.data}
          lang={lang}
          context={context}
          onUpdate={this.updateInstrumentData}
          options={this.state.options}
        />
        <SaveButton onSave={this.onSave}/>
      </div>
    );
  }
}

window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const context = JSON.parse(instrumentEl.dataset.context);

  ReactDOM.render(
    <InstrumentView 
      instrument={instrument}
      data={initialData}
      lang={lang}
      context={context}
    />,
    document.getElementById("container")
  );
};
