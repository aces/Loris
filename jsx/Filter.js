import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Filter component.
 * A wrapper for form elements inside a selection filter.
 *
 * Constructs filter fields based on this.props.fields configuration object
 *
 * Alters the filter object and sends it to parent on every update.
 *
 */
class Filter extends Component {
  constructor(props) {
    super(props);
    this.onElementUpdate = this.onElementUpdate.bind(this);
    this.renderFilterFields = this.renderFilterFields.bind(this);
  }

  /**
   * Sets filter object to reflect values of input fields.
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   * @param {string} id - id of the form element
   * @param {string} type - type of the form element
   */
  onElementUpdate(name, value, id, type) {
    const filter = JSON.parse(JSON.stringify(this.props.filter));
    const exactMatch = type === 'textbox' ? false : true;
    if (value === null || value === '') {
      delete filter[name];
    } else {
      filter[name] = {
        value: value,
        exactMatch: exactMatch,
      };
    }

    this.props.updateFilter(filter);
  }

  renderFilterFields() {
    return this.props.fields.map((field) => {
      if (field.hide === true) {
        return null;
      }
      switch (field.type) {
      case 'text':
        return (
          <TextboxElement
            name={field.name}
            key={field.name}
            label={field.label}
            value={(this.props.filter[field.name] || {}).value}
            onUserInput={this.onElementUpdate}
          />
        );
      case 'select':
        return (
          <SelectElement
            name={field.name}
            key={field.name}
            label={field.label}
            value={(this.props.filter[field.name] || {}).value}
            options={field.options}
            onUserInput={this.onElementUpdate}
          />
        );
      }

      return null;
    });
  }

  render() {
    return (
      <Panel
        height={this.props.height}
        title={this.props.title}
      >
        <FormElement
          id={this.props.id}
          name={this.props.name}
          columns={this.props.columns}
        >
          {this.renderFilterFields()}
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.props.clearFilter}
          />
        </FormElement>
      </Panel>
    );
  }
}

Filter.defaultProps = {
  height: '100%',
  title: 'Selection Filter',
  clearFilter: function() {
    console.warn('onUpdate() callback is not set!');
  },
};
Filter.propTypes = {
  filter: PropTypes.object.isRequired,
  clearFilter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  height: PropTypes.string,
  title: PropTypes.string,
};

export default Filter;
