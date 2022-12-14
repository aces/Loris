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
function NameQueryModal(props) {
    const [queryName, setQueryName] = useState(props.defaultName || '');
    const submitPromise = () => {
        let sbmt = new Promise((resolve, reject) => {
           if (queryName == '') {
               swal.fire({
                   type: 'error',
                   text: 'Must provide a query name.',
               });
               reject();
               return;
           }
           resolve(queryName);
        });
        if (props.onSubmit) {
            sbmt = sbmt.then(props.onSubmit);
        }
        return sbmt;
    };
    return <Modal title="Name Query"
       show={true}
       throwWarning={true}
       onClose={() => {}}
       onCancel={props.closeModal}
       onSubmit={submitPromise}>
            <form style={{width: '100%', padding: '1em'}}>
                <FieldsetElement
                    legend='Query name'>
                    <TextboxElement name='queryname'
                        value={queryName}
                        onUserInput={(name, value) => setQueryName(value)}
                        />
                </FieldsetElement>
            </form>
    </Modal>;
}

export default NameQueryModal;
