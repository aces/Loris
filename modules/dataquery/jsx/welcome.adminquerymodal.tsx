import Modal from 'jsx/Modal';
import swal from 'sweetalert2';
import {useState} from 'react';
import {CheckboxElement, TextboxElement, FieldsetElement} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

/**
 * Render a modal window for naming a query
 *
 * @param {object} props - React props
 * @param {number} props.QueryID - The QueryID being modified
 * @param {string} props.defaultName - The default name to show before edited by the user
 * @param {function} props.closeModal - A callback to close the modal
 * @param {function} props.onSubmit - A callback to call on submit
 * @returns {React.ReactElement} - The modal
 */
function AdminQueryModal(props: {
    QueryID: number,
    defaultName: string,
    closeModal: () => void,
    onSubmit: (
      name: string,
      topQuery: boolean,
      dashboardQuery: boolean,
      loginQuery: boolean,
    )
        => void,
}) {
  const {t} = useTranslation('dataquery');
  const [queryName, setQueryName] = useState(props.defaultName || '');
  const [topQuery, setTopQuery] = useState(true);
  const [dashboardQuery, setDashboardQuery] = useState(true);
  const [loginQuery, setLoginQuery] = useState(true);
  /**
   * Convert the onSubmit callback to a promise function of the format
   * expected by jsx/Modal.
   *
   * @returns {Promise<any>} - The promise
   */
  const submitPromise = () => {
    let sbmt: Promise<any> = new Promise((resolve, reject) => {
      if (queryName.trim() == '') {
        swal.fire({
          type: 'error',
          text: t('Must provide a query name to pin query as.',
            {ns: 'dataquery'}),
        });
        reject();
        return;
      }
      if (!topQuery && !dashboardQuery && !loginQuery) {
        swal.fire({
          type: 'error',
          text: t('Must pin as study query, to dashboard, or to the '
            +'login page.', {ns: 'dataquery'}),
        });
        reject();
        return;
      }
      resolve([queryName.trim(), topQuery, dashboardQuery, loginQuery]);
    });
    if (props.onSubmit) {
      sbmt = sbmt.then((val: [string, boolean, boolean, boolean]) => {
        const [name, topq, dashq, loginq] = val;
        props.onSubmit(name, topq, dashq, loginq);
      });
    }
    return sbmt;
  };
  return <Modal title={t('Pin Top Query', {ns: 'dataquery'})}
    show={true}
    throwWarning={true}
    onClose={props.closeModal}
    onSubmit={submitPromise}>
    <FieldsetElement
      legend={t('Study Query', {ns: 'dataquery', count: 1})}>
      <TextboxElement name='queryname'
        value={queryName}
        placeholder={t('Query name', {ns: 'dataquery'})}
        onUserInput={
          (name: string, value: string) => setQueryName(value)
        }
      />
      <CheckboxElement name='topquery'
        value={topQuery}
        onUserInput={
          (name: string, value: boolean) => setTopQuery(value)
        }
        label={t('Pin Study Query', {ns: 'dataquery'})}
      />
      <CheckboxElement name='dashboardquery'
        value={dashboardQuery}
        label={t('Pin Dashboard Summary', {ns: 'dataquery'})}
        onUserInput={
          (name: string, value: boolean) =>
            setDashboardQuery(value)
        }
      />
      <CheckboxElement name='loginpage'
        value={loginQuery}
        label={t('Pin To Login Page', {ns: 'dataquery'})}
        onUserInput={
          (name: string, value: boolean) =>
            setLoginQuery(value)
        }
      />
    </FieldsetElement>
  </Modal>;
}

export default AdminQueryModal;
