/**
 * This file contains React component for FilterForm
 *
 * @author Loris Team
 * @version 1.1.0
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * FilterForm component.
 * A wrapper for form elements inside a selection filter.
 *
 * Adds necessary filter callbacks to all children and passes them to FormElement
 * for proper rendering.
 *
 * Keeps track of filter object and sends it to parent on every update.
 *
 */
class FilterForm extends Component {
  constructor(props) {
    super(props);

    // Bind component instance to custom methods
    this.onElementUpdate = this.onElementUpdate.bind(this);
  }

  /**
   * Sets filter object and querystring to reflect values of input fields
   *
   * @param {string} name - form element type (i.e component name)
   * @param {string} value - the name of the form element
   * @param {string} id
   * @param {string} type
   */
  onElementUpdate(name, value, id, type) {
    const filter = JSON.parse(JSON.stringify(this.props.filter));
    const exactMatch = type === 'textbox' ? false : true;
    if (value === null || value === '') {
      delete filter[name];
    } else {
      filter[name] = {};
      filter[name]['value'] = value;
      filter[name]['exactMatch'] = exactMatch;
    }

    this.props.updateFilter(filter);
  }

  render() {
    const formChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(
        child,
        {
          ...child.props,
          value: (this.props.filter[child.props.name]||{}).value,
          onUserInput: this.onElementUpdate,
          key: child.props.name,
        },
      );
    });

    return (
      <Panel
        id={this.props.id}
        height={this.props.height}
        title={this.props.title}
      >
        <FormElement {...this.props}>
          {formChildren}
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

FilterForm.defaultProps = {
  height: '100%',
  title: 'Selection Filter',
  clearFilter: function() {
    console.warn('onUpdate() callback is not set!');
  },
};
FilterForm.propTypes = {
  filter: PropTypes.object.isRequired,
  clearFilter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  height: PropTypes.string,
  title: PropTypes.string,
};

export default FilterForm;
