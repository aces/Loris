import {useState} from 'react';
import FilterableSelectGroup from './components/filterableselectgroup';
import Modal from 'jsx/Modal';
import Select from 'react-select';
import swal from 'sweetalert2';
import {
    NumericElement,
    DateElement,
    TimeElement,
    SelectElement,
    TextboxElement,
} from 'jsx/Form';
import {QueryTerm, QueryGroup} from './querydef';
import {
    Operators,
    FieldDictionary,
    DictionaryCategory,
    VisitOption,
} from './types';
import {CategoriesAPIReturn} from './hooks/usedatadictionary';

/**
 * Renders a selectable list of visits
 *
 * @param {object} props - React props
 * @param {string[]} props.selected - The currently selected visits
 * @param {string[]} props.options - The valid options
 * @param {function} props.onChange - callback when the value selected changes
 * @returns {React.ReactElement} - The visit list dropdown
 */
function VisitList(props: {
    selected: string[],
    options: string[],
    onChange: (newvals: string[]) => void,
}) {
    const selectOptions: VisitOption[] = props.options.map(
        (vl) => {
            return {value: vl, label: vl};
        }
    );

    const selectedVisits = selectOptions.filter((opt) => {
        return props.selected.includes(opt.value);
    });

    return <Select options={selectOptions}
        isMulti
        onChange={(newvals) => {
            props.onChange(
                newvals.map((valobj) => valobj.value)
            );
        }}
        placeholder='Select Visits'
        value={selectedVisits}
        menuPortalTarget={document.body}
        styles={{menuPortal:
            /**
             * Required for rendering properly on top of window.
             *
             * @param {object} base - The base from React Select
             * @returns {object} - The new CSS object
             */
            (base) => ({...base, zIndex: 9999})}
        }
        closeMenuOnSelect={false}
    />;
}

/**
 * Render a modal window for adding a filter
 *
 * @param {object} props - React props
 * @param {QueryGroup} props.query - The current query
 * @param {function} props.closeModal - Callback to close the modal
 * @param {function} props.addQueryGroupItem - Callback to add criteria to a querygroup
 * @param {CategoriesAPIReturn} props.categories - List of categories
 * @param {function} props.onCategoryChange - Callback to change the current category
 * @param {DictionaryCategory} props.displayedFields - The fields from the current category to display
 * @param {string} props.module - The module of the currently selected category
 * @param {string} props.category - The currently selected category
 * @returns {React.ReactElement} - The modal window
 */
function AddFilterModal(props: {
    query: QueryGroup,
    closeModal: () => void,
    addQueryGroupItem: (group: QueryGroup, condition: QueryTerm) => void,
    categories: CategoriesAPIReturn,

    onCategoryChange: (module: string, category: string) => void,
    displayedFields: DictionaryCategory,

    module: string,
    category: string,
}) {
    let fieldSelect;
    let criteriaSelect;
    let visitSelect;
    let cardinalityWarning;
    const [fieldDictionary, setFieldDictionary]
        = useState<FieldDictionary|null>(null);
    const [fieldname, setFieldname] = useState<string|null>(null);
    const [op, setOp] = useState<Operators|null>(null);
    const [value, setValue] = useState<string|string[]>('');
    const [selectedVisits, setSelectedVisits] = useState<string[]|null>(null);

    if (props.displayedFields) {
        const options: { Fields: {[key: string]: string}} = {'Fields': {}};
        for (const [key, value] of Object.entries(props.displayedFields)) {
            options['Fields'][key] = value.description;
        }
        fieldSelect = <FilterableSelectGroup groups={options}
                onChange={(key, fieldname) => {
                    const dict = props.displayedFields[fieldname];
                    setFieldDictionary(dict);
                    setFieldname(fieldname);
                    if (dict.visits) {
                        setSelectedVisits(dict.visits);
                    }
                }}
                placeholder="Select a field" />;
    }

    if (fieldDictionary) {
        let valueSelect;
        if (op) {
            valueSelect = valueInput(fieldDictionary, op, value, setValue);
        }

        criteriaSelect = <div>
            <h3>Criteria</h3>
            <div style={{display: 'flex'}}>
                <div style={{width: '20%'}}>
                    <FilterableSelectGroup groups={
                        {'Operators': getOperatorOptions(fieldDictionary)}
                    }
                        onChange={(value: string, operator: string) => {
                            setOp(operator as Operators);
                        }}
                        placeholder="Select an operator"
                    />
                </div>
                <div style={{width: '80%'}}>{valueSelect}</div>
            </div>
        </div>;

    if (fieldDictionary.scope == 'session' && fieldDictionary.visits) {
        visitSelect = <div onClick={(e) => e.stopPropagation()}>
                <h3>for at least one of the following visits</h3>
                <VisitList options={fieldDictionary.visits}
                   selected={selectedVisits || []}
                   onChange={setSelectedVisits}
                />
        </div>;
    }
    if (fieldDictionary.cardinality == 'many') {
        cardinalityWarning = <div className="alert alert-info"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '1em',
                }}>
            <i className="fas fa-exclamation-circle"
                style={{fontSize: '2.5em',
                    color: '#ffde2e',
                    paddingLeft: '0.2em',
                }}></i>
            <div style={{
                color: 'white',
                padding: '1em',
            }}>This field may exist multiple times for a
            single {fieldDictionary.scope}. Adding a criteria
            based on it means that it must match for <i>at least
            one</i> of the data points.</div>
        </div>;
    }
    }

    /**
     * Function that returns a promise on the modal's submission to check
     * if the input is valid.
     *
     * @returns {Promise} - Promise that resolves if input is valid and rejects otherwise
     */
    const submitPromise = () =>
        new Promise((resolve, reject) => {
            // Validate and reject if invalid
           if (!fieldname) {
               swal.fire({
                   type: 'error',
                   title: 'Invalid field',
                   text: 'You must select a field for the criteria.',
               });
               reject();
               return;
           }
           if (!op) {
               swal.fire({
                   type: 'error',
                   title: 'Invalid operator',
                   text: 'You must select an operator for the criteria.',
               });
               reject();
               return;
           }

           if (!value) {
               if (op != 'isnotnull' && op != 'isnull'
                   && op != 'exists' && op != 'notexists') {
                   swal.fire({
                       type: 'error',
                       title: 'Invalid value',
                       text: 'You must enter a value to compare the ' +
                         'field against.',
                   });
                   reject();
                   return;
               }
           }

           if (fieldDictionary && fieldDictionary.scope == 'session') {
               if (!selectedVisits || selectedVisits.length == 0) {
                   swal.fire({
                       type: 'error',
                       title: 'Invalid visits',
                       text: 'No visits selected for criteria.',
                   });
                   reject();
                   return;
               }
           }

           // It's been validated, now save the data and resolve
           const crit: QueryTerm = new QueryTerm(
                   props.module,
                   props.category,
                   fieldname,
                   op,
                   value,
           );
           if (fieldDictionary && fieldDictionary.scope == 'session') {
               crit.visits = selectedVisits || [];
           }

           props.addQueryGroupItem(
               props.query,
               crit,
           );

           props.closeModal();
           resolve(null);
        }
    );
    return <Modal title="Add criteria"
       show={true}
       throwWarning={true}
       onClose={props.closeModal}
       onSubmit={submitPromise}>
            <div style={{width: '100%', padding: '1em'}}>
                <h3>Field</h3>
                <div style={{display: 'flex', width: '100%'}}>
                    <div style={{width: '40%'}}>
                    <FilterableSelectGroup groups={props.categories.categories}
                        mapGroupName={(key) => props.categories.modules[key]}
                        onChange={props.onCategoryChange} />
                    </div>
                    <div style={{width: '100%'}}>
                    {fieldSelect}
                    </div>
                </div>
                {cardinalityWarning}
                {criteriaSelect}
                {visitSelect}
            </div>
    </Modal>;
}


/**
 * Get a list of possible query operators based on a field's dictionary
 *
 * @param {object} dict - the field dictionary
 * @returns {object} - list of options for this dictionary
 */
function getOperatorOptions(dict: FieldDictionary) {
    let options: {[operator: string]: string};

    if (dict.type == 'integer' || dict.type == 'date' ||
            dict.type == 'interval' || dict.type == 'time' ||
            dict.type == 'decimal') {
        // Comparable data types
        options = {
            'lt': '<',
            'lte': '≤',
            'eq': '=',
            'neq': '≠',
            'gte': '≥',
            'gt': '>',
        };
    } else if (dict.type == 'enumeration') {
        // Enumerations are a dropdown. Comparable operators
        // are meaningless, but the options are a dropdown
        // and we might be looking for an option "in" any
        // of the selected choices.
        options = {
            'eq': '=',
            'neq': '≠',
            'in': 'in',
        };
    } else if (dict.type == 'string' ||
            dict.type == 'URI') {
        // We might be looking for a substring.
        options = {
            'eq': '=',
            'neq': '≠',
            'startsWith': 'starts with',
            'contains': 'contains',
            'endsWith': 'ends with',
        };
    } else {
        // fall back to == and !=, valid for any type.
        options = {'eq': '=', 'neq': '≠'};
    }

    // Possible cardinalities are unique, single,
    // optional, or many. Unique and single don't
    // change the possible operators, optional or
    // 1-many cardinalities have a couple more
    // things you can check.
    if (dict.cardinality == 'optional') {
        options['isnotnull'] = 'has data';
        options['isnull'] = 'has no data';
    } else if (dict.cardinality == 'many') {
        options['exists'] = 'exists';
        options['notexists'] = 'does not exist';
        options['numberof'] = 'number of';
    }
    return options;
}


/**
 * Returns an input field for getting the value of a filter criteria
 * in a context-sensitive way
 *
 * @param {object} fielddict - The field dictionary
 * @param {string} op - The operator selected
 * @param {string|string[]} value - The current value
 * @param {string} setValue - a callback when a new value is selected
 * @returns {React.ReactElement} - the react element
 */
function valueInput(fielddict: FieldDictionary,
    op: Operators,
    value: string|string[],
    setValue: (val: string) => void
) {
   const vs: string = value as string;
   switch (op) {
      case 'exists':
      case 'notexists':
      case 'isnull':
      case 'isnotnull':
          return <span/>;
      case 'numberof':
          return <NumericElement
             value={vs}
             name='numberof'
             onUserInput={(name: string, value: string) => setValue(value)} />;
    }

   switch (fielddict.type) {
       case 'date':
          return <DateElement
             name="date"
             value={vs}
             onUserInput={(name: string, value: string) => setValue(value)} />;
       case 'time':
           // There's no time element type in LORIS, so use the HTML5
           // one with bootstrap styling that matches the rest of our
           // elements
           return <TimeElement
                    name="time"
                    value={vs}
                    onUserInput={
                        (name: string, value: string) => setValue(value)
                    }
                />;
       case 'URI':
            // Should this be input type="url"?
            return <TextboxElement
               onUserInput={(name: string, value: string) => setValue(value)}
               name='value'
               value={vs} />;
       case 'integer':
          return <NumericElement
             value={vs}
             name='value'
             onUserInput={(name: string, value: string) => setValue(value)} />;
       case 'boolean':
          return <FilterableSelectGroup groups={
                        {'Value': {
                            'true': 'true',
                            'false': ' false',
                        },
                    }}
                    onChange={(_: string, value: string) => {
                            setValue(value);
                        }}
                        placeholder="Select a value"
                    />;
       case 'enumeration':
          const opts: {[key: string]: string} = {};
          for (let i = 0;
              fielddict.options && i < fielddict.options.length;
              i++
          ) {
             const opt = fielddict.options[i];
             if (fielddict.labels) {
                 opts[opt] = fielddict.labels[i];
             } else {
                 opts[opt] = opt;
             }
          }
          if (op == 'in') {
           return <SelectElement
               label=''
               multiple={true}
               name='value'
               options={opts}
               onUserInput={(name: string, value: string) => setValue(value)}
               value={value}
               sortByValue={false}
           />;
          }
          return <FilterableSelectGroup
                    groups={{'Value': opts}}
                    onChange={(_: string, value: string) => {
                            setValue(value);
                        }}
                        placeholder="Select a value"
                    />;
       default:
            return <TextboxElement
                onUserInput={(name: string, value: string) => setValue(value)}
                name='value'
                value={vs} />;
   }
}

export default AddFilterModal;
