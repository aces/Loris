import Form from './Form';
import { Evaluator } from './lib/Parser';

const { SelectElement, RadioGroupLabels, RadioGroupElement, CheckboxGroupElement, TextboxElement } = Form;

const InstrumentForm = ({instrument, data, context, options, onUpdate, onSave}) => {
  return (
    <div>
      {renderMeta(instrument.Meta)}
      {
        instrument.Elements.filter((element, index) => {
          if (options.surveyMode && element.HiddenSurvey) return false;
          if (!element.DisplayIf) return true;
          try {
            return Evaluator(element.DisplayIf, Object.assign({}, data, context));
          }  catch(e) {
            console.error(`Error evaluating DisplayIf property of element ${index} in instrument ${instrument.Meta.ShortName}.`);
            console.log(element.DisplayIf);
            console.log(e.message || e);
            return false;
          }
        }).map((element, index) => (
          renderElement(element, index, data, onUpdate)
        ))
      }
    </div>
  );
};

// TODO: propTypes
function renderMeta(meta) {
  return (
    <div className="title">
      <h1>{meta.LongName}</h1>
    </div>
  )

}

function renderElement(element, key, data, onUpdate, context = array()) {
  if (element.Type === 'label') {
    return renderLabel(element, key)
  } else if (element.Type === 'radio-labels') {
    return renderRadioLabels(element, key)
  } else if (element.Type === 'radio') {
    return renderRadio(element, data[element.Name], key, onUpdate)
  } else if (element.Type === 'select') {
    return renderSelect(element, data[element.Name], key, onUpdate)
  } else if (element.Type === 'checkbox') {
    return renderCheckbox(element, data[element.Name], key, onUpdate)
  } else if (element.Type === 'text') {
    return renderText(element, data[element.Name], key, onUpdate)
  } else if (element.Type === 'calc') {
    return renderCalc(element, data[element.Name], key, onUpdate, context)
  }
}

function renderLabel(labelEl, key) {
  // Form's StaticElement doesn't allow us to set HTML.
  return (<div className="instrument-label" key={key} dangerouslySetInnerHTML={{__html: labelEl.Description}} />);
}

function renderRadioLabels(radioLabelsEl, key) {
  return (
    <RadioGroupLabels key={key} labels={radioLabelsEl.Labels}/>
  );
}

function renderRadio(radioEl, value, key, onUpdate) {
  return (
    <RadioGroupElement
      key={key}
      name={radioEl.Name}
      label={radioEl.Description}
      options={radioEl.Options.Values}
      orientation={radioEl.Options.Orientation}
      onUserInput={onUpdate}
      value={value}
    />
  );
}

function renderSelect(selectEl, value, key, onUpdate) {
  if (selectEl.Options.AllowMultiple) {
    <p>MultiSelects not implemented yet</p>
  } else {
    return (
      <SelectElement
        key={key}
        name={selectEl.Name}
        label={selectEl.Description}
        options={selectEl.Options.Values}
        onUserInput={onUpdate}
        value={value}
      />
    );
  }
}

function renderCheckbox(selectEl, value, key, onUpdate) {
  return (
    <CheckboxGroupElement
      key={key}
      name={selectEl.Name}
      label={selectEl.Description}
      options={selectEl.Options.Values}
      onUserInput={onUpdate}
      value={value}
    />
  );
}

function renderText(textEl, value, key, onUpdate) {
  return (
    <TextboxElement
      key={key}
      name={textEl.Name}
      label={textEl.Description}
      onUserInput={onUpdate}
      value={value}
    />
  );
}

function renderCalc(calcEl, value, key, onUpdate, context) {
    return {
      <TextboxElement
        key={key}
        name={calcEl.Name}
        label={calcEl.Description}
        value={Evaluator(calcEl.Formula, context)}
      />
}
export default InstrumentForm;
