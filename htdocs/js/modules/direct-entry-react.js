import InstrumentForm from '../../../jsx/InstrumentForm';
//
const translations = {
  finalize: {
    'en-ca': 'Save and Finalize'
  }
};

const INPUT_ELEMENT_TYPES = ['date', 'radio', 'text', 'calc', 'checkbox'];

function getInitialData(instrument) {
  return instrument.Elements.filter((element) => (
    INPUT_ELEMENT_TYPES.includes(element.Type)
  )).map((element) => (
    element.Name
  )).reduce((result, element) => {
    result[element] = null;
    return result;
  }, {})
}

class DirectEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: getInitialData(props.rawInstrument) };

    this.updateInstrumentData = this.updateInstrumentData.bind(this);
    this.syncInstrumentData = this.syncInstrumentData.bind(this);
  }

  updateInstrumentData(name, value) {
    const dataCopy = Object.assign({}, this.state.data);
    dataCopy[name] = value;
    this.setState({
      data: dataCopy
    });
  }

  // XHR to sync data with backend
  syncInstrumentData() {
    $.post( "ajax/test.html", this.state.data, function(data, textStatus, jqXHR) {
      if (success) {

      } else {

      }
    });
  }

  render() {
    const { rawInstrument, rawContext, lang } = this.props;

    const instrumentCopy = JSON.parse(JSON.stringify(rawInstrument));
    instrumentCopy['Meta']['LongName'] = instrumentCopy['Meta']['LongName'][lang];
    const instrument = removeHiddenSurveyElements(instrumentCopy, lang);
    return (
      <div>
        <InstrumentForm
          instrument={instrument}
          instrument={localizeInstrument(instrument, lang)}
          data={this.state.data}
          context={rawContext}
          options={false}
          onUpdate={this.updateInstrumentData}
          onSave={null}
        />
        <button onClick={(e) => {
          e.preventDefault();
          this.syncInstrumentData();
        }}>
          {translations.finalize[lang]}
        </button>
      </div>
    );
  }
}

function removeHiddenSurveyElements(instrument) {
  const instrumentCopy = JSON.parse(JSON.stringify(instrument));

  instrumentCopy.Elements = instrumentCopy.Elements.filter((element) => {
    return !element.HiddenSurvey;
  });

  return instrumentCopy;
}

function localizeInstrument(rawInstrument, lang = 'en-ca') {
  const instrument = JSON.parse(JSON.stringify(rawInstrument));

  try {
    instrument['Meta']['LongName'] = instrument['Meta']['LongName'][lang];

    const convertedElements = [];

    instrument['Elements'].forEach((element) => {
      if (element.Type === 'label' && element['Description'][lang]) {
        element['Description'] = element['Description'][lang];
        convertedElements.push(element);
      } else if (['select', 'radio', 'checkbox'].includes(element.Type) && element['Description'][lang]) {
        element['Description'] = element['Description'][lang];
        element['Options']['Values'] = element['Options']['Values'][lang];
        convertedElements.push(element);
      } else if (['radio-labels'].includes(element.Type) && element['Labels'][lang]) {
        element['Labels'] = element['Labels'][lang];
        convertedElements.push(element);

      }
    });

    instrument['Elements'] = convertedElements;
    return instrument;
  } catch (e) {
    console.log(e);
  }
}

window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const rawInstrument = JSON.parse(instrumentEl.dataset.json);
  const rawContext = JSON.parse(instrumentEl.dataset.context);
  const lang = 'en-ca';
  ReactDOM.render(<DirectEntry rawInstrument={rawInstrument} rawContext={rawContext} lang={lang}/>, document.getElementById("container"));
};
