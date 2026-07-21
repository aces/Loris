import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {withTranslation, WithTranslation} from 'react-i18next';
import swal from 'sweetalert2';

import i18n from 'I18nSetup';

import frStrings from '../locale/fr/LC_MESSAGES/user_accounts.json';
import hiStrings from '../locale/hi/LC_MESSAGES/user_accounts.json';
import jaStrings from '../locale/ja/LC_MESSAGES/user_accounts.json';
import zhStrings from '../locale/zh/LC_MESSAGES/user_accounts.json';

declare const loris: {BaseURL: string};

type FieldValue = boolean | string | string[];

type FormField = {
  disabled: boolean,
  label: string,
  multiple: boolean,
  name: string,
  options: Record<string, string> | string[],
  pattern: string | null,
  required: boolean,
  type: string,
  value: unknown,
};

type Permission = {
  checked: boolean,
  label: string,
  name: string,
};

type Supervisor = {
  checked: boolean,
  label: string,
  name: string,
};

type EditUserData = {
  canReject: boolean,
  errors: Record<string, string>,
  fields: Record<string, FormField>,
  hiddenPermissions: Array<number | string>,
  identifier: string,
  isCreating: boolean,
  isSelfEdit: boolean,
  permissions: Record<string, Permission[]>,
  supervisors: Supervisor[],
};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
    userAccountsEditData: EditUserData,
  }
}

type FormFieldProps = {
  companion?: FormFieldProps,
  disabled: boolean,
  error: string,
  field: FormField,
  onChange: (name: string, value: FieldValue) => void,
  required: boolean,
  validationMessage?: string,
  value: FieldValue,
};

type PasswordFieldProps = FormFieldProps;

type EditUserFormProps = WithTranslation & {
  data: EditUserData,
};

const ERROR_KEYS: Record<string, string[]> = {
  UserID: ['UserID', 'UserID_Group'],
  NA_UserID: ['UserID_Group'],
  Password_hash: ['Password', 'Password_hash'],
  __Confirm: ['__Confirm'],
  Email: ['Email'],
  __ConfirmEmail: ['__ConfirmEmail'],
  CenterIDs: ['CenterIDs', 'sites_group'],
  ProjectIDs: ['ProjectIDs', 'projects_group'],
  examiner_sites: ['examiner_sites'],
  examiner_radiologist: ['examiner_group'],
  examiner_pending: ['examiner_pending'],
  active_from: ['active_from', 'active_timeWindows'],
  active_to: ['active_to'],
};

/**
 * Convert server values into values suitable for controlled React inputs.
 *
 * @param {FormField} field Form field definition
 * @return {FieldValue}
 */
function initialFieldValue(field: FormField): FieldValue {
  if (field.type === 'advcheckbox') {
    return field.value === true
      || field.value === 1
      || field.value === '1'
      || field.value === 'on';
  }
  if (field.multiple) {
    if (Array.isArray(field.value)) {
      return field.value.map(String);
    }
    return field.value === null || field.value === undefined
      ? []
      : [String(field.value)];
  }
  return field.value === null || field.value === undefined
    ? ''
    : String(field.value);
}

/**
 * Build the initial value map in form order.
 *
 * @param {Record<string, FormField>} fields Form definitions
 * @return {Record<string, FieldValue>}
 */
function initialValues(
  fields: Record<string, FormField>
): Record<string, FieldValue> {
  return Object.fromEntries(
    Object.entries(fields).map(([name, field]) => [
      name,
      initialFieldValue(field),
    ])
  );
}

/**
 * Return the validation message associated with a field.
 *
 * @param {Record<string, string>} errors Server validation errors
 * @param {string} name Field name
 * @return {string}
 */
function fieldError(
  errors: Record<string, string>,
  name: string
): string {
  const keys = ERROR_KEYS[name] ?? [name];
  for (const key of keys) {
    if (errors[key]) {
      return errors[key];
    }
  }
  return '';
}

/**
 * Password input with the established LORIS visibility toggle.
 *
 * @param {PasswordFieldProps} props Field props
 * @return {React.ReactElement}
 */
function PasswordField(props: PasswordFieldProps): React.ReactElement {
  const [visible, setVisible] = useState(false);
  const value = typeof props.value === 'string' ? props.value : '';

  return (
    <div className={`row form-group${props.error ? ' has-error' : ''}`}>
      <label className="col-sm-2 control-label" htmlFor={props.field.name}>
        {props.field.label}
        {props.required && <span className="text-danger"> *</span>}
      </label>
      <div className="col-sm-3 form-group has-feedback">
        <input
          autoComplete="new-password"
          className="form-control"
          disabled={props.disabled}
          id={props.field.name}
          name={props.field.name}
          onChange={(event) => props.onChange(
            props.field.name,
            event.target.value
          )}
          required={props.required}
          type={visible ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={props.field.label}
          className="form-control-feedback btn btn-link"
          disabled={props.disabled}
          onClick={() => setVisible((current) => !current)}
          style={{marginRight: '15px'}}
          type="button"
        >
          <span
            className={`glyphicon glyphicon-eye-${visible ? 'close' : 'open'}`}
          />
        </button>
        {props.error && <span className="help-block">{props.error}</span>}
      </div>
      {props.companion && <InlineCheckbox {...props.companion} />}
    </div>
  );
}

/**
 * Checkbox displayed beside a related field.
 *
 * @param {FormFieldProps} props Field props
 * @return {React.ReactElement}
 */
function InlineCheckbox(props: FormFieldProps): React.ReactElement {
  return (
    <div className="col-sm-4">
      <label htmlFor={props.field.name}>
        <input
          checked={Boolean(props.value)}
          disabled={props.disabled}
          id={props.field.name}
          name={props.field.name}
          onChange={(event) => props.onChange(
            props.field.name,
            event.target.checked
          )}
          type="checkbox"
          value="on"
        />{' '}
        {props.field.label}
      </label>
    </div>
  );
}

/**
 * Render one edit-user field.
 *
 * @param {FormFieldProps} props Field props
 * @return {React.ReactElement}
 */
function FormFieldRow(props: FormFieldProps): React.ReactElement {
  const field = props.field;

  if (field.type === 'password') {
    return <PasswordField {...props} />;
  }

  if (field.type === 'static') {
    return (
      <div className="row form-group">
        <label className="col-sm-2 control-label">{field.label}</label>
        <div className="col-sm-10 form-control-static">
          {String(props.value || '')}
        </div>
      </div>
    );
  }

  if (field.type === 'advcheckbox') {
    return (
      <div className={`row form-group${props.error ? ' has-error' : ''}`}>
        <div className="col-sm-offset-2 col-sm-10">
          <label htmlFor={field.name}>
            <input
              checked={Boolean(props.value)}
              disabled={props.disabled}
              id={field.name}
              name={field.name}
              onChange={(event) => props.onChange(
                field.name,
                event.target.checked
              )}
              type="checkbox"
              value="on"
            />{' '}
            {field.label}
          </label>
          {props.error && <span className="help-block">{props.error}</span>}
        </div>
      </div>
    );
  }

  let control: React.ReactElement;
  const value = props.value;
  if (field.type === 'select') {
    const options = Object.entries(field.options);
    control = (
      <select
        className="form-control input-sm resizable"
        disabled={props.disabled}
        id={field.name}
        multiple={field.multiple}
        name={field.multiple ? `${field.name}[]` : field.name}
        onChange={(event) => {
          const nextValue = field.multiple
            ? Array.from(event.target.selectedOptions).map(
              (option) => option.value
            )
            : event.target.value;
          props.onChange(field.name, nextValue);
        }}
        required={props.required}
        size={field.multiple
          ? Math.min(Math.max(options.length, 2), 8)
          : undefined}
        value={value as string | string[]}
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>{label}</option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        className="form-control input-sm"
        disabled={props.disabled}
        id={field.name}
        name={field.name}
        onChange={(event) => {
          event.target.setCustomValidity('');
          props.onChange(field.name, event.target.value);
        }}
        onInvalid={(event) => {
          if (props.validationMessage) {
            event.currentTarget.setCustomValidity(props.validationMessage);
          }
        }}
        pattern={field.pattern ?? undefined}
        required={props.required}
        type={field.type === 'date' ? 'date' : 'text'}
        value={typeof value === 'string' ? value : ''}
      />
    );
  }

  return (
    <div className={`row form-group${props.error ? ' has-error' : ''}`}>
      <label className="col-sm-2 control-label" htmlFor={field.name}>
        {field.label}
        {props.required && <span className="text-danger"> *</span>}
      </label>
      <div className={field.type === 'select' ? 'col-sm-10' : 'col-sm-3'}>
        {control}
        {props.error && <span className="help-block">{props.error}</span>}
      </div>
      {props.companion && <InlineCheckbox {...props.companion} />}
    </div>
  );
}

/**
 * React edit-user form.
 *
 * @param {EditUserFormProps} props Component props
 * @return {React.ReactElement}
 */
function EditUserForm(props: EditUserFormProps): React.ReactElement {
  const data = props.data;
  const defaults = initialValues(data.fields);
  const [values, setValues] = useState<Record<string, FieldValue>>(defaults);
  const [permissionValues, setPermissionValues] = useState(
    Object.fromEntries(
      Object.values(data.permissions).flat().map(
        (permission) => [permission.name, permission.checked]
      )
    ) as Record<string, boolean>
  );
  const [supervisorValues, setSupervisorValues] = useState(
    Object.fromEntries(data.supervisors.map(
      (supervisor) => [supervisor.name, supervisor.checked]
    )) as Record<string, boolean>
  );
  const [expandedGroups, setExpandedGroups] = useState(
    new Set(Object.keys(data.permissions))
  );

  const matchUsername = Boolean(values.NA_UserID);
  const generatePassword = Boolean(values.NA_Password);
  const password = String(values.Password_hash ?? '');
  const confirmation = String(values.__Confirm ?? '');

  /**
   * Update a field and apply the two legacy checkbox interactions.
   *
   * @param {string} name Field name
   * @param {FieldValue} value Field value
   */
  const updateField = (name: string, value: FieldValue) => {
    setValues((current) => {
      const next = {...current, [name]: value};
      if (name === 'NA_UserID' && value === true) {
        next.UserID = '';
      }
      if (name === 'NA_Password') {
        next.SendEmail = Boolean(value);
        if (value === true) {
          next.Password_hash = '';
          next.__Confirm = '';
        }
      }
      return next;
    });
  };

  /**
   * Restore the values delivered by the server.
   */
  const resetForm = () => {
    setValues(defaults);
    setPermissionValues(Object.fromEntries(
      Object.values(data.permissions).flat().map(
        (permission) => [permission.name, permission.checked]
      )
    ));
    setSupervisorValues(Object.fromEntries(data.supervisors.map(
      (supervisor) => [supervisor.name, supervisor.checked]
    )));
  };

  /**
   * Reject a pending account through the existing guarded endpoint.
   */
  const rejectUser = () => {
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(`${loris.BaseURL}/user_accounts/ajax/rejectUser.php`, {
      body: new URLSearchParams({identifier: data.identifier}),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST',
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((message) => {
          throw new Error(message);
        });
      }
      window.location.href = `${loris.BaseURL}/user_accounts/`;
    }).catch((error: Error) => {
      void swal.fire({
        text: error.message,
        type: 'error',
      });
    });
  };

  /**
   * Resolve the current state for a named server-defined field.
   *
   * @param {string} name Field name
   * @return {FormFieldProps | null}
   */
  const getFieldProps = (name: string): FormFieldProps | null => {
    const field = data.fields[name];
    if (!field) {
      return null;
    }

    let disabled = data.isSelfEdit || field.disabled;
    let required = field.required;
    if (field.name === 'UserID') {
      disabled = disabled || matchUsername;
      required = required && !matchUsername;
    }
    if (field.name === 'Password_hash') {
      disabled = disabled || generatePassword;
      required = !generatePassword && (required || confirmation !== '');
    }
    if (field.name === '__Confirm') {
      disabled = disabled || generatePassword;
      required = !generatePassword && (required || password !== '');
    }

    let validationMessage: string | undefined;
    if (field.name === 'First_name') {
      validationMessage = props.t(
        'First name is required and should not exceed 120 characters',
        {ns: 'loris'}
      );
    } else if (field.name === 'Last_name') {
      validationMessage = props.t(
        'Last name is required and should not exceed 120 characters',
        {ns: 'loris'}
      );
    }

    return {
      disabled,
      error: fieldError(data.errors, field.name),
      field,
      onChange: updateField,
      required,
      validationMessage,
      value: values[field.name] ?? '',
    };
  };

  /**
   * Render a field in the established edit-user order.
   *
   * @param {string} name Field name
   * @param {string} companionName Related checkbox field name
   * @return {React.ReactElement | null}
   */
  const renderField = (
    name: string,
    companionName?: string
  ): React.ReactElement | null => {
    const fieldProps = getFieldProps(name);
    if (!fieldProps) {
      return null;
    }
    const companion = companionName
      ? getFieldProps(companionName) ?? undefined
      : undefined;
    return (
      <FormFieldRow
        {...fieldProps}
        companion={companion}
        key={name}
      />
    );
  };

  return (
    <form autoComplete="off" method="post" name="edit_user">
      {Object.keys(data.errors).length > 0 && (
        <div className="alert alert-danger" role="alert">
          {props.t(
            'The form you submitted contains data entry errors',
            {ns: 'user_accounts'}
          )}
        </div>
      )}

      <div className="panel panel-default">
        <div className="panel-body">
          <h3>{props.t('Password Rules', {ns: 'loris'})}</h3>
          <ul>
            <li>{props.t(
              'The password must be at least 8 characters long.',
              {ns: 'loris'}
            )}</li>
            <li>{props.t(
              'The password cannot be your username or email address.',
              {ns: 'loris'}
            )}</li>
            <li>{props.t(
              'No special characters are required but your password must be '
                + 'sufficiently complex to be accepted.',
              {ns: 'loris'}
            )}</li>
          </ul>
          <p>{props.t('Please choose a unique password.', {ns: 'loris'})}</p>
          <p>{props.t(
            'We suggest using a password manager to generate one for you.',
            {ns: 'loris'}
          )}</p>
          <h3>{props.t('Notes', {ns: 'user_accounts'})}</h3>
          <ul>
            <li>{props.t(
              'It is recommended to use an email address as the username, '
                + 'for clarity and uniqueness.',
              {ns: 'user_accounts'}
            )}</li>
            <li>{props.t(
              'When generating a new password, please notify the user by '
                + 'checking \'Send email to user\' box below!',
              {ns: 'user_accounts'}
            )}</li>
          </ul>
        </div>
      </div>

      <h3>{props.t('Add/Edit User', {ns: 'user_accounts'})}</h3>
      {data.isSelfEdit && (
        <div className="alert alert-warning" role="alert">
          {props.t(
            'You cannot edit your own account settings',
            {ns: 'user_accounts'}
          )}.{' '}
          {props.t(
            'To change your email or password, go to "My Preferences"',
            {ns: 'user_accounts'}
          )}.{' '}
          {props.t(
            'For any other changes, contact an administrator',
            {ns: 'user_accounts'}
          )}.
        </div>
      )}

      <fieldset disabled={data.isSelfEdit}>
        {renderField('UserID', data.isCreating ? 'NA_UserID' : undefined)}
        {renderField('Password_hash', 'NA_Password')}
        {renderField('__Confirm')}
        {renderField('First_name')}
        {renderField('Last_name')}
        {renderField('Degree')}
        {renderField('Position_title')}
        {renderField('Institution')}
        {renderField('Department')}
        {renderField('Address')}
        {renderField('City')}
        {renderField('State')}
        {renderField('Zip_code')}
        {renderField('Country')}
        {renderField('Fax')}
        {renderField('Email', 'SendEmail')}
        {renderField('__ConfirmEmail')}
        {renderField('CenterIDs')}
        {renderField('ProjectIDs')}
        {renderField('examiner_sites')}
        {renderField('examiner_radiologist')}
        {renderField('examiner_pending')}
        {renderField('Active')}
        {renderField('active_from')}
        {renderField('active_to')}
        {renderField('account_request_date')}
        {renderField('Pending_approval')}

        <div className="row form-group">
          <label className="col-sm-2 control-label">
            {props.t('Permissions', {ns: 'user_accounts'})}
          </label>
          <div className="col-sm-10">
            {Object.entries(data.permissions).map(([type, permissions]) => {
              const expanded = expandedGroups.has(type);
              return (
                <div className="panel panel-default" key={type}>
                  <button
                    aria-expanded={expanded}
                    className="panel-heading btn btn-link btn-block"
                    onClick={() => setExpandedGroups((current) => {
                      const next = new Set(current);
                      if (next.has(type)) {
                        next.delete(type);
                      } else {
                        next.add(type);
                      }
                      return next;
                    })}
                    type="button"
                  >
                    {type}
                  </button>
                  <div className="panel-body" hidden={!expanded}>
                    {permissions.map((permission) => (
                      <div className="checkbox" key={permission.name}>
                        <label>
                          <input
                            checked={Boolean(
                              permissionValues[permission.name]
                            )}
                            name={permission.name}
                            onChange={(event) => setPermissionValues(
                              (current) => ({
                                ...current,
                                [permission.name]: event.target.checked,
                              })
                            )}
                            type="checkbox"
                            value="on"
                          />{' '}
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="row form-group">
          <label className="col-sm-2 control-label">
            {props.t('Supervisors', {ns: 'user_accounts'})}
          </label>
          <div className="col-sm-10">
            {data.supervisors.map((supervisor) => (
              <div className="checkbox" key={supervisor.name}>
                <label>
                  <input
                    checked={Boolean(supervisorValues[supervisor.name])}
                    name={supervisor.name}
                    onChange={(event) => setSupervisorValues((current) => ({
                      ...current,
                      [supervisor.name]: event.target.checked,
                    }))}
                    type="checkbox"
                    value="on"
                  />{' '}
                  {supervisor.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {data.hiddenPermissions.map((permissionID) => (
          <input
            key={permissionID}
            name={`permID[${permissionID}]`}
            type="hidden"
            value="1"
          />
        ))}
        <input name="identifier" type="hidden" value={data.identifier} />
      </fieldset>

      <div className="row form-group">
        <div className="col-sm-2">
          <button
            className="btn btn-sm btn-primary"
            disabled={data.isSelfEdit}
            name="fire_away"
            type="submit"
            value="Save"
          >
            {props.t('Save', {ns: 'loris'})}
          </button>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={resetForm}
            type="button"
          >
            {props.t('Reset', {ns: 'loris'})}
          </button>
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              window.location.href = `${loris.BaseURL}/user_accounts/`;
            }}
            type="button"
          >
            {props.t('Back', {ns: 'loris'})}
          </button>
        </div>
        {data.canReject && (
          <div className="col-sm-2">
            <button
              className="btn btn-sm btn-primary"
              id="btn_reject"
              onClick={rejectUser}
              type="button"
            >
              {props.t('Reject User', {ns: 'user_accounts'})}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('fr', 'user_accounts', frStrings);
  i18n.addResourceBundle('hi', 'user_accounts', hiStrings);
  i18n.addResourceBundle('ja', 'user_accounts', jaStrings);
  i18n.addResourceBundle('zh', 'user_accounts', zhStrings);

  const workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }

  const Form = withTranslation(['user_accounts', 'loris'])(EditUserForm);
  createRoot(workspace).render(
    <Form data={window.userAccountsEditData} />
  );
});

export default withTranslation(['user_accounts', 'loris'])(EditUserForm);
