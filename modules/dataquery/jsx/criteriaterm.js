import FieldDisplay from './fielddisplay';

/**
 * Convert an operator serialization back to unicode for
 * display.
 *
 * @param {string} op - the backend operator
 *
 * @return {string}
 */
function op2str(op) {
    switch (op) {
    case 'lt': return '<';
    case 'lte': return '≤';
    case 'eq': return '=';
    case 'neq': return '≠';
    case 'gte': return '≥';
    case 'gt': return '>';
    case 'in': return 'in';
    case 'startsWith': return 'starts with';
    case 'contains': return 'contains';
    case 'endsWith': return 'ends with';
    case 'isnotnull': return 'has data';
    case 'isnull': return 'has no data';
    case 'exists': return 'exists';
    case 'notexists': return 'does not exist';
    case 'numberof': return 'number of';
    default: console.error('Unhandle operator');
    }
};

/**
 * Get the dictionary for a given term
 *
 * @param {object} term - The term whose dictionary
                          should be extracted
 * @param {object} dict - all loaded dictionaries
 *
 * @return {object}
 */
function getDictionary(term, dict) {
    if (!dict || !dict[term.module] || !dict[term.category]
        || !dict[term.module][term.category][term.fieldname]) {
        return {};
    }
    return dict[term.module][term.category][term.fieldname];
}
/**
 * Renders a single term of a condition
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function CriteriaTerm(props) {
    const containerStyle={
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
    };

    const fieldStyle = {
        width: '33%',
    };
    const opStyle = {
        width: '33%',
        textAlign: 'center',
    };
    const valueStyle = {
        width: '33%',
        display: 'flex',
        alignItems: 'center',
    };

    let visits;
    if (props.term.visits) {
        visits = '';
        if (props.term.visits.length == 1) {
            visits += props.term.visits[0];
        } else {
            for (let i = 0; i < props.term.visits.length; i++) {
                visits += props.term.visits[i];
                if (i == props.term.visits.length-2) {
                    visits += ' or ';
                } else if (i < props.term.visits.length-2) {
                    visits += ', ';
                }
            }
        }
        visits = <div>
            <span style={{fontStyle: 'italic'}}>at visit</span>
            <span> {visits}</span>
        </div>;
    }

    let value = props.term.value;
    if (props.term.op == 'in') {
        const liststyle = {
            margin: 0,
            padding: 0,
            listStylePosition: 'inside',
            listStyleType: 'disc',
        };

        value = <ul style={liststyle}>
            {props.term.value.map((val, idx) => <li key={idx}>{val}</li>)}
        </ul>;
    }

    let cardinalityWarning;
    const dict = getDictionary(props.term, props.fulldictionary);
    if (dict.cardinality == 'many') {
        cardinalityWarning = <i className="fas fa-exclamation-circle"
            style={{fontSize: '2em',
                color: 'rgb(58, 61, 255)',
                paddingLeft: '0.2em',
                cursor: 'help',
            }}
            title={'This field may exist multiple times for a single '
                + dict.scope + ' and must match for *any*'
                + ' of the data points'}
        ></i>;
    }
    return (
        <div style={containerStyle}>
            <div style={fieldStyle}>
                <FieldDisplay
                    module={props.term.module}
                    category={props.term.category}
                    fieldname={props.term.fieldname}
                    mapModuleName={props.mapModuleName}
                    mapCategoryName={props.mapCategoryName}
                    fulldictionary={props.fulldictionary}
                    />
            </div>
            <div style={opStyle}>{op2str(props.term.op)}</div>
            <div style={valueStyle}>
                <div>{value}</div>
                <div style={{padding: '2em'}}>{visits}</div>
                {cardinalityWarning}
            </div>
        </div>);
}

export default CriteriaTerm;
