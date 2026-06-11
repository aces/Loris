import Modal from 'jsx/Modal';
import swal from 'sweetalert2';
import {useState} from 'react';
import {TextboxElement, FieldsetElement} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

/**
 * Render a modal window for naming a query
 *
 * @param {object} props - React props
 * @param {number} props.QueryID - The QueryID being modified
 * @param {string} props.defaultName - The default name to show before edited by the user
 * @param {function} props.closeModal - A callback to close the modal
 * @param {function} props.onSubmit - A callback to call on submit
 * @returns {React.ReactElement} - the query modal element
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
   * @returns {Promise<any>} - The submit promise
   */
  const submitPromise = (): Promise<string|void> => {
    const sbmt = new Promise<string>((resolve, reject) => {
      if (queryName == '') {
        swal.fire({
          type: 'error',
          text: t('Must provide a query name.', {ns: 'dataquery'}),
        });
        reject();
        return;
      }
      resolve(queryName);
    });
    if (props.onSubmit) {
      return sbmt.then(props.onSubmit);
    }
    return sbmt;
  };
  return <Modal title={t('Name Query', {ns: 'dataquery'})}
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
  </Modal>;
}

export default NameQueryModal;
