import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {withTranslation} from 'react-i18next';

import {
  FormElement,
  TextboxElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Form for adding a candidate identifier.
 *
 * @param {object} props Component properties
 * @return {object} React component
 */
function AddIdentifierForm(props) {
  const {t} = props;

  const [values, setValues] = useState({
    CandID: '',
    CandidateIdentifierTypeID: '',
    Value: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const selectedType = props.identifierTypes.find(
    (type) => Number(type.value) === Number(values.CandidateIdentifierTypeID)
  );

  const autoGenerate = selectedType?.autoGenerate ?? false;

  const updateValue = (name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError(null);

    const candid = values.CandID.trim();
    const identifierTypeID = Number(values.CandidateIdentifierTypeID);

    if (!candid || !identifierTypeID) {
      setError('CandID and Identifier Type are required.');
      return;
    }

    const identifier = {
      CandidateIdentifierTypeID: identifierTypeID,
    };

    if (!autoGenerate && values.Value.trim()) {
      identifier.Value = values.Value.trim();
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${loris.BaseURL}/api/v0.0.4-dev/candidates/` +
                `${encodeURIComponent(candid)}/identifiers`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Identifier: identifier,
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
      setError(err.message || 'Unable to add identifier.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormElement
      name="addIdentifier"
      id="form-addIdentifier"
      onSubmit={submit}
    >
      <fieldset>
        <TextboxElement
          label="CandID"
          id="addIdentifier-candid"
          name="CandID"
          value={values.CandID}
          onUserInput={updateValue}
        />

        <SelectElement
          label={t('Identifier Type', {ns: 'candidate_identifiers'})}
          id="addIdentifier-type"
          name="CandidateIdentifierTypeID"
          value={values.CandidateIdentifierTypeID}
          onUserInput={updateValue}
          options={Object.fromEntries(
            props.identifierTypes.map((type) => [type.value, type.label])
          )}
          emptyOption={true}
          autoSelect={false}
        />

        {selectedType && !autoGenerate && (
          <TextboxElement
            label={t('Identifier Value', {ns: 'candidate_identifiers'})}
            id="addIdentifier-value"
            name="Value"
            value={values.Value}
            onUserInput={updateValue}
          />
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <ButtonElement
          label={saving
            ? t('Saving', {ns: 'loris'})
            : t('Save', {ns: 'loris'})}
          id="save-candidate-identifier"
          type="submit"
          disabled={saving}
          onUserInput={submit}
        />
      </fieldset>
    </FormElement>
  );
}

AddIdentifierForm.propTypes = {
  identifierTypes: PropTypes.array.isRequired,
  onSuccess: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(AddIdentifierForm);
