import {useEffect, RefObject} from 'react';

/**
 * Calls onDismiss when a click lands outside the referenced element, while
 * active is true
 *
 * @param {RefObject} ref - the element a click must stay inside
 * @param {boolean} active - whether to listen
 * @param {Function} onDismiss - called on a click outside
 */
export function useDismiss(
  ref: RefObject<HTMLElement>,
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) {
      return;
    }
    /**
     * Dismisses on a click outside the element
     *
     * @param {MouseEvent} e - the click
     */
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [active, ref, onDismiss]);
}
