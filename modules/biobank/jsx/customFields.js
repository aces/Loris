import React from 'react';
import PropTypes from 'prop-types';
import {
  TextboxElement,
  DateElement,
  TimeElement,
  CheckboxElement,
  FileElement,
} from 'jsx/Form';

/**
 * Biobank Custom Attribute Fields
 *
 * @param {object} props The component's props.
 */
function CustomFields(props) {
  const {options, errors, attributes, object} = props;

  return attributes.map(
    (attribute, key) => {
      const datatype = options.specimen.attributeDatatypes[attribute.datatypeId]
        .datatype;
      if (datatype === 'text' || datatype === 'number') {
        return (
          <TextboxElement
            key={key}
            name={attribute.id}
            label={attribute.label}
            onUserInput={props.setData}
            required={Boolean(attribute.required)}
            value={object[attribute.id]}
            errorMessage={errors[attribute.id]}
          />
        );
      }
      if (datatype === 'date') {
        return (
          <DateElement
            key={key}
            name={attribute.id}
            label={attribute.label}
            onUserInput={props.setData}
            required={Boolean(attribute.required)}
            value={object[attribute.id]}
            errorMessage={errors[attribute.id]}
          />
        );
      }
      if (datatype === 'time') {
        return (
          <TimeElement
            key={key}
            name={attribute.id}
            label={attribute.label}
            onUserInput={props.setData}
            required={Boolean(attribute.required)}
            value={object[attribute.id]}
            errorMessage={errors[attribute.id]}
          />
        );
      }
      if (datatype === 'boolean') {
        return (
          <CheckboxElement
            key={key}
            name={attribute.id}
            label={attribute.label}
            onUserInput={props.setData}
            required={Boolean(attribute.required)}
            value={object[attribute.id]}
            errorMessage={errors[attribute.id]}
          />
        );
      }
      // Do not present the possibility of uploading if file is already set
      // File must instead be deleted or overwritten.
      if (datatype === 'file' && !(props.data||{})[attribute.id]) {
        return (
          <FileElement
            key={key}
            name={attribute.id}
            label={attribute.label}
            onUserInput={props.setData}
            required={Boolean(attribute.required)}
            value={props.current.files[object[attribute.id]]}
            errorMessage={errors[attribute.id]}
          />
        );
      }
    }
  );
}

CustomFields.propTypes = {
  attributes: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

CustomFields.defaultProps = {
  errors: {},
};

export default CustomFields;
