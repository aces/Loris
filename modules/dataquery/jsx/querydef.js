/**
 * A single term in a query hierarchy.
 */
export class QueryTerm {
    /**
     * Constructor
     *
     * @param {object} fielddictionary - the dictionary object
     * @param {string} module - the module name
     * @param {string} category - the field name
     * @param {string} fieldname - the field name within the module
     * @param {string} op - the criteria operator
     * @param {string} value - the criteria value
     * @param {array} visits - the visits for the criteria
     */
    constructor(
        fielddictionary,
        module,
        category,
        fieldname,
        op,
        value,
        visits
    ) {
        this.dictionary = fielddictionary;
        this.module = module;
        this.category = category;
        this.fieldname = fieldname;
        this.op = op;
        this.value = value;
        this.visits = visits;
    }
}

/**
 * And AND/OR group of terms within a query
 */
export class QueryGroup {
    /**
     * Constructor
     *
     * @param {string} op -- 'and' or 'or' -- the operator used for this group
     */
    constructor(op) {
        this.operator = op;
        this.group = [];
    }

    /**
     * Adds a term to this group
     *
     * @param {object} condition - the term's conditions
     */
    addTerm(condition) {
        this.group.push(new QueryTerm(
            null,
            condition.Module,
            condition.Category,
            condition.Field,
            condition.Op,
            condition.Value,
            condition.Visits,
        ));
    }

    /**
     * Removes the term and index idx from this group
     *
     * @param {int} idx - the index to remove
     *
     * @return {QueryGroup} - the new querygroup
     */
    removeTerm(idx) {
        this.group = this.group.filter((el, fidx) => {
            return idx != fidx;
        });
        return this;
    }

    /**
     * Adds a new group of AND/OR clauses
     * as a subgroup. */
    addGroup() {
        // The default operation for a subgroup
        // is the opposite of this one, otherwise
        // there would be no reason for a new group
        const newOp = this.operator == 'and' ? 'or' : 'and';
        this.group.push(new QueryGroup(newOp));
    }
}
