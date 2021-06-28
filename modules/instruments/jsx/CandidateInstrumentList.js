import VisitInstrumentList from './VisitInstrumentList';

/**
 * A CandidateInstrumentList provides a list of instruments for
 * a candidate and their status in a widget. There is one card
 * for each visit, and clicking on the visit expands to display
 * a list of instruments in that visit.
 *
 * @param {object} props - React props
 *
 * @return {object} - The JSX component
 */
function CandidateInstrumentList(props) {
    const visits = props.Visits.map((visit) => {
        return (
            <VisitInstrumentList
                BaseURL={props.BaseURL}
                Candidate={props.Candidate}
                VisitMap={props.VisitMap}
                Visit={visit} />
        );
    });

    const style={
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 0,
        margin: 0,
    };
    return <div style={style}>
        {visits}
        </div>;
}

export default CandidateInstrumentList;
