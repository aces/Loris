import ExpansionPanels from './components/expansionpanels';
import swal from 'sweetalert2';
import FieldDisplay from './fielddisplay';
import {useEffect, useState} from 'react';
import QueryTree from './querytree';
import {QueryTerm, QueryGroup} from './querydef';
import NameQueryModal from './welcome.namequerymodal';
import AdminQueryModal from './welcome.adminquerymodal';
import getDictionaryDescription from './getdictionarydescription';
import PaginationLinks from 'jsx/PaginationLinks';
import {CheckboxElement, TextboxElement, CTA} from 'jsx/Form';
import {APIQueryField} from './types';
import {FullDictionary} from './types';
import {FlattenedField, FlattenedQuery, VisitOption} from './types';
import ReplayIcon from './ReplayIcon';
import ShareIconA from './ShareIconA';
import {useTranslation} from 'react-i18next';
import 'I18nSetup';

declare const loris: any;
/**
 * Return the welcome tab for the DQT
 *
 * @param {object} props - React props
 * @param {FlattenedQuery[]} props.recentQueries - List of recent queries to display
 * @param {FlattenedQuery[]} props.topQueries - List of top queries to display pinned to the top of the tab
 * @param {FlattenedQuery[]} props.sharedQueries - List of queries shared with the current user
 * @param {function} props.onContinue - Callback when the "Continue" button is called in the welcome message
 * @param {boolean} props.queryAdmin - True if the current user can pin study queries
 * @param {function} props.reloadQueries - Reload the list of queries from the server
 * @param {function} props.loadQuery - Load a query to replace the active query
 * @param {function} props.starQuery - Function that will star a query
 * @param {function} props.unstarQuery - Function that will unstar a query
 * @param {function} props.shareQuery - Function that will share a query
 * @param {function} props.unshareQuery - Function that will unshare a query
 * @param {function} props.getModuleFields - Retrieve a module's fields from the backend and populate them into fulldictionary
 * @param {object} props.mapModuleName - Function to map the backend module name to a user friendly name
 * @param {object} props.mapCategoryName - Function to map the backend category name to a user friendly name
 * @param {object} props.fulldictionary - The dictionary of all modules that have been loaded
 * @returns {React.ReactElement} - The Welcome tab element
 */
function Welcome(props: {
    recentQueries: FlattenedQuery[]
    sharedQueries: FlattenedQuery[],
    topQueries: FlattenedQuery[],

    queryAdmin: boolean,

    onContinue: () => void,
    reloadQueries: () => void,
    shareQuery: (queryID: number) => void,
    unshareQuery: (queryID: number) => void,
    starQuery: (queryID: number) => void,
    unstarQuery: (queryID: number) => void,
    getModuleFields: (module: string) => void,
    loadQuery: (fields: APIQueryField[], filters: QueryGroup|null) => void,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
    fulldictionary:FullDictionary,
}) {
  const {t} = useTranslation('dataquery');
  const panels: {
        title: string,
        content: React.ReactElement,
        alwaysOpen: boolean,
        defaultOpen: boolean,
        id: string,
    }[] = [];
  if (props.topQueries.length > 0) {
    panels.push({
      title: t(
        'Study Query',
        {ns: 'dataquery', count: props.topQueries.length}
      ),
      content: (
        <div>
          <QueryList
            useAdminName={true}
            queries={props.topQueries}
            loadQuery={props.loadQuery}
            defaultCollapsed={true}
            getModuleFields={props.getModuleFields}
            mapModuleName={props.mapModuleName}
            mapCategoryName={props.mapCategoryName}
            fulldictionary={props.fulldictionary}
            queryAdmin={props.queryAdmin}
            reloadQueries={props.reloadQueries}
          />
        </div>
      ),
      alwaysOpen: false,
      defaultOpen: true,
      id: 'p1',
    });
  }
  panels.push({
    title: t('Recent Queries', {ns: 'dataquery'}),
    content: (
      <div>
        <QueryRunList
          queryruns={props.recentQueries}
          loadQuery={props.loadQuery}
          defaultCollapsed={false}
          starQuery={props.starQuery}
          unstarQuery={props.unstarQuery}
          shareQuery={props.shareQuery}
          unshareQuery={props.unshareQuery}
          reloadQueries={props.reloadQueries}
          getModuleFields={props.getModuleFields}
          mapModuleName={props.mapModuleName}
          mapCategoryName={props.mapCategoryName}
          fulldictionary={props.fulldictionary}
          queryAdmin={props.queryAdmin}
        />
      </div>
    ),
    alwaysOpen: false,
    defaultOpen: true,
    id: 'p3',
  });

  if (props.sharedQueries.length > 0) {
    panels.push({
      title: t('Shared Queries', {ns: 'dataquery'}),
      content: (
        <div>
          <QueryList
            useAdminName={false}
            queries={props.sharedQueries}
            loadQuery={props.loadQuery}
            defaultCollapsed={true}
            getModuleFields={props.getModuleFields}
            mapModuleName={props.mapModuleName}
            mapCategoryName={props.mapCategoryName}
            fulldictionary={props.fulldictionary}
            queryAdmin={props.queryAdmin}
          />
        </div>
      ),
      alwaysOpen: false,
      defaultOpen: true,
      id: 'p4',
    });
  }

  return (
    <div>
      <h1 style={{
        color: '#0a3572',
        textAlign: 'center',
        padding: '30px 0 0 0',
      }}>
        {t('Welcome to the Data Query Tool', {ns: 'dataquery'})}
      </h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '30px 0',
      }}>
        <CTA
          label={t('Continue to Define Fields', {ns: 'dataquery'})}
          onUserInput={props.onContinue}
          buttonClass="btn btn-primary dqt-welcome-cta"
        />
      </div>
      <ExpansionPanels panels={panels} />
    </div>
  );
}

/**
 * Display a list of queries
 *
 * @param {object} props - React props
 * @param {FlattenedQuery[]} props.queries - The list of queries to show in the list
 * @param {boolean} props.queryAdmin - True if the current user can pin study queries
 * @param {boolean} props.useAdminName - True if the display should display the admin name of the query
 * @param {boolean} props.defaultCollapsed - True if the queries should default to be collapsed
 * @param {function} props.starQuery - Function that will star a query
 * @param {function} props.unstarQuery - Function that will unstar a query
 * @param {function} props.shareQuery - Function that will share a query
 * @param {function} props.unshareQuery - Function that will unshare a query
 * @param {function} props.loadQuery - Load a query to replace the active query
 * @param {function} props.reloadQueries - Reload the list of queries from the server
 * @param {function} props.getModuleFields - Retrieve a module's fields from the backend and populate them into fulldictionary
 * @param {object} props.mapModuleName - Function to map the backend module name to a user friendly name
 * @param {object} props.mapCategoryName - Function to map the backend category name to a user friendly name
 * @param {FullDictionary} props.fulldictionary - The dictionary of all modules that have been loaded
 * @returns {React.ReactElement} - The React element
 */
function QueryList(props: {
    queries: FlattenedQuery[],
    defaultCollapsed: boolean,

    useAdminName: boolean,
    queryAdmin: boolean,

    starQuery?: (queryID: number) => void,
    unstarQuery?: (queryID: number) => void,
    shareQuery?: (queryID: number) => void,
    unshareQuery?: (queryID: number) => void,

    reloadQueries?: () => void,
    loadQuery: (fields: APIQueryField[], filters: QueryGroup|null) => void,

    getModuleFields: (module: string) => void,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
    fulldictionary:FullDictionary,
}) {
  const {t} = useTranslation('dataquery');
  const [nameModalID, setNameModalID] = useState<number|null>(null);
  const [adminModalID, setAdminModalID] = useState<number|null>(null);
  const [queryName, setQueryName] = useState<string|null>(null);
  const [defaultModalQueryName, setDefaultModalQueryName]
        = useState<string>('');

  const [onlyStarred, setOnlyStarred] = useState<boolean>(false);
  const [onlyShared, setOnlyShared] = useState<boolean>(false);
  const [onlyNamed, setOnlyNamed] = useState<boolean>(false);
  const [noDuplicates, setNoDuplicates] = useState<boolean>(false);
  const [queryFilter, setQueryFilter] = useState<string>('');
  const [fullQuery, setFullQuery]
        = useState<boolean>(!props.defaultCollapsed);
  const [unpinAdminQuery, setUnpinAdminQuery] = useState<number|null>(null);
  const [adminPinAction, setAdminPinAction] = useState<string>('');

  useEffect(() => {
    const modules = new Set<string>();
    props.queries.forEach((query) => {
      query.fields.forEach((field) => {
        modules.add(field.module);
      });
      if (query.criteria) {
        /**
         * Add all modules used in the QueryGroup to the modules
         * set so their fields can be fetched.
         *
         * @param {QueryGroup} querygroup - The query group from the criteria
         * @returns {void}
         */
        const addModules = (querygroup: QueryGroup) => {
          querygroup.group.forEach((item) => {
            if (item instanceof QueryTerm) {
              modules.add(item.module);
            } else if (item instanceof QueryGroup) {
              addModules(item);
            }
          });
        };
        addModules(query.criteria);
      }
    });
    modules.forEach((module: string) => {
      props.getModuleFields(module);
    });
  }, [props.queries]);

  useEffect(() => {
    if (!nameModalID || !queryName) {
      return;
    }

    // Prevent re-triggering by resetting the state
    // before fetching, cache the values we need
    // to build the URI before setting
    const id = nameModalID;
    const name = queryName;

    setNameModalID(null);
    setQueryName(null);

    fetch(
      '/dataquery/queries/' + id
                + '?name=' + encodeURIComponent(name),
      {
        method: 'PATCH',
        credentials: 'same-origin',
      },
    ).then((response) => {
      setQueryName(null);
      if (response.ok) {
        if (props.reloadQueries) {
          props.reloadQueries();
        }
      }
    });
  }, [queryName]);

  useEffect(() => {
    if (!adminModalID || !queryName) {
      return;
    }

    // Prevent re-triggering by resetting the state
    // before fetching, cache the values we need
    // to build the URI before setting
    const id = adminModalID;
    const name = queryName;

    setAdminModalID(null);
    setQueryName(null);

    let param = '';
    if (adminPinAction.includes('top')) {
      param += 'adminname=' + encodeURIComponent(name);
    }
    if (adminPinAction.includes('dashboard')) {
      if (param != '') param += '&';
      param += 'dashboardname=' + encodeURIComponent(name);
    }
    if (adminPinAction.includes('login')) {
      if (param != '') param += '&';
      param += 'loginname=' + encodeURIComponent(name);
    }
    fetch(
      '/dataquery/queries/' + id
                + '?' + param,
      {
        method: 'PATCH',
        credentials: 'same-origin',
      },
    ).then((response) => {
      if (response.ok) {
        if (props.reloadQueries) {
          props.reloadQueries();
        }
      }
    });
  }, [queryName]);

  useEffect(() => {
    if (!unpinAdminQuery) {
      return;
    }

    // Prevent re-triggering by resetting the state
    // before fetching, cache the values we need
    // to build the URI before setting
    const id = unpinAdminQuery;
    setUnpinAdminQuery(null);

    fetch(
      '/dataquery/queries/' + id
                + '?adminname=',
      {
        method: 'PATCH',
        credentials: 'same-origin',
      },
    ).then((response) => {
      if (response.ok) {
        if (props.reloadQueries) {
          props.reloadQueries();
        }
      }
    });
  }, [unpinAdminQuery]);

  const nameModal: React.ReactNode = (
    nameModalID == null
      ? null
      : <NameQueryModal
        onSubmit={(name) => setQueryName(name)}
        closeModal={() => setNameModalID(null) }
        defaultName={defaultModalQueryName}
        QueryID={nameModalID}
      />);
  const adminModal = adminModalID == null ? '' :
    <AdminQueryModal
      onSubmit={(name, topQ, dashboardQ, loginQ) => {
        let boolList = '';
        if (topQ) boolList += 'top';
        if (dashboardQ) boolList += 'dashboard';
        if (loginQ) boolList += 'login';
        if (!topQ && !dashboardQ && !loginQ) {
          throw new Error('Modal promise should not have resolved');
        }
        setAdminPinAction(boolList);
        setQueryName(name);
      }}
      closeModal={() => setAdminModalID(null)}
      defaultName={defaultModalQueryName}
      QueryID={adminModalID}
    />;

  let displayedQueries = props.queries;
  if (onlyStarred === true) {
    displayedQueries = displayedQueries.filter(
      (val) => val.Starred
    );
  }
  if (onlyShared === true) {
    displayedQueries = displayedQueries.filter(
      (val) => val.Public
    );
  }
  if (onlyNamed === true) {
    displayedQueries = displayedQueries.filter(
      (val) => {
        if (val.Name || val.Name == '') {
          return true;
        }
        return false;
      }
    );
  }
  if (noDuplicates === true) {
    const queryList: {[queryID: number]: FlattenedQuery} = {};
    const newDisplayedQueries: FlattenedQuery[] = [];
    displayedQueries.forEach((val) => {
      if (queryList.hasOwnProperty(val.QueryID)) {
        return;
      }
      queryList[val.QueryID] = val;
      newDisplayedQueries.push(val);
    });
    displayedQueries = newDisplayedQueries;
  }
  if (queryFilter != '') {
    displayedQueries = displayedQueries.filter(
      (val) => {
        const lowerQF = queryFilter.toLowerCase();
        const nameContains = val.Name
                    && val.Name.toLowerCase().includes(lowerQF);
        const runTimeContains = val.RunTime &&
                    val.RunTime.includes(lowerQF);
        const sharedByContains = val.SharedBy &&
                    val.SharedBy.map( (s) => s.toLowerCase()).includes(lowerQF);
        let anyFieldMatches = false;
        let anyFilterMatches = false;
        if (val.fields) {
          for (const field of val.fields) {
            if (field.field.toLowerCase().includes(lowerQF)) {
              anyFieldMatches = true;
              break;
            }
            const description = getDictionaryDescription(
              field.module,
              field.category,
              field.field,
              props.fulldictionary,
            );
            if (description.toLowerCase().includes(lowerQF)) {
              anyFieldMatches = true;
              break;
            }
          }
        }
        if (val.criteria) {
          /**
           * Sets the anyFieldMatches variable to true if any
           * criteria in the QueryGroup matches the filter criteria.
           *
           * @param {QueryGroup} group - The query group being checked
           * @returns {void}
           */
          const itemInGroupMatches = (group: QueryGroup): void => {
            for (const field of group.group) {
              if (field instanceof QueryTerm) {
                if (field.fieldname
                                    && field.fieldname.toLowerCase().includes(
                                      lowerQF
                                    )) {
                  anyFieldMatches = true;
                  return;
                }
                const description = getDictionaryDescription(
                  field.module,
                  field.category,
                  field.fieldname,
                  props.fulldictionary,
                );
                if (description
                                    && description.toLowerCase().includes(
                                      lowerQF
                                    )
                ) {
                  anyFilterMatches = true;
                  return;
                }
              } else if (field instanceof QueryGroup) {
                itemInGroupMatches(field);
              }
            }
          };
          itemInGroupMatches(val.criteria);
        }
        return nameContains
                    || runTimeContains
                    || sharedByContains
                    || anyFieldMatches
                    || anyFilterMatches;
      });
  }
  const starFilter = props.starQuery ?
    <CheckboxElement name='onlystar' label={t('Starred Only',
      {ns: 'dataquery'})}
    value={onlyStarred}
    offset=''
    onUserInput={
      (name: string, value: boolean) => setOnlyStarred(value)
    }/> : <span />;
  const shareFilter = props.shareQuery ?
    <CheckboxElement name='onlyshare' label={t('Shared Only',
      {ns: 'dataquery'})}
    value={onlyShared}
    offset=''
    onUserInput={
      (name: string, value: boolean) => setOnlyShared(value)
    }/>
    : <span />;
    // Use whether shareQuery prop is defined as proxy
    // to determine if this is a shared query or a recent
    // query list
  const duplicateFilter = props.shareQuery ?
    <CheckboxElement name='noduplicate'
      label={t('No run times (eliminate duplicates)', {ns: 'dataquery'})}
      value={noDuplicates}
      offset=''
      onUserInput={
        (name: string, value: boolean) => setNoDuplicates(value)
      }/>
    : <span />;
  return (<div>
    {nameModal}
    {adminModal}
    <div style={{
      borderBottom: 'thin solid black',
      marginBottom: '1em',
      paddingBottom: '1ex',
    }}>
      <TextboxElement name='filter'
        label={t('Filter', {ns: 'dataquery', count: 1})}
        value={queryFilter}
        onUserInput={
          (name: string, value: string) => setQueryFilter(value)
        }/>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {starFilter}
        {shareFilter}
        <CheckboxElement name='onlynamed' label={t('Named Only',
          {ns: 'dataquery'})}
        value={onlyNamed}
        offset=''
        onUserInput={
          (name: string, value: boolean) => setOnlyNamed(value)
        }/>
        {duplicateFilter}
        <CheckboxElement name='fullquery' label={t('Collapse queries',
          {ns: 'dataquery'})}
        value={!fullQuery}
        offset=''
        onUserInput={
          (name: string, value: boolean) =>
            setFullQuery(!value)
        }/>
      </div>
    </div>
    <Pager>
      {displayedQueries.map((query, idx) => {
        return <SingleQueryDisplay key={idx} query={query}
          useAdminName={props.useAdminName}
          includeRuns={!noDuplicates}
          showFullQueryDefault={fullQuery}
          mapCategoryName={props.mapCategoryName}
          mapModuleName={props.mapModuleName}

          loadQuery={props.loadQuery}

          starQuery={props.starQuery ?
            props.starQuery :
            () => {
              return;
            }
          }

          unstarQuery={props.unstarQuery ?
            props.unstarQuery :
            () => {
              return;
            }
          }

          shareQuery={props.shareQuery ?
            props.shareQuery :
            () => {
              return;
            }
          }
          unshareQuery={
            props.unshareQuery ?
              props.unshareQuery :
              () => {
                return;
              }
          }

          setNameModalID={setNameModalID}
          setDefaultModalQueryName={setDefaultModalQueryName}
          setAdminModalID={setAdminModalID}

          queryAdmin={props.queryAdmin}
          unpinAdminQuery={setUnpinAdminQuery}
          fulldictionary={props.fulldictionary}
        />;
      })}
    </Pager>
  </div>);
}

/**
 * A single list item in a saved/shared query
 *
 * @param {object} props - React props
 * @param {function} props.mapModuleName - Function to map the backend module name to a user friendly name
 * @param {function} props.mapCategoryName - Function to map the backend category name to a user friendly name
 * @param {FullDictionary} props.fulldictionary - The dictionary of all modules that have been loaded
 * @param {QueryGroup} props.criteria - The query criteria.
 * @returns {React.ReactElement} - The React element
 */
function QueryListCriteria(props: {
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
    fulldictionary: FullDictionary,
    criteria: QueryGroup
}) {
  const {t} = useTranslation('dataquery');
  if (!props.criteria || !props.criteria.group
            || props.criteria.group.length == 0) {
    return <i>{t('(No filters for query)', {ns: 'dataquery'})}</i>;
  }
  return (<QueryTree
    items={props.criteria}
    buttonGroupStyle={{display: 'none'}}
    mapModuleName={props.mapModuleName}
    mapCategoryName={props.mapCategoryName}
    backgroundColour='rgb(240, 240, 240)'
    fulldictionary={props.fulldictionary}
  />);
}

/**
 * Paginate the results
 *
 * @param {object} props - React props
 * @param {React.ReactElement[]} props.children - The elements to page
 * @returns {React.ReactElement} - The React element
 */
function Pager(props: {
    children: React.ReactElement[],
}) {
  const [pageNum, setPageNum] = useState<number>(1);
  const rowsPerPage = 5;

  const start = (pageNum-1)*rowsPerPage;
  const end = (pageNum)*rowsPerPage;
  const displayedRange = props.children.slice(start, end);
  return <div>
    <PaginationLinks
      Total={props.children.length}
      onChangePage={setPageNum}
      RowsPerPage={rowsPerPage}
      Active={pageNum}
      // label={t('Page', {ns: 'dataquery'})}
    />
    {displayedRange}
    <PaginationLinks
      Total={props.children.length}
      onChangePage={setPageNum}
      RowsPerPage={rowsPerPage}
      Active={pageNum}
      // label={t('Page', {ns: 'dataquery'})}
    />
  </div>;
}

/**
 * Display a single query in a QueryList
 *
 * @param {object} props - React props
 * @param {FlattenedQuery} props.query - The query to display
 * @param {boolean} props.includeRuns - True if query run information should be displayed
 * @param {function} props.starQuery - Function that will star a query
 * @param {function} props.unstarQuery - Function that will unstar a query
 * @param {function} props.shareQuery - Function that will share a query
 * @param {function} props.unshareQuery - Function that will unshare a query
 * @param {function} props.unpinAdminQuery - Function that will unpin a query
 * @param {function} props.loadQuery - Load a query to replace the active query
 * @param {function} props.setDefaultModalQueryName - Function to set the default name to show in the name query modal
 * @param {function} props.setNameModalID - Function that will set the queryID to show a name modal for
 * @param {boolean} props.showFullQueryDefault - True if the query should be expanded by default
 * @param {boolean} props.queryAdmin - True if the admin query options (ie. pin query) should be shown
 * @param {boolean} props.useAdminName - True if the display should display the admin name of the query
 * @param {function} props.setAdminModalID - Function that will set the queryID to show an admin modal for
 * @param {object} props.mapModuleName - Function to map the backend module name to a user friendly name
 * @param {object} props.mapCategoryName - Function to map the backend category name to a user friendly name
 * @param {object} props.fulldictionary  The dictionary of all modules that have been loaded
 * @returns {React.ReactElement} - The React element
 */
function SingleQueryDisplay(props: {
    query: FlattenedQuery,
    loadQuery: (fields: APIQueryField[], filters: QueryGroup|null) => void,
    includeRuns: boolean,
    showFullQueryDefault: boolean,

    shareQuery: (queryID: number) => void,
    unshareQuery: (queryID: number) => void,
    starQuery: (queryID: number) => void,
    unstarQuery: (queryID: number) => void,

    useAdminName: boolean,

    queryAdmin: boolean,
    unpinAdminQuery: (queryID: number) => void,
    setAdminModalID: (queryID: number) => void,
    setDefaultModalQueryName: (name: string) => void,
    setNameModalID: (queryID: number) => void,

    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
    fulldictionary:FullDictionary,
}) {
  const {t} = useTranslation('dataquery');
  const [showFullQuery, setShowFullQuery] =
        useState(props.showFullQueryDefault);
    // Reset the collapsed state if the checkbox gets toggled
  useEffect(() => {
    setShowFullQuery(props.showFullQueryDefault);
  }, [props.showFullQueryDefault]);

  let starredIcon;
  let sharedIcon;
  const query = props.query;

  if (query.Starred) {
    starredIcon = <span
      style={{cursor: 'pointer'}}
      onClick={
        () => props.unstarQuery(query.QueryID)
      }
      title={t('Unstar', {ns: 'dataquery'})}
      className="fa-stack">
      <i style={
        {color: 'yellow'}}
      className="fas fa-star fa-stack-1x"
      />
      <i style={
        {color: 'black'}}
      className="far fa-star fa-stack-1x"
      />
    </span>;
  } else {
    starredIcon = <span
      style={{cursor: 'pointer'}}
      title={t('Star', {ns: 'dataquery'})}
      onClick={
        () => props.starQuery(query.QueryID)
      }
      className="fa-stack">
      <i className="far fa-star fa-stack-1x"/>
    </span>;
  }

  if (query.Public) {
    sharedIcon = <ShareIcon
      isShared={query.Public}
      title={t('Unshare', {ns: 'dataquery'})}
      onClick={
        () =>
          props.unshareQuery(query.QueryID)
      }
    />;
  } else {
    sharedIcon = <ShareIcon
      isShared={query.Public}
      title={t('Share', {ns: 'dataquery'})}
      onClick={
        () =>
          props.shareQuery(query.QueryID)
      }
    />;
  }

  /**
   * Load this query as the current query, replacing whatever query
   * is currently loaded.
   */
  const loadQuery = () => {
    const newfields: APIQueryField[] = query.fields.map(
      (field: FlattenedField) => {
        const f: APIQueryField = {
          module: field.module,
          category: field.category,
          field: field.field,
        };
        if (field.visits) {
          f.visits = field.visits.map(
            (visit: VisitOption) => visit.value
          );
        }
        return f;
      });
    props.loadQuery(
      newfields,
      query.criteria || null,
    );
    swal.fire({
      type: 'success',
      title: t('Query Loaded', {ns: 'dataquery'}),
      text: t('Successfully loaded query.', {ns: 'dataquery'}),
    });
  };

  const loadIcon = <LoadIcon onClick={loadQuery} />;

  const pinIcon = props.queryAdmin
    ? <span title={t('Pin Study Query', {ns: 'dataquery'})}
      style={{cursor: 'pointer'}}
      className="fa-stack"
      onClick={() => {
        props.setDefaultModalQueryName(query.Name || '');
        props.setAdminModalID(query.QueryID);
      }
      }>
      <i className="fas fa-thumbtack fa-stack-1x"> </i>
    </span>
    : <div />;

  let msg: React.ReactNode = null;
  if (query.RunTime) {
    const dateFormatter = new Intl.DateTimeFormat(
      loris.user.langpref.replace('_', '-'),
      {
        dateStyle: 'long',
        timeStyle: 'medium',
      }
    );
    const runTime = dateFormatter.format(new Date(query.RunTime));


    let desc = query.Name
      ? <span>
        <b>{query.Name}</b>
             &nbsp;<i>{t('(Run on {{runTime}})', {ns: 'dataquery',
          runTime: runTime})}</i>
      </span>
      : <i>{t('You ran this query on {{runTime}}', {ns: 'dataquery',
        runTime: runTime})}</i>;
    if (!props.includeRuns) {
      desc = query.Name
        ? <span>
          <b>{query.Name}</b>
        </span>
        : <i>{t('You ran this query', {ns: 'dataquery'})}</i>;
    }

    const nameIcon = <NameIcon
      t={t}
      onClick={() => {
        props.setDefaultModalQueryName(query.Name || '');
        props.setNameModalID(query.QueryID);
      }} />;
    msg = <div>{desc}
            &nbsp;{loadIcon}{nameIcon}{starredIcon}{pinIcon}{sharedIcon}
    </div>;
  } else if (query.SharedBy) {
    const desc = query.Name
      ? <span>
        <b>{query.Name}</b>
                &nbsp;<i>{t('(Shared by {{sharedBy}})', {ns: 'dataquery',
          sharedBy: query.SharedBy.join(', ')})}</i>
      </span>
      : <i>{t('Query shared by {{sharedBy}}', {ns: 'dataquery',
        sharedBy: query.SharedBy.join(', ')})}</i>;
    msg = <div>{desc}
             &nbsp;{loadIcon}{pinIcon}
    </div>;
  } else if (query.Name || query.AdminName) {
    const name = props.useAdminName ? query.AdminName : query.Name;
    const unpinIcon = props.queryAdmin
      ? <span title={t('Name Query', {ns: 'dataquery'})}
        style={{cursor: 'pointer'}}
        className="fa-stack"
        onClick={() => {
          props.unpinAdminQuery(query.QueryID);
        }
        }>
        <i className="fas fa-slash fa-stack-1x"></i>
        <i className="fas fa-thumbtack fa-stack-1x"> </i>
      </span>
      : <div />;
    msg = <div><b>{name}</b>&nbsp;{loadIcon}{unpinIcon}</div>;
  } else {
    console.error('Invalid query. Neither shared nor recent', query);
  }

  const queryDisplay = !showFullQuery ? <div /> :
    <div style={{display: 'flex', flexWrap: 'wrap'}}>
      <div>
        <h3>{t('Field', {ns: 'dataquery', count: 99})}</h3>
        {query.fields.map(
          (fieldobj, fidx) =>
            <FieldDisplay
              key={fidx}
              fieldname={fieldobj.field}
              module={fieldobj.module}
              category={fieldobj.category}
              fulldictionary={props.fulldictionary}
              mapModuleName={props.mapModuleName}
              mapCategoryName={props.mapCategoryName}
            />
        )}
      </div>
      {query.criteria ?
        <div>
          <h3>{
            t('Filter', {ns: 'dataquery', count: query.criteria.group.length})
          }</h3>
          <QueryListCriteria
            criteria={query.criteria}
            fulldictionary={props.fulldictionary}
            mapModuleName={props.mapModuleName}
            mapCategoryName={props.mapCategoryName}
          />
        </div>
        : <div/>
      }
    </div>;
  const expandIcon = <i style={{
    paddingRight: '1ex',
    cursor: 'pointer',
  }}
  className={'fas fa-chevron-' + (showFullQuery ? 'down' : 'right')}
  onClick={() => setShowFullQuery(!showFullQuery)}
  ></i>;
  return (<div style={{
    // border: 'thin solid black',
    overflow: 'auto',
  }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
    }}>
      {expandIcon}
      {msg}
    </div>
    {queryDisplay}
    <hr />
  </div>);
}

/**
 * Display a list of Query Runs
 *
 * @param {object} props - React props
 * @param {array} props.queryruns - A list of query runs as returned by the API
 * @param {boolean} props.queryAdmin - True if the current user can pin study queries
 * @param {boolean} props.defaultCollapsed - True if the queries should not be expanded by default
 * @param {function} props.starQuery - Function that will star a query
 * @param {function} props.unstarQuery - Function that will unstar a query
 * @param {function} props.shareQuery - Function that will share a query
 * @param {function} props.unshareQuery - Function that will unshare a query
 * @param {function} props.reloadQueries - Reload the list of queries from the server
 * @param {function} props.loadQuery - Load a query to replace the active query
 * @param {function} props.getModuleFields - Retrieve a module's fields from the backend and populate them into fulldictionary
 * @param {function} props.mapModuleName - Function to map the backend module name to a user friendly name
 * @param {function} props.mapCategoryName - Function to map the backend category name to a user friendly name
 * @param {FullDictionary} props.fulldictionary  The dictionary of all modules that have been loaded
 * @returns {React.ReactElement} - The React element
 */
function QueryRunList(props:{
    queryruns: FlattenedQuery[],

    queryAdmin: boolean,

    defaultCollapsed: boolean,

    starQuery: (queryID: number) => void,
    unstarQuery: (queryID: number) => void,
    shareQuery: (queryID: number) => void,
    unshareQuery: (queryID: number) => void,

    reloadQueries: () => void,
    loadQuery: (fields: APIQueryField[], filters: QueryGroup|null) => void,

    getModuleFields: (module: string) => void,
    mapModuleName: (module: string) => string,
    mapCategoryName: (module: string, category: string) => string,
    fulldictionary:FullDictionary,
}) {
  // When <QueryList /> was written there wasn't a clear distinction between
  // runs and queries, so we need to flatten all the information into a single
  // object that it thinks is a query and not a query run.
  const queries: FlattenedQuery[] = props.queryruns;

  return (<QueryList
    useAdminName={false}

    queries={queries}
    loadQuery={props.loadQuery}
    defaultCollapsed={false}

    starQuery={props.starQuery}
    unstarQuery={props.unstarQuery}

    shareQuery={props.shareQuery}
    unshareQuery={props.unshareQuery}

    reloadQueries={props.reloadQueries}

    getModuleFields={props.getModuleFields}
    mapModuleName={props.mapModuleName}
    mapCategoryName={props.mapCategoryName}
    fulldictionary={props.fulldictionary}
    queryAdmin={props.queryAdmin}
  />);
}

/**
 * An icon to load a query
 *
 * @param {object} props - React props
 * @param {function} props.onClick - Handler to call when icon clicked
 * @returns {React.ReactElement} - The React element
 */
function LoadIcon(props: {
    onClick?: () => void,
}) {
  const {t} = useTranslation('dataquery');
  return <span onClick={props.onClick}
    style={{
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'text-top',
      width: '35px',
      height: '28px',
    }}
    title={t('Reload query', {ns: 'dataquery'})}
    className="fa-stack">
    <ReplayIcon />
  </span>;
}

/**
 * An icon to share a query
 *
 * @param {object} props - React props
 * @param {function} props.onClick - Handler to call when icon clicked
 * @param {function} props.title - the title to show on hover
 * @param {function} props.isShared - True if the query is currently shared
 * @returns {React.ReactElement} - The React element
 */
function ShareIcon(props: {
    onClick?: () => void,
    title?: string,
    isShared?: boolean,
}) {
  return <span className="fa-stack"
    style={{
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'text-top',
      width: '35px',
      height: '28px',
    }}
    title={props.title}
    onClick={props.onClick}>
    <ShareIconA isShared={props.isShared} />
  </span>;
}

/**
 * An icon to name a query
 *
 * @param {object} props - React props
 * @param {any} props.t - useTranslation
 * @param {function} props.onClick - Handler to call when icon clicked
 *
 * @returns {React.ReactElement} - The React element
 */
function NameIcon(props: {
  t: any,
  onClick?: () => void
}): React.ReactElement {
  return (<span title={props.t('Name Query', {ns: 'dataquery'})}
    style={{cursor: 'pointer'}}
    className="fa-stack"
    onClick={props.onClick}
  >
    <i className="fas fa-pencil-alt fa-stack-1x"> </i>
  </span>);
}

export default Welcome;
