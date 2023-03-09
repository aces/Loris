/* exported RControlpanelDeleteInstrumentData */

import React, {Component} from 'react';
import swal from 'sweetalert2';

/**
 * Instrument data deletion confirmation message
 */
class ControlpanelDeleteInstrumentData extends Component {
    /**
     * @constructor
     * @param {object} props - React Component properties
     */
     constructor(props) {
         super(props);
         this.confirmDeletion = this.confirmDeletion.bind(this);
     }

    /**
     * Confirm instrument deletion
     */
    confirmDeletion() {
        swal.fire({
            title: 'Please confirm deletion',
            text: 'The instrument data will be deleted',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete the data',
        }).then((result) => {
            if (result.value) {
              this.refs.ClearInstrument.dispatchEvent(
                new Event('submit')
              );
            }
        });
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
    render() {
        return <form ref="ClearInstrument" method="post">
            <input
                className="button"
                type="button"
                value="Delete instrument data"
                onClick={this.confirmDeletion}
            />
            <input
                type="hidden"
                name="ClearInstrument"
                value="1"
            />
        </form>;
    }
}

let RControlpanelDeleteInstrumentData = React.createFactory(
    ControlpanelDeleteInstrumentData
);

window.ControlpanelDeleteInstrumentData = ControlpanelDeleteInstrumentData;
window.RControlpanelDeleteInstrumentData = RControlpanelDeleteInstrumentData;

export default ControlpanelDeleteInstrumentData;
