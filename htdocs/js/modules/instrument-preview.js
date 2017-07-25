import InstrumentForm from '../../../jsx/InstrumentForm';
import { Evaluator } from '../../../jsx/lib/Parser';

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

function getAgeInMonths(dob) {
  function months_between(date1, date2) {
    return date2.getMonth() - date1.getMonth() + (12 * (date2.getFullYear() - date1.getFullYear()));
  }
  return months_between(dob, new Date())

}

class InstrumentPreview extends React.Component {
  constructor(props) {
    super(props);
    this.names = Object.keys(props.instruments);
    this.langs = ['en-ca', 'fr-ca'];
    const initialData = {};
    this.names.forEach((name) => {
      initialData[name] = getInitialData(props.instruments[name]);
    });

    const dob = '2005-07-06';
    const age_mths = getAgeInMonths(new Date(dob));

    this.state = {
      selectedInstrument: this.names[2],
      data: initialData,
      lang: 'en-ca',
      context: {
        t1_arm_1: {
          lang: '2',
          age_mths,
        },
        age_mths,
        lang: '2',
        dob
      },
      options: {
        surveyMode: true
      }
    };

    this.updateSelectedInstrument = this.updateSelectedInstrument.bind(this);
    this.updateInstrumentData = this.updateInstrumentData.bind(this);
    this.updateLang = this.updateLang.bind(this);
    this.updateSurveyMode = this.updateSurveyMode.bind(this);
  }

  updateSurveyMode() {
    const options = Object.assign({}, this.state.options, {surveyMode: !this.state.options.surveyMode});
    this.setState({
      options
    });
  }

  updateSelectedInstrument(name) {
    this.setState({
      selectedInstrument: name
    });
  }

  updateInstrumentData(fieldName, value) {
    const instrumentData = Object.assign({}, this.state.data[this.state.selectedInstrument], {[fieldName]: value});

    const calcElements = this.props.instruments[this.state.selectedInstrument].Elements.filter(
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
      {},
      this.state.data,
      {[this.state.selectedInstrument]: Object.assign({}, instrumentData, calculatedValues)}
    );

    this.setState({
      data: newData
    });
  }

  updateDOB(date) {
    const age_mths = getAgeInMonths(new Date(date));
    const t1_arm_1 = Object.assign({}, this.state.context.t1_arm_1, {age_mths});
    this.setState({
      context: Object.assign({}, this.state.context, { t1_arm_1, age_mths, dob: date })
    });
  }

  updateLang(lang) {
    const langMap = {
      'en-ca': '2',
      'fr-ca': '1'
    };

    const t1_arm_1 = Object.assign({}, this.state.context.t1_arm_1, {lang: langMap[lang]});

    this.setState({
      lang,
      context: Object.assign({}, this.state.context, { t1_arm_1, lang: langMap[lang] })
    });
  }

  render() {
    const { instruments } = this.props;

    return (
      <div>
        <div style={{borderBottom: '1px solid black', backgroundColor: '#FFF8E8', padding: '2em'}}>
          <div style={{width: 460}}>
            <label>
              Instrument
              <select
                name="selectedInstrument"
                className="form-control"
                value={this.state.selectedInstrument}
                onChange={(e) => { this.updateSelectedInstrument(e.target.value)}}
              >
                {
                  this.names.map((name) => {
                    return (
                      <option value={name} key={name}>{name}</option>
                    );
                  })
                }
              </select>
            </label>
            <br />
            <label>
              Language
              <select
                name="lang"
                className="form-control"
                value={this.state.lang}
                onChange={(e) => { this.updateLang(e.target.value)}}
              >
                {
                  this.langs.map((lang) => {
                    return (
                      <option value={lang} key={lang}>{lang}</option>
                    );
                  })
                }
              </select>
            </label>
            <br />
            <label>
              DOB
              <div className="form-inline">
              <input
                type="date"
                className="form-control"
                name="dob"
                value={this.state.context.dob}
                onChange={(e) => { this.updateDOB(e.target.value)}}
              />
              &nbsp;<small>{`(Age In Months: ${this.state.context.age_mths})`}</small>
              </div>
            </label>
            <br />
            <label>
              Survey Mode
              <input
                type="checkbox"
                className="form-control"
                name="surveyMode"
                checked={this.state.options.surveyMode}
                onChange={(e) => { this.updateSurveyMode()}}
              />
            </label>
          </div>
        </div>
        <div style={{padding: '2em 5em 2em 5em'}}>
          <InstrumentForm
            instrument={localizeInstrument(instruments[this.state.selectedInstrument], this.state.lang)}
            lang={this.state.lang}
            data={this.state.data[this.state.selectedInstrument]}
            context={this.state.context}
            onUpdate={this.updateInstrumentData}
            options={this.state.options}
          />
        </div>
      </div>
    );
  }
}

function localizeInstrument(rawInstrument, lang = 'en-ca') {
  const instrument = JSON.parse(JSON.stringify(rawInstrument));

  try {
    instrument['Meta']['LongName'] = instrument['Meta']['LongName'][lang];

    const convertedElements = [];

    instrument['Elements'].forEach((element) => {
      if (['label', 'text', 'calc', 'date'].includes(element.Type)  && element['Description'][lang]) {
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
  const instrumentsEl = document.querySelector('#instruments');
  const instruments = JSON.parse(instrumentsEl.dataset.json).reduce((result, instrument) => {
    result[instrument.Meta.ShortName] = instrument;
    return result;
  }, {});

  ReactDOM.render(<InstrumentPreview instruments={instruments} />, document.getElementById("container"));
};
