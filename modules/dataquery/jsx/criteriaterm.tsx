import FieldDisplay from './fielddisplay';
import {QueryTerm} from './querydef';
import {Operators} from './types';
import {FieldDictionary, FullDictionary} from './types';
import {useTranslation, Trans} from 'react-i18next';

/**
 * Convert an operator serialization back to unicode for
 * display.
 *
 * @param {string} op - the backend operator
 * @returns {string} - The frontend value to display for op
 */
function op2str(op: string): string {
  const {t} = useTranslation();
  switch (op) {
  case 'lt': return '<';
  case 'lte': return '≤';
  case 'eq': return '=';
  case 'neq': return '≠';
  case 'gte': return '≥';
  case 'gt': return '>';
  case 'in': return t('in', {ns: 'dataquery'});
  case 'startsWith': return t('starts with', {ns: 'dataquery'});
  case 'contains': return t('contains', {ns: 'dataquery'});
  case 'endsWith': return t('ends with', {ns: 'dataquery'});
  case 'isnotnull': return t('has data', {ns: 'dataquery'});
  case 'isnull': return t('has no data', {ns: 'dataquery'});
  case 'exists': return t('exists', {ns: 'dataquery'});
  case 'notexists': return t('does not exist', {ns: 'dataquery'});
  case 'numberof': return t('number of', {ns: 'dataquery'});
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
  const {t} = useTranslation();
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
    let visitList = props.term.visits.slice(0, -1).join(', ');
    if (props.term.visits.length > 1) {
      visitList += ` ${t('or', {ns: 'loris'})} `;
    }
    visitList += props.term.visits.at(-1);
    visits = <div>
      <Trans
        i18nKey="<italic>at visit</italic> {{visits}}"
        ns="dataquery"
        values={{visits: visitList}}
        components={{italic: <i/>}}
      />
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
      title={
        t('This field may exist multiple times for a single '
          + '{{scope}} and must match for *any* of the data points',
        {ns: 'dataquery', scope: dict.scope}
        )
      }
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
