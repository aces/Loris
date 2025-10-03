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

export class Query {
  private params: Record<string, string> = {};

  addParam({
    field,
    value,
    operator = Operator.Equals
  }: QueryParam): this {
    const encodedField = encodeURIComponent(field);
    const encodedValue = encodeURIComponent(value);
    this.params[`${encodedField}${this.getOperatorSuffix(operator)}`] = encodedValue;
    return this;
  }

  addField(field: string): this {
    const encodedField = encodeURIComponent(field);
    this.params['fields'] = this.params['fields'] ? `${this.params['fields']},${encodedField}` : encodedField;
    return this;
  }

  addLimit(limit: number): this {
    this.params['limit'] = limit.toString();
    return this;
  }

  addOffset(offset: number): this {
    this.params['offset'] = offset.toString();
    return this;
  }

  addSort(field: string, direction: 'asc' | 'desc'): this {
    const encodedField = encodeURIComponent(field);
    this.params['sort'] = `${encodedField}:${direction}`;
    return this;
  }

  build(): string {
    return new URLSearchParams(this.params).toString();
  }

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
