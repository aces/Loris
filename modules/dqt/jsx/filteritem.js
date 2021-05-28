import {Component} from 'react';
import AddFilterButton from './addfilterbutton';
import RemoveFilterButton from './removefilterbutton';

/**
 * FilterItem
 */
class FilterItem extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.addFilter = this.addFilter.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.deleteFilter = this.deleteFilter.bind(this);
    this.toggleGroupOperator = this.toggleGroupOperator.bind(this);
  }

  /**
   * Add a filter at a given index
   *
   * @param {object} filter The new filter
   * @param {integer} index The index
   */
  addFilter(filter, index) {
    console.info('FilterItem::addFilter');
    console.info(JSON.stringify(filter));
    console.info(JSON.stringify(index));
    console.info(JSON.stringify(this.props.filters));

    let filters = this.props.filters;

    switch (filters.type) {
      case 'filter':
        filters = {
          type: 'group',
          operator: 'AND',
          items: [
            filters,
            filter,
          ],
        };
        this.props.setFilter(filters, this.props.index);
        break;
      case 'group':
        filters.items.push(filter);
        break;
      default:
        filters = filter;
    }

    this.props.setFilter(filters, this.props.index);
  }

  /**
   * Set the filter at a given index
   *
   * @param {object} filter The new filter
   * @param {integer} index The index
   */
  setFilter(filter, index) {
    console.info('FilterItem::setFilter');
    console.info(JSON.stringify(filter));
    console.info(JSON.stringify(index));

    let obj = this.props.filters;
    obj.items[index] = filter;
    this.props.setFilter(obj, this.props.index);
  }

  /**
   * Delete filter at a given index
   *
   * @param {integer} index The index
   */
  deleteFilter(index) {
    console.info('FilterItem::deleteFilter');
    console.info(JSON.stringify(index));

    if (index == null) {
      this.props.deleteFilter(this.props.index);
      return;
    }

    switch (this.props.filters.type) {
      case 'filter':
        console.info('filter');
        this.props.deleteFilter(this.props.index);
      break;
      case 'group':
        console.info('group');
        let tmp = this.props.filters;
        tmp.items.splice(index, 1);

        if (tmp.items.length == 1) {
          // When there is only one item remaining in a group, the group
          // is replaced by that last item.
          tmp = tmp.items.shift();
        }

        this.props.setFilter(tmp, this.props.index);
      break;
      default:
        console.error('Unknown filter item type: '. concat(
          JSON.stringify(tmp.type)
        ));
    }
  }

  /**
   * Toggle between AND/OR
   */
  toggleGroupOperator() {
    console.info('FilterItem::toggleGroupOperator');
    console.info(this.props.filters);
    const filters = this.props.filters;
    filters.operator = filters.operator == 'AND' ? 'OR' : 'AND';
    this.props.setFilter(filters, this.props.index);
  }

  /**
   * Render
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    switch (this.props.filters.type || '') {
      case 'group':
        const children = this.props.filters.items.map((item, index) => {
            return (
              <li>
                <FilterItem
                  filters={item}
                  index={index}
                  setFilter={this.setFilter}
                  deleteFilter={this.deleteFilter}
                  categories={this.props.categories}
                  getCategoryFields={this.props.getCategoryFields}
                  selectedCategory={this.props.selectedCategory}
                />
              </li>
            );
        });
        return (
          <div>
            <fieldset>
              <legend>
                group&nbsp;
                <span
                  onClick={this.toggleGroupOperator}
                >
                  {this.props.filters.operator}
                </span>
              </legend>
              <AddFilterButton
                addFilter={this.addFilter}
                index={this.props.index}
                categories={this.props.categories}
                getCategoryFields={this.props.getCategoryFields}
                selectedCategory={this.props.selectedCategory}
              />
              <RemoveFilterButton
                deleteFilter={this.deleteFilter}
                index={null}
              />
              <ul>
                {children}
              </ul>
            </fieldset>
          </div>
        );
      case 'filter':
        return (
          <div>
            <fieldset>
              <legend>filter</legend>
              <AddFilterButton
                addFilter={this.addFilter}
                index={this.props.index}
                categories={this.props.categories}
                getCategoryFields={this.props.getCategoryFields}
                selectedCategory={this.props.selectedCategory}
              />
              <RemoveFilterButton
                deleteFilter={this.deleteFilter}
                index={this.props.index}
              />
              {JSON.stringify(this.props.filters)}
            </fieldset>
          </div>
        );
      default:
        return (
          <div>
            <AddFilterButton
              addFilter={this.addFilter}
              index={this.props.index}
              categories={this.props.categories}
              getCategoryFields={this.props.getCategoryFields}
              selectedCategory={this.props.selectedCategory}
            />
          </div>
        );
    }
  }
}

export default FilterItem;
