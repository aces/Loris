/**
 * Delay a callback until calls stop for the requested interval.
 *
 * @param fn - Callback to invoke with the last call's receiver and arguments.
 * @param delay - Delay in milliseconds.
 * @returns A debounced callback that returns no value.
 */
export function debounce<This, Args extends unknown[]>(
  fn: (this: This, ...args: Args) => unknown,
  delay: number,
): (this: This, ...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function(this: This, ...args: Args): void {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
