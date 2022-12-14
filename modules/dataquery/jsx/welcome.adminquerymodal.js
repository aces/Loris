import Modal from 'jsx/Modal';
import swal from 'sweetalert2';
import {useState} from 'react';

/**
 * Render a modal window for naming a query
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function AdminQueryModal(props) {
    const [queryName, setQueryName] = useState(props.defaultName || '');
    const [topQuery, setTopQuery] = useState(true);
    const [dashboardQuery, setDashboardQuery] = useState(true);
    const submitPromise = () => {
        let sbmt = new Promise((resolve, reject) => {
           if (queryName == '') {
               swal.fire({
                   type: 'error',
                   text: 'Must provide a query name to pin query as.',
               });
               reject();
               return;
           }
           if (!topQuery && !dashboardQuery) {
               swal.fire({
                   type: 'error',
                   text: 'Must pin as study query or pin to dashboard.',
               });
               reject();
               return;
           }
           resolve([queryName, topQuery, dashboardQuery]);
        });
        if (props.onSubmit) {
            sbmt = sbmt.then((val) => {
                const [name, topq, dashq] = val;
                props.onSubmit(name, topq, dashq);
            });
        }
        return sbmt;
    };
    return <Modal title="Pin Top Query"
       show={true}
       throwWarning={true}
       onClose={() => {}}
       onCancel={props.closeModal}
       onSubmit={submitPromise}>
            <form style={{width: '100%', padding: '1em'}}>
                <FieldsetElement
                    legend='Study Query'>
                    <TextboxElement name='queryname'
                        value={queryName}
                        onUserInput={(name, value) => setQueryName(value)}
                        />
                    <CheckboxElement name='topquery'
                        value={topQuery}
                        onUserInput={(name, value) => setTopQuery(value)}
                        label='Pin Study Query'
                        />
                    <CheckboxElement name='dashboardquery'
                        value={dashboardQuery}
                        label='Pin Dashboard Summary'
                        onUserInput={(name, value) => setDashboardQuery(value)}
                        />
                </FieldsetElement>
            </form>
    </Modal>;
}

export default AdminQueryModal;
