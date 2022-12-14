import {useState} from 'react';
import FilterableSelectGroup from './components/filterableselectgroup';
import Modal from 'jsx/Modal';
import Select from 'react-select';
import swal from 'sweetalert2';

/**
 * Renders a selectable list of visits
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function VisitList(props) {
    let selectedVisits;
    const selectOptions = props.options.map(
        (vl) => {
            return {value: vl, label: vl};
        }
    );

    if (props.selected && props.selected.visits) {
        selectedVisits = selectOptions;
    } else {
        selectedVisits = selectOptions.filter((opt) => {
            return props.selected.includes(opt.value);
        });
    }

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
        styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
        closeMenuOnSelect={false}
    />;
}

/**
 * Render a modal window for adding a filter
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function AddFilterModal(props) {
    let fieldSelect;
    let criteriaSelect;
    let visitSelect;
    let cardinalityWarning;
    let [fieldDictionary, setFieldDictionary] = useState(false);
    let [fieldname, setFieldname] = useState(false);
    let [op, setOp] = useState(false);
    let [value, setValue] = useState('');
    let [selectedVisits, setSelectedVisits] = useState(false);

    if (props.displayedFields) {
        let options = {'Fields': {}};
        for (const [key, value] of Object.entries(props.displayedFields)) {
            options['Fields'][key] = value.description;
        }
        fieldSelect = <FilterableSelectGroup groups={options}
                onChange={(key, fieldname) => {
                    const dict = props.displayedFields[fieldname];
                    setFieldDictionary(dict);
                    setFieldname(fieldname);
                    setSelectedVisits(dict.visits);
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
                    <SelectElement
                       name="operator"
                       id="operator"
                       label=''
                       emptyOption={true}
                       sortByValue={false}
                       value={op || ''}
                       onUserInput={(name, value) => {
                           setOp(value);
                       }}
                       options={getOperatorOptions(fieldDictionary)}
                    />
                </div>
                <div style={{width: '80%'}}>{valueSelect}</div>
            </div>
        </div>;
    }

    if (fieldDictionary.scope == 'session') {
        visitSelect = <div onClick={(e) => e.stopPropagation()}>
                <h3>for at least one of the following visits</h3>
                <VisitList options={fieldDictionary.visits}
                   selected={selectedVisits}
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

           if (fieldDictionary.scope == 'session') {
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
           let crit = {
                   'Module': props.module,
                   'Category': props.category,
                   'Field': fieldname,
                   'Op': op,
                   'Value': value,
           };
           if (fieldDictionary.scope == 'session') {
               crit.Visits = selectedVisits;
           }

           props.addQueryGroupItem(
               props.query,
               crit,
           );

           props.closeModal();

           resolve();
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
 *
 * @return {object}
 */
function getOperatorOptions(dict) {
    let options;

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
        options['isnull'] = ' has no data';
    } else if (dict.cardinality == 'many') {
        options['exists'] = 'exists';
        options['notexists'] = 'does not exist';
        options['numberof'] = 'number of';
    }
    return options;
};


/**
 * Returns an input field for getting the value of a filter criteria
 * in a context-sensitive way
 *
 * @param {object} fielddict - The field dictionary
 * @param {string} op - The operator selected
 * @param {string} value - The current value
 * @param {string} setValue - a callback when a new value is selected
 *
 * @return {ReactDOM}
 */
function valueInput(fielddict, op, value, setValue) {
   switch (op) {
      case 'exists':
      case 'notexists':
      case 'isnull':
      case 'isnotnull':
          return <span/>;
      case 'numberof':
          return <NumericElement
             value={value}
             onUserInput={(name, value) => setValue(value)} />;
    }

   switch (fielddict.type) {
       case 'date':
          return <DateElement
             name="date"
             value={value}
             onUserInput={(name, value) => setValue(value)} />;
       case 'time':
           // There's no time element type in LORIS, so use the HTML5
           // one with bootstrap styling that matches the rest of our
           // elements
           return <TimeElement
                    name="time"
                    value={value}
                    onUserInput={(name, value) => setValue(value)}
                />;
       case 'URI':
            // Should this be input type="url"?
            return <TextboxElement
               onUserInput={(name, value) => setValue(value)}
               value={value} />;
       case 'integer':
          return <NumericElement
             value={value}
             onUserInput={(name, value) => setValue(value)} />;
       case 'boolean':
           return <SelectElement
               label=''
               name='value'
               options={{'true': 'true', 'false': 'false'}}
               onUserInput={(name, value) => setValue(value)}
               value={value}
               sortByValue={false}
               />;
       case 'enumeration':
           let opts = {};
           for (let i = 0; i < fielddict.options.length; i++) {
               const opt = fielddict.options[i];
               opts[opt] = opt;
           }
           return <SelectElement
               label=''
               multiple={op == 'in'}
               name='value'
               options={opts}
               onUserInput={(name, value) => setValue(value)}
               value={value}
               sortByValue={false}
           />;
       default:
            return <TextboxElement
               onUserInput={(name, value) => setValue(value)}
               value={value} />;
   }
};

export default AddFilterModal;
