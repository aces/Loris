import {useState, useEffect} from 'react';
import swal from 'sweetalert2';
import {QueryTerm, QueryGroup} from '../querydef';
import {FlattenedField, FlattenedQuery, VisitOption} from '../types';
import {
  APIQuery,
  APIQueryRun,
  APIQueryField,
  APIQueryGroupField,
  APIQueryCriteriaGroup,
} from '../types';

type QueryActionType = [
    (queryID: number|null) => void,
    (action: string) => void,
];

interface FlattenedQueryMap {
    [queryId: number]: FlattenedQuery
}
/**
 * React hook for triggering toggling of starred queries
 * on a LORIS server.
 *
 * @param {function} onCompleteCallback - an action to perform after pinning
 * @returns {array} - QueryAction functions
 */
function useStarredQueries(onCompleteCallback: () => void): QueryActionType {
    const [starQueryID, setStarQueryID] = useState<number|null>(null);
    const [starAction, setStarAction] = useState<string>('true');
    useEffect(() => {
        if (starQueryID == null) {
            return;
        }

        fetch(
            '/dataquery/queries/' + starQueryID + '?star=' + starAction,
            {
                method: 'PATCH',
                credentials: 'same-origin',
            },
        ).then( () => {
            setStarQueryID(null);
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        }
        );
    }, [starQueryID, starAction]);
    return [setStarQueryID, setStarAction];
}

/**
 * React hook for triggering toggling of shared queries
 * on a LORIS server.
 *
 * @param {function} onCompleteCallback - an action to perform after pinning
 * @returns {array} - QueryAction functions
 */
function useShareQueries(onCompleteCallback: () => void): QueryActionType {
    const [shareQueryID, setShareQueryID] = useState<number|null>(null);
    const [shareAction, setShareAction] = useState('true');
    useEffect(() => {
        if (shareQueryID == null) {
            return;
        }

        fetch(
            '/dataquery/queries/' + shareQueryID + '?share=' + shareAction,
            {
                method: 'PATCH',
                credentials: 'same-origin',
            },
        ).then( () => {
            setShareQueryID(null);
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        }
        );
    }, [shareQueryID, shareAction]);
    return [setShareQueryID, setShareAction];
}

type SharedQueriesType = [
  {
        recent: FlattenedQuery[],
        shared: FlattenedQuery[],
        top: FlattenedQuery[],
  },
  () => void,
  {
    star: (queryID: number) => void,
    unstar: (queryID: number) => void,
    share: (queryID: number) => void,
    unshare: (queryID: number) => void,
  }
];
/**
 * React hook to load recent and shared queries from the server
 *
 * @param {string} username - The username accessing the module
 * @returns {array} - [{queries}, reload function(), {queryActions}]
 */
function useSharedQueries(username: string): SharedQueriesType {
    const [recentQueries, setRecentQueries] = useState<FlattenedQuery[]>([]);
    const [sharedQueries, setSharedQueries] = useState<FlattenedQuery[]>([]);
    const [topQueries, setTopQueries] = useState<FlattenedQuery[]>([]);


    const [loadQueriesForce, setLoadQueriesForce] = useState<number>(0);
    /**
     * Force the client to reload queries
     *
     * @returns {void}
     */
    const reloadQueries = () => setLoadQueriesForce(loadQueriesForce+1);
    const [setStarQueryID, setStarAction] = useStarredQueries(reloadQueries);
    const [setShareQueryID, setShareAction] = useShareQueries(reloadQueries);

    useEffect(() => {
        fetch('/dataquery/queries', {credentials: 'same-origin'})
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Invalid response');
          }
          return resp.json();
        }).then((result) => {
          const convertedshared: FlattenedQuery[] = [];
          const convertedtop: FlattenedQuery[] = [];
          const allQueries: FlattenedQueryMap = {};
          if (result.queries) {
              result.queries.forEach( (query: APIQuery) => {
                  const flattened: FlattenedQuery = query2flattened(query);
                  allQueries[query.QueryID] = flattened;

                  if (query.Pinned == true) {
                      convertedtop.push(flattened);
                  }
                  if (query.Public == true) {
                      // If we're the only person who shared it, don't show it in our
                      // shared queries.
                      // If other people shared it too, then remove ourselves from the
                      // "shared by" list in the Shared Queries panel.
                      if (query.SharedBy.length == 1
                            && query.SharedBy[0] == username
                        ) {
                          // don't include
                      } else {
                          // filter
                          query.SharedBy = query.SharedBy.filter(
                            (item: string) => {
                                return item != username;
                            }
                          );
                          // Make a new copy to avoid mutating the version used by other
                          // tabs
                          const flattened2: FlattenedQuery
                            = query2flattened(query);
                          convertedshared.push(flattened2);
                      }
                  }
              });
          }
          setSharedQueries(convertedshared);
          setTopQueries(convertedtop);
          return allQueries;
    }).then((allQueries) => {
        fetch('/dataquery/queries/runs', {credentials: 'same-origin'})
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Invalid response');
          }
          return resp.json();
        }).then((result) => {
            if (result.queryruns) {
                const convertedrecent: FlattenedQuery[] = [];
                result.queryruns.forEach( (queryRun: APIQueryRun) => {
                    const queryObj: FlattenedQuery
                        = allQueries[queryRun.QueryID];
                    if (!queryObj) {
                        console.error(
                            'Could not get ',
                            queryRun.QueryID,
                            ' from ',
                            allQueries);
                        return;
                    }
                    convertedrecent.push({
                        RunTime: queryRun.RunTime,
                        ...queryObj,
                    });
                });
                setRecentQueries(convertedrecent);
            }
        });
    }).catch( (error) => {
      console.error(error);
    });
    }, [loadQueriesForce]);

    return [
        {
            recent: recentQueries,
            shared: sharedQueries,
            top: topQueries,
        },
        reloadQueries,
        {
            /**
             * Stars a query on the server
             *
             * @param {number} queryID - The queryID to star
             * @returns {void}
             */
            star: (queryID: number) => {
                    setShareQueryID(null);
                    setStarAction('true');
                    setStarQueryID(queryID);
            },
            /**
             * Unstars a query on the server
             *
             * @param {number} queryID - The queryID to unstar
             * @returns {void}
             */
            unstar: (queryID: number) => {
                    setShareQueryID(null);
                    setStarAction('false');
                    setStarQueryID(queryID);
            },
            /**
             * Shares a query on the server
             *
             * @param {number} queryID - The queryID to share
             * @returns {void}
             */
            share: (queryID: number) => {
                    setStarQueryID(null);
                    setShareAction('true');
                    setShareQueryID(queryID);
            },
            /**
             * Unshares a query on the server
             *
             * @param {number} queryID - The queryID to unshare
             * @returns {void}
             */
            unshare: (queryID: number) => {
                setStarQueryID(null);
                setShareAction('false');
                setShareQueryID(queryID);
            },
        },
    ];
}

/**
 * Check if a term from a sub-term from query group is an APIQueryGroupField
 * or an APIQueryCriteriaGroup
 *
 * @param {APIQueryGroupField|APIQueryCriteriaGroup} term - The term to check
 * @returns {boolean} - true if the term is an APIQueryCriteriaGroup
 */
function isAPIQueryCriteriaGroup(
    term: APIQueryGroupField|APIQueryCriteriaGroup
): term is APIQueryCriteriaGroup {
    return (term as APIQueryCriteriaGroup).operator !== undefined;
}
/**
 * Takes a saved query from a JSON object and marshal
 * it into a QueryGroup object
 *
 * @param {object} query - the json object
 * @returns {QueryGroup} - The object converted into a QueryGroup
 */
function unserializeSavedQuery(query: APIQueryCriteriaGroup): QueryGroup {
    if (!query.operator) {
        throw new Error('Invalid query tree');
    }
    const root = new QueryGroup(query.operator);
    query.group.forEach((val) => {
        if (isAPIQueryCriteriaGroup(val)) {
            const childTree: QueryGroup = unserializeSavedQuery(val);
            root.group.push(childTree);
            return;
        } else {
            if (!val.module
                || !val.category
                || !val.fieldname
                || !val.op) {
                console.error('Invalid criteria', val);
                return;
            }

            const term = val as APIQueryGroupField;

            root.addTerm(
                new QueryTerm(
                    term.module,
                    term.category,
                    term.fieldname,
                    term.op,
                    term.value,
                    term.visits,
                )
            );
        }
    });
    return root;
}

/**
 * React hook to load a query if one was passed in the URL.
 *
 * @param {function} loadQuery - function to load the query into React state
 */
function useLoadQueryFromURL(
    loadQuery: (fields: APIQueryField[], filters: QueryGroup|null) => void
) {
    // Load query if queryID was passed
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryID = params.get('queryID');
        if (!queryID) {
            return;
        }
        fetch(
            '/dataquery/queries/' + queryID,
            {
                method: 'GET',
                credentials: 'same-origin',
            },
        ).then((resp) => {
                  if (!resp.ok) {
                      throw new Error('Invalid response');
                  }
                  return resp.json();
          }).then((result) => {
              if (result.Query.criteria) {
                  result.Query.criteria = unserializeSavedQuery(
                    result.Query.criteria
                  );
              }
              loadQuery(result.Query.fields, result.Query.criteria);
              swal.fire({
                type: 'success',
                text: 'Loaded query',
              });
          }).catch( (error) => {
              swal.fire({
                  type: 'error',
                  text: 'Could not load query',
              });
              console.error(error);
          });
    }, []);
}


/**
 * Convert a query from the format returned by the API to the format
 * used by the displayed query list on the main page.
 *
 * @param {APIQuery} query - The query to convert
 * @returns {FlattenedQuery} - The query converted to the new type
 */
function query2flattened(query: APIQuery): FlattenedQuery {
    const rv: FlattenedQuery = {
        QueryID: query.QueryID,
        fields: query.Query.fields.map(
            (field: APIQueryField): FlattenedField => {
                if (!field.visits) {
                    return {
                        module: field.module,
                        category: field.category,
                        field: field.field,
                        visits: null,
                    };
                }
                return {
                    module: field.module,
                    category: field.category,
                    field: field.field,
                    visits: field.visits.map( (vl: string): VisitOption => {
                        return {label: vl, value: vl};
                    }),
                };
            }),
    };

    if (query.Query.criteria) {
        rv.criteria = unserializeSavedQuery(query.Query.criteria);
    }
    if (query.Name) {
        rv.Name = query.Name;
    }
    if (query.AdminName) {
        rv.AdminName = query.AdminName;
    }
    if (query.Public) {
        rv.Public = query.Public;
    }
    if (query.Starred) {
        rv.Starred = query.Starred;
    }
    if (query.SharedBy) {
        rv.SharedBy = query.SharedBy;
    }
    return rv;
}

export {
    useSharedQueries,
    useLoadQueryFromURL,
};
