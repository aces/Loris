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

    this.setFilter = this.setFilter.bind(this);
    this.deleteFilter = this.deleteFilter.bind(this);
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
        this.props.setFilter(tmp, this.props.index);
      break;
      default:
        console.error('Unknown filter item type: '. concat(
          JSON.stringify(tmp.type)
        ));
    }
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
                  getCategoryfields={this.props.getCategoryfields}
                  selectedCategory={this.props.selectedCategory}
                />
              </li>
            );
        });
        return (
          <div>
            <fieldset>
              <legend>group
                <AddFilterButton
                  setFilter={this.props.setFilter}
                  index={this.props.index}
                  categories={this.props.categories}
                  getCategoryfields={this.props.getCategoryfields}
                  selectedCategory={this.props.selectedCategory}
                />
                <RemoveFilterButton
                  deleteFilter={this.deleteFilter}
                  index={null}
                />
              </legend>
              <span>operator: {this.props.filters.operator}</span>
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
              <legend>filter
                <AddFilterButton
                  setFilter={this.props.setFilter}
                  index={this.props.index}
                  categories={this.props.categories}
                  getCategoryfields={this.props.getCategoryfields}
                  selectedCategory={this.props.selectedCategory}
                />
                <RemoveFilterButton
                  deleteFilter={this.deleteFilter}
                  index={this.props.index}
                />
              </legend>
              <ul>
                <li>operator: {this.props.filters.operator}</li>
                <li>category: {this.props.filters.category}</li>
                <li>field: {this.props.filters.field}</li>
                <li>value: {this.props.filters.value}</li>
              </ul>
            </fieldset>
          </div>
        );
      default:
        return (
          <div>
            <h5>filteritem</h5>
            <AddFilterButton
              setFilter={this.props.setFilter}
              categories={this.props.categories}
              getCategoryfields={this.props.getCategoryfields}
              selectedCategory={this.props.selectedCategory}
            />
          </div>
        );
    }
  }
}

export default FilterItem;
