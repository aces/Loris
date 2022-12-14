import {useState, useEffect} from 'react';

/**
 * React hook to load a list of valid visits from the server
 * and manage which should be selected by default
 *
 * @return {array|false}
 */
function useVisits() {
    const [allVisits, setAllVisits] = useState(false);
    const [defaultVisits, setDefaultVisits] = useState(false);
    useEffect(() => {
        if (allVisits !== false) {
            return;
        }
          fetch('/dqt/visitlist', {credentials: 'same-origin'})
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
        modifyDefault: (values) => {
            setDefaultVisits(values.map((el) => el.value));
        },
    };
}

export default useVisits;
