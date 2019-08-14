import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Biobank Custom Attribute Fields
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */

class CustomFields extends Component {
  render() {
    const {attributeDatatypes, attributeOptions, errors, fields, object} = this.props;
    const attributeFields = Object.keys(fields).map((attribute) => {
      const datatype = attributeDatatypes[fields[attribute]['datatypeId']].datatype;
      if (datatype === 'text' || datatype === 'number') {
        if (fields[attribute]['refTableId'] === null) {
          return (
            <TextboxElement
              name={attribute}
              label={fields[attribute].label}
              onUserInput={this.props.setData}
              required={fields[attribute].required}
              value={object[attribute]}
              errorMessage={errors[attribute]}
            />
          );
        }

        if (fields[attribute]['refTableId'] !== null) {
          return (
            <SelectElement
              name={attribute}
              label={fields[attribute].label}
              options={attributeOptions[fields[attribute].refTableId]}
              onUserInput={this.props.setData}
              required={fields[attribute].required}
              value={object[attribute]}
              errorMessage={errors[attribute]}
            />
          );
        }
      }

      if (datatype === 'date') {
        return (
          <DateElement
            name={attribute}
            label={fields[attribute].label}
            onUserInput={this.props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }

      if (datatype === 'time') {
        return (
          <TimeElement
            name={attribute}
            label={fields[attribute].label}
            onUserInput={this.props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }

      if (datatype === 'boolean') {
        object[attribute] == null && this.props.setData(attribute, false);
        return (
          <CheckboxElement
            name={attribute}
            label={fields[attribute].label}
            onUserInput={this.props.setData}
            required={fields[attribute].required}
            value={object[attribute]}
            errorMessage={errors[attribute]}
          />
        );
      }

      // Do not present the possibility of uploading if file is already set
      // File must instead be deleted or overwritten.
      if (datatype === 'file' && !(this.props.data||{})[attribute]) {
        return (
          <FileElement
            name={attribute}
            label={fields[attribute].label}
            onUserInput={this.props.setData}
            required={fields[attribute].required}
            value={this.props.current.files[object[attribute]]}
            errorMessage={errors[attribute]}
          />
        );
      }
    });

    return (
      <div>
        {attributeFields}
      </div>
    );
  }
}

CustomFields.propTypes = {
  fields: PropTypes.object.isRequired,
  attributeDatatypes: PropTypes.object.isRequired,
  attributeOptions: PropTypes.object.isRequired,
  object: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

CustomFields.defaultProps = {
  errors: {},
};

export default CustomFields;
