import {useState, useEffect} from 'react';
import {Tabs, TabSteps} from '../nextsteps';

/**
 * Converts a string name of a callback function to the callback
 * itself.
 *
 * @param {string} name - The name of the callback function
 * @returns {Function | null} - The callback if available
 */
function getCallback(name: string): (() => void) | null {
    const namepieces = name.split('.');
    let level: any = window;

    for (const name of namepieces) {
         if (level[name]) {
             level = level[name];
         } else {
             // We have not reached the end, but the
             // name was not defined, return null
             return null;
         }
    }
    return level;
}

/**
 * React hook to load a list of valid visits from the server
 * and manage which should be selected by default
 *
 * @returns {TabSteps} - list of default and all visits
 */
function useWidgets(): TabSteps {
    const [steps, setSteps] = useState<TabSteps>({});
    useEffect(() => {
          fetch('/dataquery/widgets', {credentials: 'same-origin'})
          .then((resp) => {
                  if (!resp.ok) {
                      throw new Error('Invalid response');
                  }
                  return resp.json();
          }).then((result) => {
              const steps: TabSteps = {
                  [Tabs.Info]: [],
                  [Tabs.Fields]: [],
                  [Tabs.Filters]: [],
                  [Tabs.Data]: [],
              };
              for (const widget of result) {
                  const func = getCallback(widget.callback);
                  if (func === null) {
                      console.error(
                          'Unknown callback function',
                          widget.callback
                      );
                      continue;
                  }

                  switch (widget.tab) {
                  case 'info':
                      if (steps[Tabs.Info]) {
                          steps[Tabs.Info].push({
                             label: widget.label,
                             action: func,
                          });
                      }
                      break;
                  case 'fields':
                      if (steps[Tabs.Fields]) {
                          steps[Tabs.Fields].push({
                             label: widget.label,
                             action: func,
                          });
                      }
                      break;
                  case 'filters':
                      if (steps[Tabs.Filters]) {
                          steps[Tabs.Filters].push({
                             label: widget.label,
                             action: func,
                          });
                      }
                      break;
                  case 'data':
                      if (steps[Tabs.Data]) {
                          steps[Tabs.Data].push({
                             label: widget.label,
                             action: func,
                          });
                      }
                      break;
                  default:
                       throw new Error('Invalid tab');
                  }
             }
             setSteps(steps);
          }).catch( (error) => {
                  console.error(error);
                  });
    }, []);
    return steps;
}

export default useWidgets;
