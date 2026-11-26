import {FormModal} from 'jsx/Modal';
import {useState} from 'react';
import {TextboxElement, FieldsetElement} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

/**
 * Render a modal window for naming a query
 *
 * @param props - React props
 * @param props.QueryID - The QueryID being modified
 * @param props.defaultName - The default name to show before edited by the user
 * @param props.closeModal - A callback to close the modal
 * @param props.onSubmit - A callback to call on submit
 * @returns - the query modal element
 */
function NameQueryModal(props: {
    QueryID: number,
    defaultName: string,
    closeModal: () => void,
    onSubmit: (name: string) => void,
}) {
  const {t} = useTranslation('dataquery');
  const [queryName, setQueryName] = useState<string>(props.defaultName || '');
  /**
   * Convert the onSubmit callback function to a promise expected by Modal
   *
   * @returns - The submit promise
   */
  const submitPromise = (): Promise<string|void> => {
    const sbmt = new Promise<string>((resolve, reject) => {
      if (queryName == '') {
        reject(new Error(t('Must provide a query name.', {ns: 'dataquery'})));
        return;
      }
      resolve(queryName);
    });
    if (props.onSubmit) {
      return sbmt.then(props.onSubmit);
    }
    return sbmt;
  };
  return <FormModal title={t('Name Query', {ns: 'dataquery'})}
    show={true}
    throwWarning={true}
    onClose={props.closeModal}
    onSubmit={submitPromise}>
    <FieldsetElement
      legend={t('Query name', {ns: 'dataquery'})}>
      <TextboxElement name='queryname'
        value={queryName}
        placeholder={t('Enter your query name', {ns: 'dataquery'})}
        onUserInput={
          (name: string, value: string) => setQueryName(value)
        }
      />
    </FieldsetElement>
  </FormModal>;
}

export default NameQueryModal;
