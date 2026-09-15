/**
 * A function to compare to objects of the same type.
 */
export type Comparator<T> = (a: T, b: T) => boolean;

/**
 * A dependency-aware key-value mutable cache.
 *
 * Only a single value is cached per key, when querying the cache, that value
 * is recomputed it the dependencies of that entry have changed.
 */
export default class MutableKeyDepCache<K, D, V> {
  private cache = new Map<K, {deps: D; value: V}>();
  private comparator: Comparator<D>;

  /**
   * Create a new mutable key dependency cache with the given dependency
   * comparator.
   */
  constructor(comparator: Comparator<D> = Object.is) {
    this.comparator = comparator;
  }

  /**
   * Query the cache for a value with the given key and dependencies.
   */
  get(key: K, deps: D, compute: () => V): V {
    const entry = this.cache.get(key);

    // If the key is present and its dependencies have not changed, return the
    // existing value.
    if (entry && this.comparator(entry.deps, deps)) {
      return entry.value;
    }

    // Otherwise, recompute, cache, and return the new value.
    const value = compute();
    this.cache.set(key, {deps, value});
    return value;
  }
}
