import {QueryTerm, QueryGroup} from './querydef';
import {
    APIQueryObject,
    APIQueryField,
    APIQueryGroupField,
    APIQueryCriteriaGroup,
} from './types';
/**
 * Calculates the payload to submit to the search endpoint
 * to run the query.
 *
 * @param {APIQueryField[]} fields - the fields to query
 * @param {QueryGroup} filters - the root of the filters
 * @returns {APIQueryObject} - The query to send to the API
 */
export function calcPayload(
    fields: APIQueryField[],
    filters: QueryGroup
): APIQueryObject {
    const payload: APIQueryObject = {
        type: 'candidates',
        fields: fields.map((val: APIQueryField) => {
            const fieldpayload: APIQueryField = {
                module: val.module,
                category: val.category,
                field: val.field,
            };
            if (val.visits) {
                fieldpayload.visits = val.visits;
            }
            return fieldpayload;
        },
        ),
    };
    if (filters.group.length > 0) {
        payload.criteria = {
            operator: filters.operator,
            group: filters.group.map( (val) => {
                if (val instanceof QueryTerm) {
                    return val as APIQueryGroupField;
                } else if (val instanceof QueryGroup) {
                    return val as APIQueryCriteriaGroup;
                } else {
                    throw new Error('Invalid query');
                }
            }),
        };
    }
    return payload;
}

