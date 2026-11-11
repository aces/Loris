export type FilterValue = {
  value: any,
  exactMatch?: boolean,
  opposite?: boolean,
};

export type Filters = {[name: string]: FilterValue};

/**
 * Checks whether a value satisfies the filter set on a column
 *
 * Note: Search is case-insensitive.
 *
 * @param {FilterValue} filter - the filter set on the column
 * @param {unknown} data - the column's value for one record
 * @param {string} type - the column filter's type
 * @return {boolean} true if the value matches the filter
 */
export function matchesFilter(
  filter: FilterValue,
  data: unknown,
  type?: string,
): boolean {
  const filterData = filter.value;
  const {exactMatch, opposite} = filter;

  if (filterData === null || data === null || data === undefined) {
    return false;
  }

  if (type === 'date-range' &&
    typeof filterData === 'object' &&
    !Array.isArray(filterData)) {
    const dateData = String(data);
    const min = filterData.min || '';
    const max = filterData.max || '';
    return dateData !== '' &&
      (min === '' || dateData >= min) &&
      (max === '' || dateData <= max);
  }

  if (type === 'number-range' &&
    typeof filterData === 'object' &&
    !Array.isArray(filterData)) {
    const numericData = Number.parseFloat(String(data));
    const min = Number.parseFloat(filterData.min);
    const max = Number.parseFloat(filterData.max);
    return !Number.isNaN(numericData) &&
      (Number.isNaN(min) || numericData >= min) &&
      (Number.isNaN(max) || numericData <= max);
  }

  if (typeof filterData === 'number') {
    return filterData === Number.parseInt(String(data), 10);
  }

  if (typeof filterData === 'boolean') {
    return filterData === data;
  }

  if (typeof filterData === 'string') {
    const searchKey = filterData.toLowerCase();

    if (Array.isArray(data)) {
      const searchArray = data.map((e) => String(e).toLowerCase());
      if (exactMatch) {
        return searchArray.includes(searchKey);
      }
      return searchArray.some((e) => e.indexOf(searchKey) > -1);
    }

    const searchString = String(data).toLowerCase();
    if (exactMatch) {
      return searchString === searchKey;
    }
    if (opposite) {
      return searchString !== searchKey;
    }
    return searchString.indexOf(searchKey) > -1;
  }

  if (Array.isArray(filterData)) {
    const searchArray = Array.isArray(data)
      ? data.map((e) => String(e).toLowerCase())
      : String(data).toLowerCase().split(',');
    return filterData.some(
      (val: unknown) => searchArray.includes(String(val).toLowerCase())
    );
  }

  return false;
}
