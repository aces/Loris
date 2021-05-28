import React, {Component} from 'react';
import QueryPanel from './querypanel';
import SelectFieldsTab from './selectfieldstab';
import AddFiltersTab from './addfilterstab';

/**
 * DQT React Component
 */
class DQT extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      selectedCategory: {},
      queries: [],
      query: {
        fields: [],
        filters: {},
      },
      queryResults: {
        culumns: [],
        data: [],
      },
    };

    this.getCategories = this.getCategories.bind(this);
    this.getCategoryFields = this.getCategoryFields.bind(this);
    this.toggleSelectedField = this.toggleSelectedField.bind(this);
    this.setFilters = this.setFilters.bind(this);
    this.postQuery = this.postQuery.bind(this);
    /*
    this.getQueries() = this.getQueries.bind(this);
    this.getResults = this.getResults.bind(this);
    */
  }

  /**
   * Get the Categories
   *
   * @return {object}
   */
  getCategories() {
    const url = this.props.baseURL.concat('/dqt/categories');
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState(data))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Get the Categories
   *
   * @param {string} name The category name
   * @param {string} link An url to get that category fields
   *
   * @return {object}
   */
  getCategoryFields(name, link) {
    const url = this.props.baseURL.concat(link);
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((json) => {
        if ('error' in json) {
          throw new Error(json.error);
        }
        return json;
      })
      .then((data) => this.setState({selectedCategory: data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * postQuery
   *
   * @return {object}
   */
  postQuery() {
    const url = this.props.baseURL.concat('/dqt/queries');
    const opt = {
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify(this.state.query),
    };
    return fetch(url, opt)
      .then((resp) => resp.json())
      .then((json) => {
        if ('error' in json) {
          throw new Error(json.error);
        }
        return json;
      })
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Add or remove a field from the query
   *
   * @param {string} category The field's category name
   * @param {string} name The field's name
   * @param {array} visits A list of visitlabels
   */
  toggleSelectedField(category, name, visits) {
    // Remove that field from the previous state
    const query = this.state.query;
    const cleanedupfields = query.fields.filter((f) => {
      return f.categoryname != category || f.fieldname != name;
    });

    // Create the new fields to add to the query
    const newfields = visits.map((v) => {
      return {
        categoryname: category,
        fieldname: name,
        visitlabel: v,
      };
    });

    query.fields = cleanedupfields.concat(newfields);
    this.setState({
      query: query,
      selectedCategory: {},
    });
  }

  /**
   * Add a filter to the query
   *
   * @param {object} filters The new filter(s)
   */
  setFilters(filters) {
    console.info('filters: '.concat(JSON.stringify(filters)));
    const query = this.state.query;
    query.filters = filters;
    this.setState({
      query: query,
      selectedCategory: {},
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        <h1>DQT</h1>
        <QueryPanel
          toggleSelectedField={this.toggleSelectedField}
          query={this.state.query}
        >
          <button onClick={this.postQuery}>Query</button>
        </QueryPanel>
        <SelectFieldsTab
          getCategories={this.getCategories}
          getCategoryFields={this.getCategoryFields}
          toggleSelectedField={this.toggleSelectedField}
          categories={this.state.categories}
          selectedCategory={this.state.selectedCategory}
        />
        <AddFiltersTab
          filters={this.state.query.filters}
          getCategories={this.getCategories}
          getCategoryFields={this.getCategoryFields}
          setFilters={this.setFilters}
          categories={this.state.categories}
          selectedCategory={this.state.selectedCategory}
        />
      </div>
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <DQT baseURL={`${loris.BaseURL}`}/>,
    document.getElementById('lorisworkspace')
  );
});
