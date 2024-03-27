import {useState, useEffect} from 'react';
import {VisitOption} from '../types';

type UseVisitsReturn = {
    // All visits that exist on the server
    all: string[],
    // The subset of all that were selected by the user as defaults
    default_: string[],
    // Callback to set the defaults
    modifyDefault: (values: readonly VisitOption[]) => void,
};
/**
 * React hook to load a list of valid visits from the server
 * and manage which should be selected by default
 *
 * @returns {UseVisitsReturn} - list of default and all visits
 */
function useVisits(): UseVisitsReturn {
    const [allVisits, setAllVisits] = useState<string[]>([]);
    const [defaultVisits, setDefaultVisits] = useState<string[]>([]);
    useEffect(() => {
          fetch('/dataquery/visitlist', {credentials: 'same-origin'})
          .then((resp) => {
                  if (!resp.ok) {
                      throw new Error('Invalid response');
                  }
                  return resp.json();
          }).then((result) => {
                  setDefaultVisits(result.Visits);
                  setAllVisits(result.Visits);
                  }
          ).catch( (error) => {
                  console.error(error);
                  });
    }, []);
    return {
        all: allVisits,
        default_: defaultVisits,
        /**
         * Modify the default visits to use
         *
         * @param {VisitOption[]} values - The selected options from ReactSelect
         * @returns {void}
         */
        modifyDefault: (values: readonly VisitOption[]) => {
            setDefaultVisits(values.map((el) => el.value));
        },
    };
}

export default useVisits;
