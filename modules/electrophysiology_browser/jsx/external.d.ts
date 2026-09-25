declare module 'FilterableDataTable' {
  import type {ComponentType, ReactElement, ReactNode} from 'react';

  type FilterOptions = Record<string, string>;

  type Filter = {
    name: string;
    type: string;
    hide?: boolean;
    options?: FilterOptions;
  };

  type Field = {
    label: string;
    show: boolean;
    filter?: Filter;
  };

  type FilterableDataTableProps = {
    name: string;
    data: Array<Record<string, string>>;
    fields: Field[];
    getFormattedCell?: (
      column: string,
      cell: string,
      row: Record<string, string>
    ) => ReactElement;
    children?: ReactNode;
  };

  const FilterableDataTable: ComponentType<FilterableDataTableProps>;
  export default FilterableDataTable;
}
