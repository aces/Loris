import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  FormElement,
  StaticElement,
  TextboxElement,
  TextareaElement,
  ButtonElement,
  CheckboxElement,
} from 'jsx/Form';

/**
 * Roles Form
 *
 * Module component rendering `New role` or `Edit` role buttons
 *
 * @author Regis Ongaro-Carcy
 */
class RolesManagerForm extends Component {
  /**
   * Render function
   *
   * @return {*}
   */
  render() {
    const {
      role,
      setRole,
      add,
      errors,
      handleSubmit,
      hasPermission,
    } = this.props;

    // Inform users about duplicate entries
    const renderHelpText = () => {
      if (add) {
        return (
          <span>
            You cannot add a duplicated role (unique "Code" value).<br/>
            The "Code" will be generated based on the "Name" you write.<br/>
          </span>
        );
      } else {
        // edit
        return (
          <span>
            Editing an entry will alter the current entry.<br/>
            The "Code" will remain the same as the first entered (unique).<br/>
          </span>
        );
      }
    };

    const renderPermissionsText = () => {
      return (<span>
        Check permissions applicable to this role.<br/>
      </span>);
    };

    // --------------------------------------
    // Render

    return (
      <FormElement
        name='roles_form'
        onSubmit={handleSubmit}
      >
        <StaticElement
          label='Note'
          text={renderHelpText()}
        />

        <StaticElement
          name='Code'
          label='Code'
          text={role.Code}
          value={role.Code}
        />
        <TextboxElement
          name='Name'
          label='Name'
          placeHolder='Role name'
          onUserInput={setRole}
          required={true}
          value={role.Name}
          errorMessage={errors.Name}
          hasError={errors.Name}
        />
        <TextareaElement
          name='Description'
          label='Description'
          placeHolder='Role description'
          onUserInput={setRole}
          required={true}
          value={role.Description}
          errorMessage={errors.Description}
          hasError={errors.Description}
        />

        {/* permissions checkboxes */}
        <StaticElement
          label='Permissions'
          text={renderPermissionsText()}
        />
        {
          role.permissions.map(function(p) {
            // label
            let permissionLabel = ''
              + (p.moduleName == null ? '' : p.moduleName + ': ')
              + (p.permissionAction == null ? '' : p.permissionAction + ' - ')
              + p.permissionDescription;

            return (
              <CheckboxElement
                key={p.permissionCode}
                name={'permission-' + p.permissionCode}
                label={permissionLabel}
                onUserInput={setRole}
                required={false}
                disabled={!hasPermission('roles_edit')}
                value={((p.hasPermission == null) ? false : p.hasPermission)}
                errorMessage={errors.permissionCode}
                hasError={errors.permissionCode}
              />
            );
          })
        }


        {/* submit */}
        <ButtonElement
          label='Submit'
        />
      </FormElement>
    );
  }
}

RolesManagerForm.propTypes = {
  role: PropTypes.object.isRequired,
  setRole: PropTypes.func.isRequired,
  add: PropTypes.bool,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

export default RolesManagerForm;
