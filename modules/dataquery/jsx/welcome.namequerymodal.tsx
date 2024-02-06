import Modal from 'jsx/Modal';
import swal from 'sweetalert2';
import {useState} from 'react';
import {TextboxElement, FieldsetElement} from 'jsx/Form';

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
                   text: 'Must provide a query name.',
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
    return <Modal title="Name Query"
       show={true}
       throwWarning={true}
       onClose={props.closeModal}
       onSubmit={submitPromise}>
            <form style={{width: '100%', padding: '1em'}}>
                <FieldsetElement
                    legend='Query name'>
                    <TextboxElement name='queryname'
                        value={queryName}
                        placeholder="Enter your query name"
                        onUserInput={
                            (name: string, value: string) => setQueryName(value)
                        }
                        />
                </FieldsetElement>
            </form>
    </Modal>;
}

export default NameQueryModal;
