import Form from './Form';

const { SelectElement, RadioGroupLabels, RadioGroupElement, CheckboxGroupElement, TextboxElement, DateElement } = Form;

/* InstrumentForm and InstrumentFormContainer follow the `presentational vs container`
 * pattern (https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). 
 * The meta and elements passed to this component must already be 'localized' 
 * (see ./lib/localize-instrument).
 */
const InstrumentForm = ({meta, elements, showRequired, errorMessage, onUpdate, onSave, saveText, saveWarning}) => {
  return (
    <div>
      <div id="instrument-error">
        { errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null }
      </div>
      {renderMeta(meta)}
      {
        elements.map((element, index) => (
          renderElement(element, index, onUpdate, showRequired && element.Options.RequireResponse)
        ))
      }
      <SaveButton onClick={onSave} saveText={saveText} saveWarning={saveWarning}/>
    </div>
  );
};

function renderMeta(meta) {
  return (
    <div className="title">
      <h1>{meta.LongName}</h1>
    </div>
  )
}

function renderElement(element, key, onUpdate, required = false) {
  if (element.Type === 'label') {
    return renderLabel(element, key)
  } else if (element.Type === 'radio-labels') {
    return renderRadioLabels(element, key)
  } else if (element.Type === 'radio') {
    return renderRadio(element, key, onUpdate, required)
  } else if (element.Type === 'select') {
    return renderSelect(element, key, onUpdate, required)
  } else if (element.Type === 'checkbox') {
    return renderCheckbox(element, key, onUpdate, required)
  } else if (element.Type === 'text') {
    return renderText(element, key, onUpdate, required)
  } else if (element.Type === 'calc') {
    return renderCalc(element, key, onUpdate)
  } else if (element.Type === 'date') {
    return renderDate(element, key, onUpdate, required)
  }
}

function renderLabel(element, key) {
  // Form's StaticElement doesn't allow us to set HTML.
  return (<div className="instrument-label" key={key} dangerouslySetInnerHTML={{__html: element.Description}} />);
}

function renderRadioLabels(element, key) {
  return (
    <RadioGroupLabels key={key} labels={element.Labels}/>
  );
}

function renderRadio(element, key, onUpdate, isRequired) {
  return (
      <RadioGroupElement
        key={key}
        name={element.Name}
        label={element.Description}
        options={element.Options.Values}
        orientation={element.Options.Orientation}
        onUserInput={onUpdate}
        value={element.Value}
        hasError={isRequired && (!element.Value)}
        errorMessage="This field is required"
      />
  );
}

function renderSelect(element, key, onUpdate, isRequired) {
  if (element.Options.AllowMultiple) {
    <p>MultiSelects not implemented yet</p>
  } else {
    return (
      <SelectElement
        key={key}
        name={element.Name}
        label={element.Description}
        options={element.Options.Values}
        onUserInput={onUpdate}
        value={element.Value}
      />
    );
  }
}

function renderCheckbox(element, key, onUpdate, isRequired) {
  return (
    <CheckboxGroupElement
      key={key}
      name={element.Name}
      label={element.Description}
      options={element.Options.Values}
      onUserInput={onUpdate}
      value={element.Value}
    />
  );
}

function renderText(element, key, onUpdate, isRequired) {
  return (
    <TextboxElement
      key={key}
      name={element.Name}
      label={element.Description}
      onUserInput={onUpdate}
      value={element.Value}
    />
  );
}

function renderCalc(element, key, onUpdate) {
  return (
    <TextboxElement
      key={key}
      name={element.Name}
      label={element.Description}
      value={element.Value}
      disabled={true}
    />
  );
}

function renderDate(element, key, onUpdate, isRequired) {
  return (
    <DateElement
      key={key}
      name={element.Name}
      label={element.Description}
      onUserInput={onUpdate}
      value={element.Value}
    />
  )
}

const SaveButton = ({onClick, saveText, saveWarning}) => {
  return (
    <div>
      <button onClick={onClick} id="save" type="button" className="btn btn-default btn-lg">
        <span className="" aria-hidden="true"></span> {saveText}
      </button>
      <p id="warning"><center>{saveWarning}</center></p>
    </div>
  );
}

export default InstrumentForm;
