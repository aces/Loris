import {useState, useEffect} from 'react';

import {ModuleDictionary, FullDictionary} from '../types';

interface ModuleList {
    [backendname: string]: string;
}
interface CategoryList {
    [backendname: string]: string;
}
interface ModuleCategories {
    [modulename: string]: CategoryList;
}

export type CategoriesAPIReturn = {
    modules: ModuleList;
    categories: ModuleCategories;
}
/**
 * React hook to load categories from the server.
 *
 * @returns {CategoriesAPIReturn} - Categories returned by dictionary API
 */
function useCategories(): CategoriesAPIReturn|null {
    const [categories, setCategories] = useState(null);
    useEffect(() => {
        if (categories !== null) {
            return;
        }
        fetch('/dictionary/categories', {credentials: 'same-origin'})
          .then((resp) => {
                  if (!resp.ok) {
                      throw new Error('Invalid response');
                  }
                  return resp.json();
          }).then((result) => {
                  setCategories(result);
                  }
          ).catch( (error) => {
                  console.error(error);
        });
    }, []);
    return categories;
}

type DataDictionaryReturnType = [
    FullDictionary,
    (module: string) => Promise<any>,
];

/**
 * React hook to use a data dictionary loaded from a LORIS server.
 *
 * @returns {array} - The retrieved dictionary and a callback to populate a new module into it
 */
function useDataDictionary(): DataDictionaryReturnType {
    const [fulldictionary, setDictionary] = useState<FullDictionary>({});
    // XXX: This should be {[module: string]: Promise<moduleDictionary>} but then
    // typescript says the key is always defined when we try and check if
    // it's set, need to figure out the correct way to do that, for now just use any
    const [pendingModules, setPendingModules] = useState<any>({});

    /**
     * Fetch a module's dictionary and cache it into fulldictionary.
     *
     * @param {string} module - The module name to fetch the dictionary for
     * @returns {Promise} - A promise that resolves to module's dictionary
     */
    const fetchModuleDictionary = (module: string): Promise<any> => {
        if (fulldictionary[module]) {
            const promise = Promise.resolve(fulldictionary[module]);
            return promise;
        }
        if (pendingModules[module]) {
            return pendingModules[module];
        }
        const promise: Promise<ModuleDictionary> = new Promise(
            (resolve, reject) => {
                fetch('/dictionary/module/' + module,
                    {credentials: 'same-origin'}
                ).then((resp) => {
                  if (!resp.ok) {
                    throw new Error('Invalid response');
                  }
                  return resp.json();
                }).then((result) => {
                  fulldictionary[module] = result;
                  setDictionary({...fulldictionary});

                  resolve(result);
                }).catch( (error) => {
                    console.error(error);
                    reject(error);
                });
            }
        );
        const newUsedModules = pendingModules;
        newUsedModules[module] = promise;
        setPendingModules(newUsedModules);
        return promise;
    };
    return [fulldictionary, fetchModuleDictionary];
}

export {useDataDictionary, useCategories};
