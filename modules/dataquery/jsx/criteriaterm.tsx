import FieldDisplay from './fielddisplay';
import {QueryTerm} from './querydef';
import {Operators} from './types';
import {FieldDictionary, FullDictionary} from './types';

/**
 * Convert an operator serialization back to unicode for
 * display.
 *
 * @param {string} op - the backend operator
 * @returns {string} - The frontend value to display for op
 */
function op2str(op: string): string {
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
        return '';
    }
}

/**
 * Get the dictionary for a given term
 *
 * @param {QueryTerm} term - The term whose dictionary
                          should be extracted
 * @param {FullDictionary} dict - all loaded dictionaries
 * @returns {FieldDictionary} - The dictionary for this term
 */
function getDictionary(
    term: QueryTerm,
    dict: FullDictionary
): FieldDictionary|null {
    if (!dict || !dict[term.module] || !dict[term.module][term.category]
        || !dict[term.module][term.category][term.fieldname]) {
        return null;
    }
    return dict[term.module][term.category][term.fieldname];
}

/**
 * Renders a single term of a condition
 *
 * @param {object} props - React props
 * @param {QueryTerm} props.term - The term being rendered
 * @param {FullDictionary} props.fulldictionary - The full dictionary
 * @param {function} props.mapModuleName - backend => human friendly name mapper
 * @param {function} props.mapCategoryName - backend => human friendly name mapper
 * @returns {React.ReactElement} - The term to display
 */
export function CriteriaTerm(props: {
    term: QueryTerm,
    fulldictionary: FullDictionary,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
}) {
    const containerStyle: React.CSSProperties ={
        display: 'flex' as const,
        flexWrap: 'nowrap' as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-evenly',
        width: '100%',
        alignItems: 'center',
    };

    const fieldStyle = {
        width: '33%',
    };
    const opStyle = {
        width: '33%',
        textAlign: 'center' as const,
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

    let value;
    if (props.term.op == Operators.IN) {
        const liststyle = {
            margin: 0,
            padding: 0,
            listStylePosition: 'inside' as const,
            listStyleType: 'disc',
        };

        value = <ul style={liststyle}>
            {(props.term.value as string[]).map(
                (val, idx) => <li key={idx}>{val}</li>
            )}
        </ul>;
    } else {
        value = <span>{props.term.value}</span>;
    }

    let cardinalityWarning;
    const dict = getDictionary(props.term, props.fulldictionary);
    if (!dict) {
        // This sometimes happens when first loading, before the dictionary
        // is retrieved, so we do not print an error.
    } else if (dict.cardinality == 'many') {
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
