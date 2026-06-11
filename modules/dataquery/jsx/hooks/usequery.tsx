import {useState} from 'react';
import {QueryGroup, QueryTerm} from '../querydef';
import {APIQueryField} from '../types';

type FieldActions = {
    clear: () => void,
    remove: (module: string, category: string, field: string) => void,
    modifyVisits: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    removeMany: (removeelements: APIQueryField[]) => void,
    addRemoveField: (
        module: string,
        category: string,
        field: string,
        visits: string[]
    ) => void,
    addMany: (elements: APIQueryField[]) => void,
    setFields: (fields: APIQueryField[]) => void,
}

type useQueryReturnType = [
  QueryGroup,
  (fields: APIQueryField[], filters: QueryGroup|null) => void,
  APIQueryField[],
  FieldActions,
  {
      addQueryGroupItem: (
        querygroup: QueryGroup,
        condition: QueryTerm
      ) => QueryGroup,
      removeQueryGroupItem: (
        querygroup: QueryGroup,
        idx: number
      ) => QueryGroup,
      addNewQueryGroup: (parentgroup: QueryGroup) => void,
      setCriteria: (newcriteria: QueryGroup) => void,
  },
];

/**
 * React hook to manage loading of queries.
 *
 * @returns {useQueryReturnType} - A veritable plethora of actions and values
 */
function useQuery(): useQueryReturnType {
  const [fields, setFields] = useState<APIQueryField[]>([{
    'module': 'candidate_parameters',
    'category': 'Identifiers',
    'field': 'PSCID',
  }]);
  const [criteria, setCriteria] = useState<QueryGroup>(new QueryGroup('and'));

  /**
   * Add a term to the current QueryGroup
   *
   * @param {QueryGroup} querygroup - The group to add the term to
   * @param {QueryTerm} condition - The term to add to the group
   * @returns {QueryGroup} - The new QueryGroup
   */
  const addQueryGroupItem = (
    querygroup: QueryGroup,
    condition: QueryTerm,
  ): QueryGroup => {
    // clone the top level query to force
    // a new rendering
    const newquery = new QueryGroup(criteria.operator);

    // Add to this level of the tree
    querygroup.addTerm(condition);


    newquery.group = [...criteria.group];
    setCriteria(newquery);
    return newquery;
  };

  /**
   * Remove a given index from the current QueryGroup and return
   * a new group.
   *
   * @param {QueryGroup} querygroup - The querygroup to remove an item from
   * @param {number} idx - The index to remove
   * @returns {QueryGroup} - the new QueryGroup
   */
  const removeQueryGroupItem = (
    querygroup: QueryGroup,
    idx: number
  ): QueryGroup => {
    // Remove from this level of the tree
    querygroup.removeTerm(idx);

    // clone the top level query to force
    // a new rendering
    const newquery = new QueryGroup(criteria.operator);

    newquery.group = [...criteria.group];
    setCriteria(newquery);

    return newquery;
  };

  /**
   * Add a new, empty query group to the end of a QueryGroup
   *
   * @param {QueryGroup} parentgroup - the group to get a new querygroup child
   * @returns {void}
   */
  const addNewQueryGroup = (parentgroup: QueryGroup): void => {
    // Add to this level of the tree
    parentgroup.addGroup();

    // clone the top level query to force
    // a new rendering
    const newquery = new QueryGroup(criteria.operator);
    newquery.group = [...criteria.group];

    setCriteria(newquery);
  };

  /**
   * Load a new query as the currently managed query by this hook.
   *
   * @param {APIQueryField[]} fields - The fields of the new query
   * @param {QueryGroup} filters - The filters of the new query.
   * @returns {void}
   */
  const loadQuery = (
    fields: APIQueryField[],
    filters: QueryGroup|null
  ): void => {
    setFields(fields);
    if (!filters) {
      setCriteria(new QueryGroup('and'));
    } else {
      setCriteria(filters);
    }
  };
  const fieldActions: FieldActions = {
    /**
     * Clear all fields from this query
     *
     * @returns {void}
     */
    clear: function() {
      setFields([]);
    },
    /**
     * Remove a field from this query
     *
     * @param {string} module - The module of the field to remove
     * @param {string} category - The category of the field to remove
     * @param {string} field - The field to remove
     * @returns {void}
     */
    remove: (
      module: string,
      category: string,
      field: string,
    ): void => {
      /**
       * Returns true if an element in fields is equal to this field
       *
       * @param {APIQueryField} element - The element to compare
       * @returns {boolean} - true if equal
       */
      const equalField = (element: APIQueryField): boolean => {
        return (element.module == module
                  && element.category === category
                  && element.field == field);
      };
      const newfields = fields.filter((el) => !(equalField(el)));
      setFields(newfields);
    },
    /**
     * Modify the visits for a selected field
     *
     * @param {string} module - The module of the field to modify
     * @param {string} category - The category of the field to modify
     * @param {string} field - The field to modify
     * @param {string[]} visits - The new visits for the field
     * @returns {void}
     */
    modifyVisits: (
      module: string,
      category: string,
      field: string,
      visits: string[]
    ) => {
      const newfields: APIQueryField[] = [...fields];

      /**
       * Returns true if an element in fields is equal to this field
       *
       * @param {APIQueryField} element - The element to compare
       * @returns {boolean} - true if equal
       */
      const equalField = (element: APIQueryField) => {
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
    /**
     * Toggle whether a field is present by adding it if missing or removing it if
     * present.
     *
     * @param {string} module - the module for the field
     * @param {string} category - the category for the field
     * @param {string} field - the field name
     * @param {string[]} visits - the list of visits to add if adding
     */
    addRemoveField: (
      module: string,
      category: string,
      field: string,
      visits: string[]
    ): void => {
      const newFieldObj: APIQueryField = {
        module: module,
        category: category,
        field: field,
        visits: visits,
      };
      /**
       * Returns true if an element in fields is equal to this field
       *
       * @param {APIQueryField} element - The element to compare
       * @returns {boolean} - true if equal
       */
      const equalField = (element: APIQueryField) => {
        return (element.module == module
                    && element.category === category
                    && element.field == field);
      };
      if (fields.some(equalField)) {
        // Remove
        const newfields: APIQueryField[] = fields.filter(
          (el) => !(equalField(el))
        );
        setFields(newfields);
      } else {
        // Add
        const newfields: APIQueryField[] = [...fields, newFieldObj];
        setFields(newfields);
      }
    },
    /**
     * Remove multiple elements from the current query
     *
     * @param {APIQueryField[]} removeelements - The elements to remove
     * @returns {void}
     */
    removeMany: (removeelements: APIQueryField[]): void => {
      /**
       * Returns true if el1 is equal to el2
       *
       * @param {APIQueryField} el1 - The first element to compare
       * @param {APIQueryField} el2 - The second element to compare
       * @returns {boolean} - true if equal
       */
      const equalField = (
        el1: APIQueryField,
        el2: APIQueryField
      ): boolean => {
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
    /**
     * Adds many fields to the selected query
     *
     * @param {APIQueryField[]} elements - the fields to add
     * @returns {void}
     */
    addMany: (elements: APIQueryField[]): void => {
      let newfields = fields;
      for (let i = 0; i < elements.length; i++) {
        const newFieldObj = elements[i];
        /**
         * Returns true if an element in fields is equal to this field
         *
         * @param {APIQueryField} element - The element to compare
         * @returns {boolean} - true if equal
         */
        const equalField = (element: APIQueryField) => {
          return (element.module == newFieldObj.module
                            && element.category === newFieldObj.category
                            && element.field == newFieldObj.field);
        };
        if (!newfields.some((el: APIQueryField) => equalField(el))) {
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
