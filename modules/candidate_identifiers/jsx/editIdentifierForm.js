import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {withTranslation} from 'react-i18next';

import {
  FormElement,
  TextboxElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Form for editing an existing candidate identifier.
 *
 * @param {object} props Component properties
 * @return {object} React component
 */
function EditIdentifierForm(props) {
  const {t} = props;

  const [values, setValues] = useState({
    Value: props.identifier.IdentifierValue || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const editingDisabled = props.identifier.IdentifierType === 'PSCID';

  const updateValue = (name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (saving || editingDisabled) {
      return;
    }

    setError(null);

    const value = values.Value.trim();

    if (!value) {
      setError('Identifier Value is required.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${loris.BaseURL}/api/v0.0.4-dev/candidates/` +
        `${encodeURIComponent(props.identifier.CandID)}/identifiers`,
        {
          method: 'PUT',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Identifier: {
              CandidateIdentifierID: Number(
                props.identifier.CandidateIdentifierID
              ),
              CandidateIdentifierTypeID: Number(
                props.identifier.CandidateIdentifierTypeID
              ),
              Value: value,
            },
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();

        throw new Error(
          result.error || `Request failed (${response.status})`
        );
      }

      props.onSuccess();
    } catch (err) {
      setError(err.message || 'Unable to update identifier.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormElement
      name="editIdentifier"
      id="form-editIdentifier"
      onSubmit={submit}
    >
      <fieldset>
        <TextboxElement
          label="CandID"
          id="editIdentifier-candid"
          name="CandID"
          value={props.identifier.CandID}
          disabled={true}
        />

        <TextboxElement
          label={t('Identifier Type', {ns: 'candidate_identifiers'})}
          id="editIdentifier-type"
          name="IdentifierType"
          value={props.identifier.IdentifierType}
          disabled={true}
        />

        <TextboxElement
          label={t('Identifier Value', {ns: 'candidate_identifiers'})}
          id="editIdentifier-value"
          name="Value"
          value={values.Value}
          onUserInput={updateValue}
          disabled={editingDisabled}
        />

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <ButtonElement
          label={saving ? 'Saving...' : 'Save'}
          id="save-edited-candidate-identifier"
          type="submit"
          disabled={saving || editingDisabled}
          onUserInput={submit}
        />
      </fieldset>
    </FormElement>
  );
}

EditIdentifierForm.propTypes = {
  identifier: PropTypes.object.isRequired,
  identifierTypes: PropTypes.array.isRequired,
  onSuccess: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(EditIdentifierForm);
