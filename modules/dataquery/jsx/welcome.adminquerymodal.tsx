import Modal from 'jsx/Modal';
import swal from 'sweetalert2';
import {useState} from 'react';
import {CheckboxElement, TextboxElement, FieldsetElement} from 'jsx/Form';

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
          text: 'Must provide a query name to pin query as.',
        });
        reject();
        return;
      }
      if (!topQuery && !dashboardQuery && !loginQuery) {
        swal.fire({
          type: 'error',
          text: 'Must pin as study query, to dashboard, or to the login page.',
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
  return <Modal title="Pin Top Query"
    show={true}
    throwWarning={true}
    onClose={props.closeModal}
    onSubmit={submitPromise}>
    <FieldsetElement
      legend='Study Query'>
      <TextboxElement name='queryname'
        value={queryName}
        placeholder="Query name"
        onUserInput={
          (name: string, value: string) => setQueryName(value)
        }
      />
      <CheckboxElement name='topquery'
        value={topQuery}
        onUserInput={
          (name: string, value: boolean) => setTopQuery(value)
        }
        label='Pin Study Query'
      />
      <CheckboxElement name='dashboardquery'
        value={dashboardQuery}
        label='Pin Dashboard Summary'
        onUserInput={
          (name: string, value: boolean) =>
            setDashboardQuery(value)
        }
      />
      <CheckboxElement name='loginpage'
        value={loginQuery}
        label='Pin To Login Page'
        onUserInput={
          (name: string, value: boolean) =>
            setLoginQuery(value)
        }
      />
    </FieldsetElement>
  </Modal>;
}

export default AdminQueryModal;
