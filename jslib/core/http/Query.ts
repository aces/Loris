export enum Operator {
  Equals = '=',
  NotEquals = '!=',
  LessThan = '<',
  GreaterThan = '>',
  LessThanOrEqual = '<=',
  GreaterThanOrEqual = '>=',
  Like = 'like',
  Includes = 'in'
}

export interface QueryParam {
  field: string,
  value: string,
  operator: Operator
}

/**
 * Utility class to build URL query strings for API requests.
 */
export class Query {
  private params: Record<string, string> = {};

  /**
   * Adds a filter parameter to the query string.
   *
   * @param root0          The destructured QueryParam object.
   * @param root0.field    The field to filter on.
   * @param root0.value    The value to filter against.
   * @param root0.operator The comparison operator to use.
   */
  addParam({
    field,
    value,
    operator = Operator.Equals,
  }: QueryParam): this {
    const encodedField = encodeURIComponent(field);
    const encodedValue = encodeURIComponent(value);
    const operatorSuffix = this.getOperatorSuffix(operator);
    this.params[`${encodedField}${operatorSuffix}`] = encodedValue;
    return this;
  }

  /**
   * Adds a field to the 'fields' selection parameter.
   *
   * @param field The field to include in the response payload.
   */
  addField(field: string): this {
    const encodedField = encodeURIComponent(field);
    if (this.params['fields']) {
      this.params['fields'] = `${this.params['fields']},${encodedField}`;
    } else {
      this.params['fields'] = encodedField;
    }
    return this;
  }

  /**
   * Sets the maximum number of results to return.
   *
   * @param limit The maximum number of results to return.
   */
  addLimit(limit: number): this {
    this.params['limit'] = limit.toString();
    return this;
  }

  /**
   * Sets the offset for pagination.
   *
   * @param offset The number of results to skip for pagination.
   */
  addOffset(offset: number): this {
    this.params['offset'] = offset.toString();
    return this;
  }

  /**
   * Sets the sorting field and direction.
   *
   * @param field The field to sort the results by.
   * @param direction The sort direction.
   */
  addSort(field: string, direction: 'asc' | 'desc'): this {
    const encodedField = encodeURIComponent(field);
    this.params['sort'] = `${encodedField}:${direction}`;
    return this;
  }

  /**
   * Builds and returns the final URL search string.
   */
  build(): string {
    return new URLSearchParams(this.params).toString();
  }

  /**
   * Gets string suffix for a given operator to be used in a query parameter key.
   *
   * @param operator The comparison operator enum value.
   */
  private getOperatorSuffix(operator: Operator): string {
    switch (operator) {
    case Operator.Equals: return '';
    case Operator.NotEquals: return '!=';
    case Operator.LessThan: return '<';
    case Operator.GreaterThan: return '>';
    case Operator.LessThanOrEqual: return '<=';
    case Operator.GreaterThanOrEqual: return '>=';
    case Operator.Like: return '_like';
    default: return '';
    }
  }
}
