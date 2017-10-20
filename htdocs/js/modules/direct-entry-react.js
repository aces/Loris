import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

class DirectEntryReact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      error: null
    };

    this.onSave = this.onSave.bind(this);
  }

  onSave(data) {
    const saveURL = window.location.href;
    $.post(saveURL, {instrumentData: JSON.stringify(data)}, ( responseData, textStatus, jqXHR ) => {
      this.setState({complete: true});
    }).fail((jqXHR, textStatus, errorThrown) => {
      this.setState({error: errorThrown});
    });
  }

  render() {
    const { instrument, initialData, lang, context, options, logo, study } = this.props;
    const { complete, error } = this.state;

    if (error) {
      return (<div>{error}</div>);
    }

    if (complete) {
      return (<div className="complete">Survey completed. You can now exit this browser window.</div>);
    }

    return (
      <div>
        <div id="banner">
          <img id="logo" src={logo}/>
          <span className="studyTitle">{study}</span>
        </div>
        <div className="instrumentContainer">
          <InstrumentFormContainer
            instrument={instrument}
            initialData={initialData}
            lang={lang}
            context={context}
            options={options}
            onSave={this.onSave}
          />
        </div>
      </div>
    );
  }
}


window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const context = JSON.parse(instrumentEl.dataset.context);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const logo = instrumentEl.dataset.logo ? instrumentEl.dataset.logo : "";
  const study = instrumentEl.dataset.study ? instrumentEl.dataset.study : "";
  const options = { surveyMode: true };
  ReactDOM.render(
    <DirectEntryReact
      instrument={instrument}
      initialData={initialData}
      lang={lang}
      context={context}
      options={options}
      logo={logo}
      study={study}
    />,
    document.getElementById("container")
  );
};
