import {createRoot} from 'react-dom/client';

import {useState} from 'react';

import Welcome from './welcome';
import DefineFilters from './definefilters';
import DefineFields from './definefields';
import ViewData from './viewdata';

import NextSteps from './nextsteps';

import useBreadcrumbs from './hooks/usebreadcrumbs';
import useVisits from './hooks/usevisits';
import useQuery from './hooks/usequery';
import {useSharedQueries, useLoadQueryFromURL} from './hooks/usesharedqueries';

import {useDataDictionary, useCategories} from './hooks/usedatadictionary';
import {ModuleDictionary, DictionaryCategory} from './types';
// @ts-ignore
import i18n from 'I18nSetup';

import hiStrings from '../locale/hi/LC_MESSAGES/dataquery.json';

type ActiveCategoryType = {
    module: string,
    category: string,
    currentDictionary: DictionaryCategory,
    changeCategory: (module: string, category: string) => void,
};

/**
 * React hook to manage the selection of an active module and category
 *
 * @param {function} retrieveModuleDictionary - a function that will return a
                         promise to retrieve the module's dictionary
 * @returns {ActiveCategoryType} - an object of the current dictionary and action to change it
 */
function useActiveCategory(
  retrieveModuleDictionary: (module: string) => Promise<ModuleDictionary>
): ActiveCategoryType {
  const [module, setModule] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [moduleDict, setModuleDict] = useState<DictionaryCategory>({});
  /**
   * Change the current category, retrieving the module dictionary from
   * the server if necessary.
   *
   * @param {string} module - the module to become active
   * @param {string} category - the category to become active
   * @returns {void}
   */
  const changeCategory = (module: string, category: string) => {
    retrieveModuleDictionary(module).then( (dict) => {
      setModule(module);
      setCategory(category);
      setModuleDict(dict[category]);
    });
  };
  return {
    module: module,
    category: category,
    currentDictionary: moduleDict,
    changeCategory: changeCategory,
  };
}

/**
 * Return the main page for the DQT
 *
 * @param {object} props - React props
 * @param {boolean} props.queryAdmin - true if the current user has permission to administer study queries
 * @param {string} props.username - The user accessing the app
 * @returns {React.ReactElement} - The main page of the app
 */
function DataQueryApp(props: {
    queryAdmin: boolean,
    username: string
}) {
  const [activeTab, setActiveTab] = useState('Info');
  useBreadcrumbs(activeTab, setActiveTab);

  const [queries, reloadQueries, queryActions]
        = useSharedQueries(props.username);

  const visits = useVisits();

  const [
    fulldictionary,
    fetchModuleDictionary,
  ] = useDataDictionary();
  const categories = useCategories();

  const activeCategory = useActiveCategory(
    fetchModuleDictionary,
  );

  const [query,
    loadQuery,
    selectedFields,
    fieldActions,
    criteriaActions,
  ] = useQuery();

  useLoadQueryFromURL(loadQuery);

  if (!categories) {
    return <div>Loading...</div>;
  }
  let content;

  /**
   * Maps a module name from the backend name to a human friendly name.
   *
   * @param {string} name - The module name
   * @returns {string} - the human friendly name
   */
  const mapModuleName = (name: string): string => {
    if (categories && categories.modules) {
      return categories.modules[name];
    }
    return name;
  };
    /**
     * Maps a category name from the backend name to a human friendly name.
     *
     * @param {string} module - The module name
     * @param {string} category - The category name within the module
     * @returns {string} - the human friendly name
     */
  const mapCategoryName = (module: string, category: string): string => {
    if (categories && categories.categories
            && categories.categories[module]) {
      return categories.categories[module][category];
    }
    return category;
  };

  /**
   * Function to retrieve a module's data dictionary from the server.
   *
   * @param {string} module - the module whole fields should be retrieved
   * @returns {void}
   */
  const getModuleFields = (module: string): void => {
    fetchModuleDictionary(module);
  };

  switch (activeTab) {
  case 'Info':
    content = <Welcome
      loadQuery={loadQuery}
      recentQueries={queries.recent}
      sharedQueries={queries.shared}
      topQueries={queries.top}

      starQuery={queryActions.star}
      unstarQuery={queryActions.unstar}
      shareQuery={queryActions.share}
      unshareQuery={queryActions.unshare}

      reloadQueries={reloadQueries}
      // Need dictionary related stuff
      // to display saved queries
      getModuleFields={fetchModuleDictionary}
      mapModuleName={mapModuleName}
      mapCategoryName={mapCategoryName}
      fulldictionary={fulldictionary}
      onContinue={() => setActiveTab('DefineFields')}

      queryAdmin={props.queryAdmin}
    />;
    break;
  case 'DefineFields':
    content = <DefineFields allCategories={categories}
      displayedFields={activeCategory.currentDictionary}

      defaultVisits={visits.default_}
      onChangeDefaultVisits={visits.modifyDefault}
      allVisits={visits.all}

      module={activeCategory.module}
      category={activeCategory.category}
      onCategoryChange={activeCategory.changeCategory}

      selected={selectedFields}
      setSelected={fieldActions.setFields}

      onFieldToggle={fieldActions.addRemoveField}

      onChangeVisitList={fieldActions.modifyVisits}

      removeField={fieldActions.remove}
      onAddAll={fieldActions.addMany}
      onRemoveAll={fieldActions.removeMany}
      onClearAll={fieldActions.clear}

      fulldictionary={fulldictionary}
    />;
    break;
  case 'DefineFilters':
    content = <DefineFilters
      fields={selectedFields}
      module={activeCategory.module}
      category={activeCategory.category}

      displayedFields={activeCategory.currentDictionary}

      categories={categories}
      onCategoryChange={activeCategory.changeCategory}

      addQueryGroupItem={criteriaActions.addQueryGroupItem}
      removeQueryGroupItem={criteriaActions.removeQueryGroupItem}
      addNewQueryGroup={criteriaActions.addNewQueryGroup}

      query={query}

      setQuery={criteriaActions.setCriteria}

      getModuleFields={getModuleFields}
      fulldictionary={fulldictionary}

      mapModuleName={mapModuleName}
      mapCategoryName={mapCategoryName}
    />;
    break;
  case 'ViewData':
    content = <ViewData
      fields={selectedFields}
      filters={query}

      fulldictionary={fulldictionary}

      onRun={reloadQueries}
    />;
    break;
  default:
    content = <div>Invalid tab</div>;
  }
  return <div>
    <div>{content}</div>
    <NextSteps page={activeTab} fields={selectedFields}
      filters={query}
      changePage={
        (page) => setActiveTab(page)
      }/>
  </div>;
}

declare const loris: any;
window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'dataquery', hiStrings);

  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
  const root = createRoot(element);

  root.render(
    <DataQueryApp
      queryAdmin={loris.userHasPermission('dataquery_admin')}
      username={loris.user.username}
    />,
  );
});

export default DataQueryApp;
