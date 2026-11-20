/**
 * A single term in a query hierarchy.
 */
export class QueryTerm {
    module: string
    category: string;
    fieldname: string;
    op: string;
    visits: string[]|undefined;
    value: string|string[];

    /**
     * Constructor
     *
     * @param module - the module name
     * @param category - the field name
     * @param fieldname - the field name within the module
     * @param op - the criteria operator
     * @param value - the criteria value
     * @param visits - the visits for the criteria
     */
    constructor(
      module: string,
      category: string,
      fieldname: string,
      op: string,
      value: string|string[],
      visits?: string[]
    ) {
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
    operator: 'and' | 'or';
    group: (QueryTerm|QueryGroup)[]

    /**
     * Constructor
     *
     * @param op -- 'and' or 'or' -- the operator used for this group
     */
    constructor(op: 'and' | 'or') {
      this.operator = op;
      this.group = [];
    }

    /**
     * Adds a term to this group
     *
     * @param condition - the term's conditions
     */
    addTerm(condition: QueryTerm) {
      this.group.push(condition);
    }

    /**
     * Removes the term and index idx from this group
     *
     * @param idx - the index to remove
     * @returns - the new querygroup
     */
    removeTerm(idx: number): QueryGroup {
      this.group = this.group.filter((el, fidx) => {
        return idx != fidx;
      });
      return this;
    }

    /**
     * Adds a new group of AND/OR clauses
     * as a subgroup.
     */
    addGroup(): void {
      // The default operation for a subgroup
      // is the opposite of this one, otherwise
      // there would be no reason for a new group
      const newOp = this.operator == 'and' ? 'or' : 'and';
      this.group.push(new QueryGroup(newOp));
    }
}
