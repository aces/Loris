import React, {useState} from 'react';
import PropTypes from 'prop-types';

/*
 * Search Component
 * React wrapper for a searchable dropdown
 */
const SearchableDropdown = (props) => {
  const [currentInput, setCurrentInput] = useState();

  const getKeyFromValue = (value) => {
    const options = props.options;
    return Object.keys(options).find(function(o) {
      return options[o] === value;
    });
  };

  const handleChange = (e) => {
    let value = getKeyFromValue(e.target.value);
    // if not in strict mode and key value is undefined (i.e., not in options prop)
    // set value equal to e.target.value
    if (!props.strictSearch && value === undefined) {
      value = e.target.value;
    }
    setCurrentInput(e.target.value);
    props.onUserInput(props.name, value);
  };

  const handleBlur = (e) => {
    // null out entry if not present in options in strict mode
    if (props.strictSearch) {
      let value = e.target.value;
      let options = props.options;
      if (Object.values(options).indexOf(value) === -1) {
        // empty string out both the hidden value as well as the input text
        setCurrentInput('');
        props.onUserInput(props.name, '');
      }
    }
  };

  let required = props.required ? 'required' : null;
  let disabled = props.disabled ? 'disabled' : null;
  let sortByValue = props.sortByValue;
  let options = props.options;
  let strictMessage = 'Entry must be included in provided list of options.';
  let errorMessage = null;

  // Add error message
  if (props.errorMessage) {
    errorMessage = <span>{props.errorMessage}</span>;
  } else if (props.required && props.value === '') {
    let msg = 'This field is required!';
    msg += (props.strictSearch ? ' ' + strictMessage : '');
    errorMessage = <span>{msg}</span>;
  } else if (props.strictSearch && props.value === '') {
    errorMessage = <span>{strictMessage}</span>;
  }

  // determine value to place into text input
  let value = '';
  // use value in options if valid
  if (props.value !== undefined &&
    Object.keys(options).indexOf(props.value) > -1) {
    value = options[props.value];
    // else, use input text value
  } else if (currentInput) {
    value = currentInput;
  }

  let newOptions = {};
  let optionList = [];
  if (sortByValue) {
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        newOptions[options[key]] = key;
      }
    }
    optionList = Object.keys(newOptions).sort().map(function(option) {
      return (
        <option value={option} key={newOptions[option]}/>
      );
    });
  } else {
    optionList = Object.keys(options).map(function(option) {
      return (
        <option value={options[option]} key={option}/>
      );
    });
  }

  return (
    <>
      <div className='container-fluid'
           style={{margin: '0 auto', maxWidth: '900px'}}>
        <div className='form-group has-feedback'>
          <div className='input-group'>
            <span className='input-group-addon'
                  style={{
                    height: '50px',
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: '25px',
                    borderBottomLeftRadius: '25px',
                  }}
            >
              <span className='glyphicon glyphicon-hand-right'/>
            </span>
            <input type='text'
                   name={props.name + '_input'}
                   value={value}
                   id={props.id}
                   list={props.name + '_list'}
                   className='form-control'
                   disabled={disabled}
                   placeholder={props.placeHolder}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   required={required}
                   autoComplete={'off'}
                   style={{
                     height: '50px',
                     borderLeft: '0',
                     fontSize: '16pt',
                     borderTopRightRadius: '25px',
                     borderBottomRightRadius: '25px',
                   }}
            />
          </div>
        </div>
        <datalist id={props.name + '_list'}>
          {optionList}
        </datalist>
        {errorMessage}
      </div>
    </>
  );
};
SearchableDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  id: PropTypes.string,
  // strictSearch, if set to true, will require that only options
  // provided in the options prop can be submitted
  strictSearch: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  class: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeHolder: PropTypes.string,
  onUserInput: PropTypes.func,
};
SearchableDropdown.defaultProps = {
  name: '',
  options: {},
  strictSearch: true,
  label: '',
  value: undefined,
  id: null,
  class: '',
  disabled: false,
  required: false,
  sortByValue: true,
  errorMessage: '',
  placeHolder: '',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};

export default SearchableDropdown;
