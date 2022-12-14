import {useState, useEffect} from 'react';
import {QueryTerm} from './querydef';
import AddFilterModal from './definefilters.addfiltermodal';
import ImportCSVModal from './definefilters.importcsvmodal';
import QueryTree from './querytree';
import CriteriaTerm from './criteriaterm';
import InfoPanel from 'jsx/InfoPanel';


/**
 * The define filters tab of the DQT
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function DefineFilters(props) {
    let displayquery = '';
    const [addModal, setAddModal] = useState(false);
    const [csvModal, setCSVModal] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    // The subgroup used for the "Add Filter" modal window
    // to add to. Default to top level unless click from a
    // query group, in which case the callback changes it
    // to that group.
    const [modalQueryGroup, setModalGroup] = useState(props.query);
    const [deleteItemIndex, setDeleteItemIndex] = useState(null);
    const [queryMatches, setQueryMatches] = useState(null);
    useEffect(() => {
        setQueryMatches(null);
        const payload = calcPayload(props.fields, props.query);
        if (payload == {}) {
            return;
        }
        fetch(
           loris.BaseURL + '/dqt/queries',
           {
             method: 'POST',
             credentials: 'same-origin',
             body: JSON.stringify(payload),
           },
        ).then(
           (resp) => {
               if (!resp.ok) {
                   throw new Error('Error creating query.');
               }
               return resp.json();
           }
        ).then(
            (data) => {
                fetch(
                        loris.BaseURL + '/dqt/queries/'
                            + data.QueryID + '/count',
                        {
                            method: 'GET',
                            credentials: 'same-origin',
                        }
                ).then((resp) => {
                    if (!resp.ok) {
                        throw new Error('Could not get count.');
                    }
                    return resp.json();
                }).then((result) => {
                    setQueryMatches(result.count);
                });
           }
        );
    }, [props.fields, props.query]);

    const bGroupStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 10,
    };

    const mapModuleName = props.mapModuleName;
    const mapCategoryName = props.mapCategoryName;

    const advancedLabel = showAdvanced ? 'Hide Advanced' : 'Show Advanced';
    let advancedButtons;
    const toggleAdvancedButton = (
        <div>
          <div style={bGroupStyle}>
             <ButtonElement
                label={advancedLabel}
                onUserInput={(e) => {
                   e.preventDefault();
                   setShowAdvanced(!showAdvanced);
                }}
             />
          </div>
       </div>
    );
    if (props.query.group.length == 0) {
        if (showAdvanced) {
          advancedButtons = (
            <div>
                <p>The "nested groups" options are advanced options for queries
                   that do not have any specific condition at the
                   base of the query.
                   Use <code>Add nested "or" condition groups</code> if
                   you need to build a query of the form.
                   <i> (a or b) and (c or d) [or (e and f)..]</i>.
                </p>
                <div style={bGroupStyle}>
                  <ButtonElement
                     label='Add nested "or" condition groups'
                     onUserInput={(e) => {
                       e.preventDefault();
                       props.query.condition = 'and';
                       props.addNewQueryGroup(props.query);
                     }}
                   />
                 </div>
                <p>
                   Use <code>Add nested "and" condition groups</code> if you
                   need to build a query of the form
                   <i> (a and b) or (c and d) [or (e and f)..]</i>.
                </p>
                 <div style={bGroupStyle}>
                   <ButtonElement
                     label='Add nested "and" condition groups'
                     onUserInput={(e) => {
                       e.preventDefault();
                       props.query.condition = 'or';
                       props.addNewQueryGroup(props.query);
                     }}
                   />
                 </div>
             </div>
             );
        }
        // Only 1 add condition button since "and" or "or"
        // are the same with only 1 term
        displayquery = <div>
            <div style={{paddingLeft: '2em',
                paddingRight: '2em'}}>
            <p>Currently querying for ALL candidates.</p>
            <p>You can add conditions by clicking one of the buttons below.</p>
            <p>Click <code>Add Condition</code> to add one or more conditions
               to your filters (ie. "Date Of Birth &lt; 2015-02-15"). <b>This is
               most likely where you want to start your filters.</b>
            </p>
            <p>You can also import a population from a CSV by clicking
                the <code>Import from CSV</code> button.</p>
            <p>The advanced options are for queries that do not have
               a condition to add at the base of the query.</p>
            </div>
            <form>
              <fieldset>
                  <div style={{display: 'flex'}}>
                      <div style={bGroupStyle}>
                          <ButtonElement
                              label='Add Condition'
                              onUserInput={(e) => {
                                  e.preventDefault();
                                  setAddModal(true);
                              }}
                           />
                      </div>
                      <div style={bGroupStyle}>
                          <ButtonElement
                              label='Import from CSV'
                              onUserInput={(e) => {
                                  e.preventDefault();
                                  // Need to be sure that we've loaded
                                  // candidate_parameters so it's in
                                  // fulldictionary
                                  props.getModuleFields(
                                    'candidate_parameters',
                                    'identifiers'
                                  );
                                  setCSVModal(true);
                              }}
                           />
                      </div>
                   </div>
                   {toggleAdvancedButton}
                   {advancedButtons}
               </fieldset>
            </form>
        </div>;
    } else if (props.query.group.length == 1 &&
        props.query.group[0] instanceof QueryTerm
    ) {
        if (showAdvanced) {
          advancedButtons = (
            <div>
                <div style={bGroupStyle}>
                    <p>Use <code>New "and" subgroup</code> if the rest of the
                    query you need to write is a subgroup consisting
                    of "and" conditions. ie your query is of the form:
                    <div>
                   <i>(your condition above) or (c and d [and e and f..])</i>
                   </div>
                   </p>
                    <ButtonElement
                        label='New "and" subgroup'
                        onUserInput={(e) => {
                            e.preventDefault();
                            props.query.operator = 'or';
                            props.addNewQueryGroup(props.query);
                        }} />
                    <p>Use <code>New "or" subgroup</code> if the rest of the
                    query you need to write is a subgroup consisting
                    of "or" conditions. ie your query is of the form:
                    <div>
                   <i>(your condition above) and (c or d [or e or f..])</i>
                   </div>
                   </p>
                    <ButtonElement
                        label='New "or" subgroup'
                        onUserInput={(e) => {
                            e.preventDefault();
                            props.query.operator = 'and';
                            props.addNewQueryGroup(props.query);
                    }} />
                </div>
             </div>
             );
        }
        // buttons for 1. Add "and" condition 2. Add "or" condition
        displayquery = (<div>
            <p>Currently querying for any candidates with:</p>

            <form>
              <fieldset>
                    <div style={{
                        display: 'flex', marginTop: 10,
                        textDecoration: deleteItemIndex == 0 ?
                            'line-through' : '',
                    }}>
                        <CriteriaTerm
                            term={props.query.group[0]}
                            mapModuleName={mapModuleName}
                            mapCategoryName={mapCategoryName}
                            fulldictionary={props.fulldictionary}
                        />
                        <div style={{alignSelf: 'center'}}><i
                            className="fas fa-trash-alt"
                            title='Delete Item'
                            onClick={() => {
                                const newquery = props.removeQueryGroupItem(
                                    props.query,
                                    0
                                );
                                setModalGroup(newquery);
                            }}
                            onMouseEnter={() => setDeleteItemIndex(0)}
                            onMouseLeave={() => setDeleteItemIndex(null)}
                            style={{cursor: 'pointer'}} />
                        </div>
                    </div>
                    <div>
                        <div style={bGroupStyle}>
                            <ButtonElement
                                label='Add "and" condition'
                                onUserInput={(e) => {
                                    e.preventDefault();
                                    props.query.operator = 'and';
                                    setAddModal(true);
                                }} />
                            <ButtonElement
                                label='Add "or" condition'
                                onUserInput={(e) => {
                                    e.preventDefault();
                                    setAddModal(true);
                                    props.query.operator = 'or';
                            }} />
                        </div>
                    </div>
                    {toggleAdvancedButton}
                    {advancedButtons}
                </fieldset>
            </form>
        </div>);
    } else {
        // Add buttons are delegated to the QueryTree rendering so they
        // can be placed at the right level
        displayquery = <div>
            <p>Currently querying for any candidates with:</p>
      <form>
        <fieldset>
            <QueryTree items={props.query}
                // Only highlight the active group if the modal is open
                activeGroup={addModal ? modalQueryGroup : ''}
                buttonGroupStyle={bGroupStyle}
                removeQueryGroupItem={props.removeQueryGroupItem}
                mapModuleName={mapModuleName}
                mapCategoryName={mapCategoryName}
                newItem={(group) => {
                    setModalGroup(group);
                    setAddModal(true);
                }}
                setModalGroup={setModalGroup}
                backgroundColour='rgb(240, 240, 240)'
                newGroup={props.addNewQueryGroup}
                fulldictionary={props.fulldictionary}
                />
        </fieldset>
      </form>
      </div>;
    }
    const modal = addModal ? (
        <AddFilterModal
            query={modalQueryGroup}
            closeModal={() => setAddModal(false)}
            addQueryGroupItem={(querygroup, condition) => {
                const newquery = props.addQueryGroupItem(
                    querygroup,
                    condition,
                );
                setModalGroup(newquery);
            }}
            categories={props.categories}
            onCategoryChange={props.onCategoryChange}
            displayedFields={props.displayedFields}

            module={props.module}
            category={props.category}
         />)
         : '';
    const csvModalHTML = csvModal ? (
        <ImportCSVModal
            setQuery={props.setQuery}
            closeModal={() => setCSVModal(false)}
            />
    ) : '';

    const matchCount = queryMatches === null
        ? <div>&nbsp;</div> // So the header doesn't jump around
        : <div>Query matches <b>{queryMatches}</b> candidates</div>;
    return (<div>
          {modal}
          {csvModalHTML}
          <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
          }}>
              <h1>Current Query</h1>
              {matchCount}
          </div>
          <InfoPanel>
                Note that only candidates which you have permission to
                access in LORIS are included in results. Number of
                results may vary from other users running the same query.
          </InfoPanel>
          {displayquery}
      </div>
      );
}

/**
 * Calculates the payload to submit to the count endpoint
 * to run the query.
 *
 * @param {array} fields - the fields to query
 * @param {QueryGroup} filters - the root of the filters
 *
 * @return {object}
 */
function calcPayload(fields, filters) {
    let payload = {
        type: 'candidates',
        fields: fields.map((val) => {
            return {
                module: val.module,
                category: val.category,
                field: val.field,
            };
        },
        ),
    };
    if (filters.group.length > 0) {
        payload.criteria = filters;
    }
    return payload;
}

export default DefineFilters;
