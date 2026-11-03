import React, {useState} from 'react';

import {
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import {Errors} from 'jslib';

import {
  FormElement,
  TextboxElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';

import {client} from 'jslib/http';

type IdentifierType = {
  value: string | number;
  label: string;
  autoGenerate?: boolean;
};

type AddIdentifierFormProps = {
  identifierTypes: IdentifierType[];
  onSuccess: () => void;
  t: WithTranslation['t'];
};

/**
 * Form for adding a candidate identifier.
 *
 * @param props Component properties
 * @return React component
 */
function AddIdentifierForm(props: AddIdentifierFormProps) {
  const {t} = props;

  const [values, setValues] = useState({
    CandID: '',
    CandidateIdentifierTypeID: '',
    Value: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedType = props.identifierTypes.find(
    (type) => Number(type.value) === Number(values.CandidateIdentifierTypeID)
  );

  const autoGenerate = selectedType?.autoGenerate ?? false;

  /**
   * Update a form field.
   *
   * @param name Field name
   * @param value New value
   */
  const updateValue = (name: string, value: string) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /**
   * Submit the form to add a candidate identifier.
   *
   * @param event Submit event
   */
  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError(null);

    const candid = values.CandID.trim();
    const identifierTypeID = Number(values.CandidateIdentifierTypeID);

    if (!candid || !identifierTypeID) {
      setError(
        t('CandID and Identifier Type are required.',
          {ns: 'candidate_identifiers'})
      );
      return;
    }

    const identifier: {
      CandidateIdentifierTypeID: number;
      Value?: string;
    } = {
      CandidateIdentifierTypeID: identifierTypeID,
    };

    if (!autoGenerate && values.Value.trim()) {
      identifier.Value = values.Value.trim();
    }

    setSaving(true);

    try {
      await client.post(
        `api/v0.0.4-dev/candidates/${encodeURIComponent(candid)}/identifiers`,
        {Identifier: identifier}
      );

      props.onSuccess();
    } catch (err) {
      const status = err instanceof Errors.ApiResponse
        ? err.response?.status
        : undefined;

      switch (status) {
      case 400:
        setError(t('Invalid or duplicate identifier value.', {
          ns: 'candidate_identifiers',
        }));
        break;
      case 403:
        setError(t('Permission denied.', {
          ns: 'candidate_identifiers',
        }));
        break;
      case 404:
        setError(t('Candidate not found.', {
          ns: 'candidate_identifiers',
        }));
        break;
      default:
        setError(t('Unable to add identifier.', {
          ns: 'candidate_identifiers',
        }));
      }
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

export default withTranslation()(AddIdentifierForm);
