import {useState, useEffect} from 'react';

/**
 * React hook to load categories from the server.
 *
 * @return {array|false}
 */
function useCategories() {
    const [categories, setCategories] = useState(false);
    useEffect(() => {
        if (categories !== false) {
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

/**
 * React hook to use a data dictionary loaded from a LORIS server.
 *
 * @return {array}
 */
function useDataDictionary() {
    const [fulldictionary, setDictionary] = useState({});
    const [pendingModules, setPendingModules] = useState({});

    const fetchModuleDictionary = (module) => {
        if (fulldictionary[module]) {
            const promise = Promise.resolve(fulldictionary[module]);
            return promise;
        }
        if (pendingModules[module]) {
            return pendingModules[module];
        }
        const promise = new Promise((resolve, reject) => {
            fetch('/dictionary/module/' + module,
                {credentials: 'same-origin'}
            ).then((resp) => {
              if (!resp.ok) {
                throw new Error('Invalid response');
              }
              return resp.json();
            }).then((result) => {
              fulldictionary[module] = result;
              let newdictcache = {...fulldictionary};
              setDictionary(newdictcache);

              resolve(result);
            }).catch( (error) => {
                console.error(error);
                reject(error);
            });
        });
        // let newUsedModules = {...pendingModules};
        let newUsedModules = pendingModules;
        newUsedModules[module] = promise;
        setPendingModules(newUsedModules);
        return promise;
    };
    return [fulldictionary, fetchModuleDictionary];
}

export {useDataDictionary, useCategories};
