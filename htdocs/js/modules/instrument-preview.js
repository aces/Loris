import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

const INPUT_ELEMENT_TYPES = ['select', 'date', 'radio', 'text', 'calc', 'checkbox'];

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
      lang: 'en-ca',
      context: {
        age_mths,
        lang: '2',
        dob
      },
      options: {
        surveyMode: true
      }
    };

    this.updateSelectedInstrument = this.updateSelectedInstrument.bind(this);
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

  updateDOB(date) {
    const age_mths = getAgeInMonths(new Date(date));
    const context = Object.assign({}, this.state.context, {age_mths});
    this.setState({
      context: Object.assign({}, this.state.context, { age_mths, dob: date })
    });
  }

  updateLang(lang) {
    const langMap = {
      'en-ca': '2',
      'fr-ca': '1'
    };

    const context = Object.assign({}, this.state.context, {lang: langMap[lang]});

    this.setState({
      lang,
      context: Object.assign({}, this.state.context, { lang: langMap[lang] })
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
          <InstrumentFormContainer
            key={`${this.state.selectedInstrument}-${this.state.lang}`}
            instrument={instruments[this.state.selectedInstrument]}
            lang={this.state.lang}
            initialData={getInitialData(this.props.instruments[this.state.selectedInstrument])}
            context={this.state.context}
            options={this.state.options}
            onSave={() => { console.log('save!') }}
          />
        </div>
      </div>
    );
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
