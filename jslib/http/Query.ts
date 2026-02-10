export enum Operator {
  Equals = '',
  NotEquals = '!=',
  LessThan = '<',
  GreaterThan = '>',
  LessThanOrEqual = '<=',
  GreaterThanOrEqual = '>=',
  Like = '_like',
  Includes = '_in'
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
  private selectedFields: string[] = [];

  /**
   * Adds a filter parameter to the query string.
   * TODO: Add support for multiple values for same field
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
    this.params[`${field}${operator}`] = value;
    return this;
  }

  /**
   * Adds a field to the 'fields' selection parameter.
   *
   * @param field The field to include in the response payload.
   */
  addField(field: string): this {
    if (!this.selectedFields.includes(field)) {
      this.selectedFields.push(field);
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
    this.params['sort'] = `${field}:${direction}`;
    return this;
  }

  /**
   * Builds and returns the final URL search string.
   */
  build(): string {
    const finalParams = { ...this.params };

    if (this.selectedFields.length > 0) {
      finalParams['fields'] = this.selectedFields.join(',');
    }

    return new URLSearchParams(finalParams).toString();
  }
}
