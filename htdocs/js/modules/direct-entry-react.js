import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

function onSave() {
  console.log('save not implemented!');
}

window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const context = JSON.parse(instrumentEl.dataset.context);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const options = { surveyMode: true };

  ReactDOM.render(
    <InstrumentFormContainer
      instrument={instrument}
      initialData={initialData}
      lang={lang}
      context={context}
      options={options}
      onSave={onSave}
    />,
    document.getElementById("container")
  );
};
