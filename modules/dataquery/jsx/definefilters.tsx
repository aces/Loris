import {useState, useEffect} from 'react';
import {APIQueryField} from './types';
import {QueryTerm, QueryGroup} from './querydef';
import AddFilterModal from './definefilters.addfiltermodal';
import ImportCSVModal from './definefilters.importcsvmodal';
import QueryTree from './querytree';
import {CriteriaTerm} from './criteriaterm';
import InfoPanel from 'jsx/InfoPanel';
import {ButtonElement} from 'jsx/Form';
import {FullDictionary, DictionaryCategory} from './types';
import {calcPayload} from './calcpayload';
import {CategoriesAPIReturn} from './hooks/usedatadictionary';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';

/**
 * The define filters tab of the DQT
 *
 * @param {object} props - React props
 * @param {APIQueryField[]} props.fields - The fields selected
 * @param {QueryGroup} props.query - The criteria currently selected
 * @param {function} props.setQuery - Sets the current criteria
 * @param {CategoriesAPIReturn} props.categories - The list of categories displayed
 * @param {DictionaryCategory} props.displayedFields - All fields from the currently selected category
 * @param {string} props.module - The module of the currently selected module
 * @param {string} props.category - The currently selected category
 * @param {function} props.onCategoryChange - Callback to call when the category changes
 * @param {FullDictionary} props.fulldictionary - The fully loaded dictionary
 * @param {function} props.mapModuleName - Mapper from backend name to frontend name
 * @param {function} props.mapCategoryName - Mapper from backend name to frontend name
 * @param {function} props.getModuleFields - Function that will ensure a module's fields
 *                                           are fully populated in fulldictionary
 * @param {function} props.addQueryGroupItem - Function that will add a new term to the
 *                                             existing QueryGroup
 * @param {function} props.addNewQueryGroup - Function that will add a new QueryGroup subgroup
 *                                           to the existing QueryGroup
 * @param {function} props.removeQueryGroupItem - Function that will remove an item from a
 *                                                QueryGroup by index.
 * @returns {React.ReactElement} - The Define Filters page
 */
function DefineFilters(props: {
    fields: APIQueryField[],
    query: QueryGroup,
    categories: CategoriesAPIReturn,
    setQuery: (newcriteria: QueryGroup) => void,

    module: string,
    category: string,

    displayedFields: DictionaryCategory, // fields from currently selected category
    onCategoryChange: (module: string, category: string) => void,
    fulldictionary: FullDictionary,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
    getModuleFields: (module: string) => void,

    addQueryGroupItem: (
        querygroup: QueryGroup,
        condition: QueryTerm
    ) => QueryGroup,
    addNewQueryGroup: (group: QueryGroup) => void,
    removeQueryGroupItem: (group: QueryGroup, i: number) => QueryGroup,
}) : React.ReactElement {
  const {t} = useTranslation('dataquery');
  let displayquery: React.ReactNode = null;
  const [addModal, setAddModal] = useState(false);
  const [csvModal, setCSVModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // The subgroup used for the "Add Filter" modal window
  // to add to. Default to top level unless click from a
  // query group, in which case the callback changes it
  // to that group.
  const [modalQueryGroup, setModalGroup] = useState(props.query);
  const [deleteItemIndex, setDeleteItemIndex] = useState<number|null>(null);
  const [queryMatches, setQueryMatches] = useState(null);
  useEffect(() => {
    setQueryMatches(null);
    const payload = calcPayload(props.fields, props.query);
    fetch(
      '/dataquery/queries',
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
          '/dataquery/queries/'
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
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    marginTop: '1ex',
  };

  const mapModuleName = props.mapModuleName;
  const mapCategoryName = props.mapCategoryName;

  const advancedLabel = showAdvanced ? t('Hide Advanced',
    {ns: 'dataquery'}) : t('Show Advanced', {ns: 'dataquery'});
  let advancedButtons;
  const toggleAdvancedButton = (
    <div>
      <div style={bGroupStyle}>
        <ButtonElement
          label={advancedLabel}
          columnSize="col-sm-12"
          onUserInput={(e: React.MouseEvent) => {
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
          <p>{t('The "nested groups" options are advanced options for '
            +'queries that do not have any specific condition at the base'
            +' of the query. Use Add nested "or" condition groups if you'
            +' need to build a query of the form. (a or b) and (c or d)'
            +' [or (e and f)..]', {ns: 'dataquery'})}</p>
          <div style={bGroupStyle}>
            <ButtonElement
              label={t('Add nested "or" condition groups', {ns: 'dataquery'})}
              onUserInput={(e: React.MouseEvent) => {
                e.preventDefault();
                props.query.operator = 'and';
                props.addNewQueryGroup(props.query);
              }}
            />
          </div>
          <p>{t('Use Add nested "and" condition groups if you need to '
            +'build a query of the form (a and b) or (c and d) '
            +'[or (e and f)..]', {ns: 'dataquery'})}</p>
          <div style={bGroupStyle}>
            <ButtonElement
              label={t('Add nested "and" condition groups', {ns: 'dataquery'})}
              onUserInput={(e: React.MouseEvent) => {
                e.preventDefault();
                props.query.operator = 'or';
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
        <p>{t('Currently querying for ALL candidates.', {ns: 'dataquery'})}</p>
        <p>{t('You can add conditions by clicking one of the buttons below.',
          {ns: 'dataquery'})}</p>
        <p>{t('Click Add Condition to add one or more conditions to your'
          +' filters (ie. "Date Of Birth < 2015-02-15"). This is most likely'
          +' where you want to start your filters.', {ns: 'dataquery'})}</p>
        <p>{t('You can also import a population from a CSV by clicking the'
          +' Import from CSV button.', {ns: 'dataquery'})}</p>
        <p>{t('The advanced options are for queries that do not have a '
          +'condition to add at the base of the query.', {ns: 'dataquery'})}</p>
      </div>
      <form>
        <fieldset>
          <div style={{display: 'flex'}}>
            <div style={bGroupStyle}>
              <ButtonElement
                label={t('Add Condition', {ns: 'dataquery'})}
                columnSize="col-sm-12"
                onUserInput={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setAddModal(true);
                }}
              />
            </div>
            <div style={bGroupStyle}>
              <ButtonElement
                label={t('Import from CSV', {ns: 'dataquery'})}
                columnSize="col-sm-12"
                onUserInput={(e: React.MouseEvent) => {
                  e.preventDefault();
                  // Need to be sure that we've loaded
                  // candidate_parameters so it's in
                  // fulldictionary
                  props.getModuleFields(
                    'candidate_parameters',
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
            <p>{t('Use New "and" subgroup if the rest of the query you'
              +' need to write is a subgroup consisting of "and" '
              +'conditions. ie your query is of the form: (your condition'
              +' above) or (c and d [and e and f..])',
            {ns: 'dataquery'})}</p>
            <ButtonElement
              label={t('New "and" subgroup', {ns: 'dataquery'})}
              onUserInput={(e: React.MouseEvent) => {
                e.preventDefault();
                props.query.operator = 'or';
                props.addNewQueryGroup(props.query);
              }} />
            <p>{t('Use New "or" subgroup if the rest of the query you '
              +'need to write is a subgroup consisting of "or" '
              +'conditions. ie your query is of the form: (your '
              +'condition above) and (c or d [or e or f..])',
            {ns: 'dataquery'})}</p>
            <ButtonElement
              label={t('New "or" subgroup', {ns: 'dataquery'})}
              onUserInput={(e: React.MouseEvent) => {
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
      <p>{t('Currently querying for any candidates with:',
        {ns: 'dataquery'})}</p>

      <form>
        <fieldset>
          <div style={{
            display: 'flex', marginTop: '1ex',
            textDecoration: deleteItemIndex == 0 ?
              'line-through' : undefined,
          }}>
            <CriteriaTerm
              term={props.query.group[0]}
              mapModuleName={mapModuleName}
              mapCategoryName={mapCategoryName}
              fulldictionary={props.fulldictionary}
            />
            <div style={{alignSelf: 'center'}}><i
              className="fas fa-trash-alt"
              title={t('Delete Item', {ns: 'dataquery'})}
              onClick={() => {
                const newquery = props.removeQueryGroupItem(
                  props.query,
                  0
                );
                setModalGroup(newquery);
                setDeleteItemIndex(null);
              }}
              onMouseEnter={() => setDeleteItemIndex(0)}
              onMouseLeave={() => setDeleteItemIndex(null)}
              style={{cursor: 'pointer'}} />
            </div>
          </div>
          <div>
            <div style={bGroupStyle}>
              <ButtonElement
                label={t('Add "and" condition', {ns: 'dataquery'})}
                columnSize="col-sm-12"
                onUserInput={(e: React.MouseEvent) => {
                  e.preventDefault();
                  props.query.operator = 'and';
                  setAddModal(true);
                }} />
              <ButtonElement
                label={t('Add "or" condition', {ns: 'dataquery'})}
                columnSize="col-sm-12"
                onUserInput={(e: React.MouseEvent) => {
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
      <p>{t('Currently querying for any candidates with:',
        {ns: 'dataquery'})}</p>
      <form>
        <fieldset>
          <QueryTree
            items={props.query}
            // Only highlight the active group if the modal is open
            buttonGroupStyle={bGroupStyle}
            removeQueryGroupItem={props.removeQueryGroupItem}
            mapModuleName={mapModuleName}
            mapCategoryName={mapCategoryName}
            newItem={(group: QueryGroup) => {
              setModalGroup(group);
              setAddModal(true);
            }}
            setModalGroup={setModalGroup}
            backgroundColour='rgb(240, 240, 240)'
            newGroup={props.addNewQueryGroup}
            fulldictionary={props.fulldictionary}
            setDeleteItemIndex={setDeleteItemIndex}
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
    : <div>
      <Trans
        i18nKey="Query matches <bold>{{count}}</bold> candidates"
        ns="dataquery"
        values={{ count: queryMatches}}
        components={{bold: <b/>,}}
      />
  </div>;
  return (<div>
    {modal}
    {csvModalHTML}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    }}>
      <h1>{t('Current Query', {ns: 'dataquery'})}</h1>
      {matchCount}
    </div>
    <InfoPanel>
      {t('Note that only candidates which you have permission to '
        +'access in LORIS are included in results. Number of results'
        +' may vary from other users running the same query.',
      {ns: 'dataquery'})}
    </InfoPanel>
    {displayquery}
  </div>
  );
}

export default DefineFilters;
