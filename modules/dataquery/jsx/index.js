import {useState} from 'react';

import Welcome from './welcome';
import DefineFilters from './definefilters';
import DefineFields from './definefields';
import ViewData from './viewdata';

import NextSteps from './nextsteps.js';

import useBreadcrumbs from './hooks/usebreadcrumbs';
import useVisits from './hooks/usevisits';
import useQuery from './hooks/usequery';
import {useSharedQueries, useLoadQueryFromURL} from './hooks/usesharedqueries';

import {useDataDictionary, useCategories} from './hooks/usedatadictionary';

/**
 * React hook to manage the selection of an active module and category
 *
 * @param {function} retrieveModuleDictionary - a function that will return a
                         promise to retrieve the module's dictionary
 *
 * @return {array}
 */
function useActiveCategory(retrieveModuleDictionary) {
    const [module, setModule] = useState(false);
    const [category, setCategory] = useState(false);
    const [moduleDict, setModuleDict] = useState({});
    // const moduleDict = fulldictionary[module][category] || {};
    const changeCategory = (module, category) => {
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
 *
 * @return {ReactDOM}
 */
function DataQueryApp(props) {
    const [activeTab, setActiveTab] = useState('Info');
    useBreadcrumbs(activeTab, setActiveTab);

    const [queries, reloadQueries, queryActions] = useSharedQueries();

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

    let content;

    const mapModuleName = (name) => {
        if (categories.modules) {
            return categories.modules[name];
        }
        return name;
    };
    const mapCategoryName = (module, category) => {
        if (categories.categories
            && categories.categories[module]) {
            return categories.categories[module][category];
        }
        return category;
    };

    const getModuleFields = (module, category) => {
        return fetchModuleDictionary(module).then(() => {
        });
    };

    switch (activeTab) {
        case 'Info':
            content = <Welcome
                        loadQuery={loadQuery}
                        recentQueries={queries.recent}
                        sharedQueries={queries.shared}
                        topQueries={queries.top_}

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
                module={activeCategory.module}
                category={activeCategory.category}

                dictionary={activeCategory.currentDictionary}
                displayedFields={activeCategory.currentDictionary}

                categories={categories}
                onCategoryChange={activeCategory.changeCategory}

                addQueryGroupItem={criteriaActions.addQueryGroupItem}
                removeQueryGroupItem={criteriaActions.removeQueryGroupItem}
                addNewQueryGroup={criteriaActions.addNewQueryGroup}

                fields={selectedFields}
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
                // FIXME: Validate page is valid
                (page) => setActiveTab(page)
        }/>
    </div>;
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <DataQueryApp queryAdmin={loris.userHasPermission('dataquery_admin')}/>,
    document.getElementById('lorisworkspace')
  );
});

export default DataQueryApp;
