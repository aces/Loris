import {useState} from 'react';
import {QueryGroup} from '../querydef';

/**
 * React hook to manage loading of DQT queries
 *
 * @return {array}
 */
function useQuery() {
    const [fields, setFields] = useState([]);
    const [criteria, setCriteria] = useState(new QueryGroup('and'));

    const addQueryGroupItem = (querygroup, condition) => {
        // clone the top level query to force
        // a new rendering
        let newquery = new QueryGroup(criteria.operator);

        // Add to this level of the tree
        querygroup.addTerm(condition);


        newquery.group = [...criteria.group];
        setCriteria(newquery);
        return newquery;
    };

    const removeQueryGroupItem = (querygroup, idx) => {
        // Remove from this level of the tree
        querygroup.removeTerm(idx);

        // clone the top level query to force
        // a new rendering
        let newquery = new QueryGroup(criteria.operator);

        newquery.group = [...criteria.group];
        setCriteria(newquery);

        return newquery;
    };

    const addNewQueryGroup = (parentgroup) => {
        // Add to this level of the tree
        parentgroup.addGroup();

        // clone the top level query to force
        // a new rendering
        let newquery = new QueryGroup(criteria.operator);
        newquery.group = [...criteria.group];

        setCriteria(newquery);
    };

    const loadQuery = (fields, filters) => {
        setFields(fields);
        if (!filters) {
            setCriteria(new QueryGroup('and'));
        } else {
            setCriteria(filters);
        }
    };
    const fieldActions = {
        clear: function() {
            setFields([]);
        },
        remove: (module, category, field) => {
            const equalField = (element) => {
               return (element.module == module
                  && element.category === category
                  && element.field == field);
            };
            const newfields = fields.filter((el) => !(equalField(el)));
            setFields(newfields);
        },
        modifyVisits: (module, category, field, dict, visits) => {
            const newfields = [...fields];
            const equalField = (element) => {
              return (element.module == module
                && element.category === category
                && element.field == field);
            };

            for (let i = 0; i < newfields.length; i++) {
              if (equalField(newfields[i])) {
                newfields[i].visits = visits;
                setFields(newfields);
                return;
              }
            }
        },
        addRemoveField: (module, category, field, dict, visits) => {
            const newFieldObj = {
                module: module,
                category: category,
                field: field,
                dictionary: dict,
                visits: visits,
            };
            const equalField = (element) => {
                return (element.module == module
                    && element.category === category
                    && element.field == field);
            };
            if (fields.some(equalField)) {
                // Remove
                const newfields = fields.filter(
                    (el) => !(equalField(el))
                );
                setFields(newfields);
            } else {
                // Add
                const newfields = [...fields, newFieldObj];
                setFields(newfields);
            }
        },
        removeMany: (removeelements) => {
            const equalField = (el1, el2) => {
                return (el1.module == el2.module
                    && el1.category === el2.category
                    && el1.field == el2.field);
            };
            const newfields = fields.filter((el) => {
                if (removeelements.some((rel) => equalField(rel, el))) {
                    return false;
                }
                return true;
            });
            setFields(newfields);
        },
        addMany: (elements) => {
            let newfields = fields;
            for (let i = 0; i < elements.length; i++) {
                const newFieldObj = elements[i];
                const equalField = (element) => {
                    return (element.module == newFieldObj.module
                            && element.category === newFieldObj.category
                            && element.field == newFieldObj.field);
                };
                if (!newfields.some((el) => equalField(el))) {
                    newfields = [...newfields, newFieldObj];
                }
            }
            setFields(newfields);
        },
        setFields: setFields,
    };
    return [
      criteria,
      loadQuery,
      fields,
      fieldActions,
      {
          addQueryGroupItem: addQueryGroupItem,
          removeQueryGroupItem: removeQueryGroupItem,
          addNewQueryGroup: addNewQueryGroup,
          setCriteria: setCriteria,
      },
  ];
}

export default useQuery;
