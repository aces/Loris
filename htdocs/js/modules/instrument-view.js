import InstrumentFormContainer from '../../../jsx/InstrumentFormContainer';

function onSave(data) {
  const saveURL = window.location.href;
  $.post(saveURL, {instrumentData: JSON.stringify(data)}, function( responseData, textStatus, jqXHR ) {
    console.log('saved!');
  }).fail(() => {
    console.log('failed to save!');
  });
}

window.onload = function() {
  const instrumentEl = document.querySelector('#instrument');
  const instrument = JSON.parse(instrumentEl.dataset.instrument);
  const initialData = JSON.parse(instrumentEl.dataset.initial);
  const lang = instrumentEl.dataset.lang;
  const context = JSON.parse(instrumentEl.dataset.context);

  ReactDOM.render(
    <InstrumentFormContainer
      instrument={instrument}
      initialData={initialData}
      lang={lang}
      context={context}
      onSave={onSave}
      options={{}}
    />,
    document.getElementById("container")
  );
};
