import React from 'react';
import PropTypes from 'prop-types';

/**
 * Biobank Custom Attribute Fields
 *
 * @param {object} props The component's props.
 */
function CustomFields(props) {
  const {options, errors, fields, object} = props;

  return Object.keys(fields).map(
    (attribute, key) => {
      const datatype = options.specimen.attributeDatatypes[
        fields[attribute]['datatypeId']
      ].datatype;
      if (datatype === 'text' || datatype === 'number') {
        return (
          <TextboxElement
            key={key}
            name={attribute}
            label={fields[attribute].label}
            onUserInput={props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }
      if (datatype === 'date') {
        return (
          <DateElement
            key={key}
            name={attribute}
            label={fields[attribute].label}
            onUserInput={props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }
      if (datatype === 'time') {
        return (
          <TimeElement
            key={key}
            name={attribute}
            label={fields[attribute].label}
            onUserInput={props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }
      if (datatype === 'boolean') {
        // TODO: delete the following line.
        // object[attribute] == null && props.setData(attribute, false);
        return (
          <CheckboxElement
            key={key}
            name={attribute}
            label={fields[attribute].label}
            onUserInput={props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }
      // Do not present the possibility of uploading if file is already set
      // File must instead be deleted or overwritten.
      if (datatype === 'file' && !(props.data||{})[attribute]) {
        return (
          <FileElement
            key={key}
            name={attribute}
            label={fields[attribute].label}
            onUserInput={props.setData}
            required={fields[attribute].required}
            value={props.current.files[object[attribute]]}
            errorMessage={errors[attribute]}
          />
        );
      }
    }
  );
}

CustomFields.propTypes = {
  fields: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

CustomFields.defaultProps = {
  errors: {},
};

export default CustomFields;
