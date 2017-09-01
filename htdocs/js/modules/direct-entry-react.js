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
    const { instrument, initialData, lang, context, options } = this.props;
    const { complete, error } = this.state;

    if (error) {
      return (<div>{error}</div>);
    }

    if (complete) {
      return (<div>Survey successfully submitted.</div>);
    }

    return (
      <InstrumentFormContainer
        instrument={instrument}
        initialData={initialData}
        lang={lang}
        context={context}
        options={options}
        onSave={this.onSave}
      />
    );
  }
}


window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const context = JSON.parse(instrumentEl.dataset.context);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const options = { surveyMode: true };

  ReactDOM.render(
    <DirectEntryReact
      instrument={instrument}
      initialData={initialData}
      lang={lang}
      context={context}
      options={options}
    />,
    document.getElementById("container")
  );
};
