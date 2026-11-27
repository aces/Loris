import React, {useState} from 'react';

import {
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import {Errors} from 'jslib';

import {
  FormElement,
  TextboxElement,
  ButtonElement,
} from 'jsx/Form';

import {client} from 'jslib/http';

type CandidateIdentifier = {
  CandID: string;
  CandidateIdentifierID: number | string;
  CandidateIdentifierTypeID: number | string;
  IdentifierType: string;
  IdentifierValue: string;
};

type EditIdentifierFormProps = {
  identifier: CandidateIdentifier;
  onSuccess: () => void;
  t: WithTranslation['t'];
};

/**
 * Form for editing an existing candidate identifier.
 *
 * @param props Component properties
 * @return React component
 */
function EditIdentifierForm(props: EditIdentifierFormProps) {
  const {t} = props;

  const [values, setValues] = useState({
    Value: props.identifier.IdentifierValue || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingDisabled = props.identifier.IdentifierType === 'PSCID';

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
   * Submit the form to update a candidate identifier.
   *
   * @param event Submit event
   */
  const submit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (saving || editingDisabled) {
      return;
    }

    setError(null);

    const value = values.Value.trim();

    if (!value) {
      setError(
        t('Identifier Value is required.', {ns: 'candidate_identifiers'})
      );
      return;
    }

    setSaving(true);

    try {
      await client.put(
        `api/v0.0.4-dev/candidates/` +
        `${encodeURIComponent(props.identifier.CandID)}/identifiers`,
        {
          Identifier: {
            CandidateIdentifierID: Number(
              props.identifier.CandidateIdentifierID
            ),
            CandidateIdentifierTypeID: Number(
              props.identifier.CandidateIdentifierTypeID
            ),
            Value: value,
          },
        }
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
        setError(t('Identifier or candidate not found.', {
          ns: 'candidate_identifiers',
        }));
        break;
      default:
        setError(t('Unable to update identifier.', {
          ns: 'candidate_identifiers',
        }));
      }
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
          onUserInput={() => undefined}
        />

        <TextboxElement
          label={t('Identifier Type', {ns: 'candidate_identifiers'})}
          id="editIdentifier-type"
          name="IdentifierType"
          value={props.identifier.IdentifierType}
          disabled={true}
          onUserInput={() => undefined}
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
          label={saving
            ? t('Saving', {ns: 'loris'})
            : t('Save', {ns: 'loris'})}
          id="save-edited-candidate-identifier"
          type="submit"
          disabled={saving || editingDisabled}
          onUserInput={submit}
        />
      </fieldset>
    </FormElement>
  );
}

export default withTranslation()(EditIdentifierForm);
