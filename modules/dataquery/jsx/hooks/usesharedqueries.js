import {useState, useEffect} from 'react';
import swal from 'sweetalert2';

import {QueryGroup} from '../querydef';

/**
 * React hook for triggering toggling of starred queries
 * on a LORIS server.
 *
 * @param {callback} onCompleteCallback - an action to perform after pinning
 * @return {array}
 */
function useStarredQueries(onCompleteCallback) {
    const [starQueryID, setStarQueryID] = useState(null);
    const [starAction, setStarAction] = useState('star');
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
 * @param {callback} onCompleteCallback - an action to perform after pinning
 * @return {array}
 */
function useShareQueries(onCompleteCallback) {
    const [shareQueryID, setShareQueryID] = useState(null);
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

/**
 * React hook to load recent and shared queries from the server
 *
 * @return {array} - [{queries}, reload function(), {queryActions}]
 */
function useSharedQueries() {
    const [recentQueries, setRecentQueries] = useState([]);
    const [sharedQueries, setSharedQueries] = useState([]);
    const [topQueries, setTopQueries] = useState([]);


    const [loadQueriesForce, setLoadQueriesForce] = useState(0);
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
          // let convertedrecent = [];
          let convertedshared = [];
          let convertedtop = [];
          let allQueries = {};
          if (result.queries) {
              result.queries.forEach( (query) => {
                  if (query.Query.criteria) {
                      query.Query.criteria = unserializeSavedQuery(
                        query.Query.criteria,
                      );
                  }
                  console.log('Query', query);
                  allQueries[query.QueryID] = query;

                  if (query.Public == true) {
                      convertedshared.push({
                        QueryID: query.QueryID,
                        SharedBy: query.SharedBy,
                        Name: query.Name,
                        ...query.Query,
                      });
                  }
                  if (query.Pinned == true) {
                      convertedtop.push({
                        QueryID: query.QueryID,
                        Name: query.AdminName,
                        ...query.Query,
                      });
                  }
              });
          }
          setSharedQueries(convertedshared);
          setTopQueries(convertedtop);
          return allQueries;
    }).then((allQueries) => {
        console.log(allQueries);
        fetch('/dataquery/queries/runs', {credentials: 'same-origin'})
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Invalid response');
          }
          return resp.json();
        }).then((result) => {
            if (result.queryruns) {
                let convertedrecent = [];
                result.queryruns.forEach( (queryRun) => {
                    const queryObj = allQueries[queryRun.QueryID];
                    if (!queryObj) {
                        console.log(
                            'Could not get ',
                            queryRun.QueryID,
                            ' from ',
                            allQueries);
                        return;
                    }
                    console.log('Got', queryRun.QueryID);
                    convertedrecent.push({
                        Runtime: queryRun.RunTime,
                        ...queryObj,
                    });
                });
                console.log(convertedrecent);
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
            top_: topQueries,
        },
        reloadQueries,
        {
            star: (queryID) => {
                    setStarAction('star');
                    setStarQueryID(queryID);
            },
            unstar: (queryID) => {
                    setStarAction('unstar');
                    setStarQueryID(queryID);
            },

            share: (queryID) => {
                    setShareQueryID(null);
                    setShareAction('true');
                    setShareQueryID(queryID);
            },
            unshare: (queryID) => {
                setShareQueryID(null);
                setShareAction('false');
                setShareQueryID(queryID);
            },
        },
    ];
}

/**
 * Takes a saved query from a JSON object and marshal
 * it into a QueryGroup object
 *
 * @param {object} query - the json object
 *
 * @return {QueryGroup}
 */
function unserializeSavedQuery(query) {
    if (!query.operator) {
        console.error('Invalid query tree', query);
        return null;
    }
    const root = new QueryGroup(query.operator);
    query.group.forEach((val) => {
        if (val.operator) {
            const childTree = unserializeSavedQuery(val);
            root.group.push(childTree);
            return;
        }
        if (!val.module
            || !val.category
            || !val.fieldname
            || !val.op) {
            console.error('Invalid criteria', val);
            return;
        }
        root.addTerm({
            Module: val.module,
            Category: val.category,
            Field: val.fieldname,
            Op: val.op,
            Value: val.value,
        });
    });
    return root;
}

/**
 * React hook to load a query if one was passed in the URL.
 *
 * @param {function} loadQuery - function to load the query into React state
 *
 */
function useLoadQueryFromURL(loadQuery) {
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
              if (result.criteria) {
                  result.criteria = unserializeSavedQuery(result.criteria);
              }
              loadQuery(result.fields, result.criteria);
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


export {
    useSharedQueries,
    useLoadQueryFromURL,
};
