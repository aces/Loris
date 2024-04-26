import {QueryGroup} from './querydef';
/**
 * These types match the types that come from the backend and
 * are defined in the swagger schema. They must be kept in sync
 */
export type APIQueryField = {
    module: string;
    category: string;
    field: string;
    visits?: string[];
};

export enum Operators {
 // Standard operators
 LT = 'lt',
 LTE ='lte',
 EQ = 'eq',
 NEQ = 'neq',
 GTE = 'gte',
 GT = 'gt',
 // enum operator
 IN = 'in',
 // String operators
 STARTSWITH = 'startsWith',
 ENDSWITH = 'endsWith',
 CONTAINS = 'contains',
 // Optional cardinality operators
 ISNOTNULL = 'isnotnull',
 ISNULL = 'isnull',
 // Many cardinality operators
 EXISTS = 'exists',
 NOTEXISTS = 'notexists',
 NUMBEROF = 'numberof',
}

export type APIQueryGroupField = {
    module: string;
    category: string;
    fieldname: string;
    op: Operators,
    value: string|string[];
    visits?: string[];
}

export type APIQueryCriteriaGroup = {
    operator: 'and' | 'or';
    group: (APIQueryCriteriaGroup|APIQueryGroupField)[];
}

export type APIQuery = {
    QueryID: number;
    Starred: boolean;
    Public: boolean;
    Pinned: boolean;
    SharedBy: string[];
    Name: string;
    AdminName: string;
    Query: APIQueryObject

}
export type APIQueryObject = {
    type: 'candidates';
    fields: APIQueryField[];
    criteria?: APIQueryCriteriaGroup;
};
export type APIQueryRun = {
    self: string,
    QueryURI: string,
    RunTime: string,
    QueryID: number,
    QueryRunID: number,
}

// Queries that have been processed into the QueryList format
// Not from the API.
export type FlattenedField = {
    module: string,
    category: string,
    field: string,
    visits: VisitOption[]|null,
}
export type FlattenedQuery = {
    QueryID: number,
    fields: FlattenedField[],
    criteria?: QueryGroup,
    Name?: string,
    Public?: boolean,
    Starred?: boolean,
    SharedBy?: string[],
    RunTime?: string
    AdminName?: string,
}

// Option in the format expected by React select
export type VisitOption = {
    label: string,
    value: string
}

export interface FullDictionary {
    [modulename: string]: ModuleDictionary
}
export interface ModuleDictionary {
    [category: string]: DictionaryCategory
}

export type FieldDictionary = {
    description: string,
    scope: 'candidate' | 'session',
    type: string,
    cardinality: 'unique' | 'single' | 'optional' | 'many',
    visits?: string[], // session only
    options?: string[], // enum only
    labels?: string[], // enum only, and only if provided
}

export interface DictionaryCategory {
    [fieldname: string]: FieldDictionary
}
