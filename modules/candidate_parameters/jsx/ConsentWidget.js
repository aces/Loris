/**
 * A Widget to display consent information for a candidate in
 * LORIS
 *
 * @param {array} props - The React props
 *
 * @return {object} - The rendered widget
 */
function ConsentWidget(props) {
    if (props.Consents.length == 0) {
        return null;
    }

    const consents = props.Consents.map(consentTerm);
    return (<table className="table" style={{width: '100%'}}>
        <thead>
        <tr>
            <th>Consent Type</th>
            <th>Status</th>
            <th>Date</th>
        </tr>
        </thead>
        <tbody>
        {consents}
        </tbody>
    </table>);
}

/**
 * Returns a rendered JSX component for a single consent type
 *
 * @param {array} consent - The type of consent
 *
 * @return {object}
 */
function consentTerm(consent) {
    let value;
    let date;
    switch (consent.Status) {
        case 'yes':
            value = 'Yes';
            date = consent.DateGiven;
            break;
        case 'no':
            if (consent.DateWithdrawn) {
                value = 'Withdrawn';
                date = consent.DateWithdrawn;
            } else {
                value = 'No';
            }
            break;
        default:
            value = consent.Status;
            return (<tr key={consent.ConsentID}>
                <th>{consent.Label}</th>
                <td colSpan="2" align="center">-</td>
                </tr>);
    }

    return (<tr key={consent.ConsentID}>
        <th>{consent.Label}</th>
        <td>{value}</td>
        <td>{date}</td>
        </tr>);
}

export default ConsentWidget;
