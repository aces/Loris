import {useEffect, RefObject} from 'react';

/**
 * Calls onDismiss when a click lands outside the referenced element, while
 * active is true
 *
 * @param ref - the element a click must stay inside
 * @param active - whether to listen
 * @param onDismiss - called on a click outside
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
     * @param e - the click
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
