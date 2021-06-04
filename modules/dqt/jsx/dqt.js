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
      queries: [],
      categories: [],
      selectedCategory: {},
      query: {
        fields: [],
        filters: {},
      },
      queryResults: {
        columns: [],
        data: [],
      },
    };

    this.getCategories = this.getCategories.bind(this);
    this.getCategoryFields = this.getCategoryFields.bind(this);
    this.setQueryFields = this.setQueryFields.bind(this);
    this.setQueryFilters = this.setQueryFilters.bind(this);
    this.getQueries = this.getQueries.bind(this);
    this.postQuery = this.postQuery.bind(this);
    this.getResults = this.getResults.bind(this);
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
   * Set the query fields
   * @param {array} fields The list of fields
   */
  setQueryFields(fields) {
    console.info('DQT::setQueryFields: '.concat(JSON.stringify(fields)));
    const query = this.state.query;
    query.fields = fields ?? [];
    this.setState({
      query: query,
      selectedCategory: {},
    });
  }

  /**
   * Set the query filters
   *
   * @param {object} filters The new filter(s)
   */
  setQueryFilters(filters) {
    console.info('DQT::setQueryFilters: '.concat(JSON.stringify(filters)));
    const query = this.state.query;
    query.filters = filters;
    this.setState({
      query: query,
      selectedCategory: {},
    });
  }

  /**
   * getQueries
   */
  getQueries() {
     console.info('DQT::getQueries');
     this.setState({
       queries: [1, 2, 3],
     });
  }

  /**
   * postQuery
   *
   * @return {object}
   */
  postQuery() {
    console.info('DQT::postQuery');
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
   * getResults
   */
  getResults() {
    console.info('DQT::getResults');
    this.setState({
      queryResults: {
        columns: [1, 2, 3],
        data: [],
      },
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
        <QueryPanel
          queries={this.state.queries}
          query={this.state.query}
          runQuery={this.getResults}
          saveQuery={this.postQuery}
          loadQueries={this.getQueries}
        />
        <SelectFieldsTab
          getCategories={this.getCategories}
          categories={this.state.categories}
          getCategoryFields={this.getCategoryFields}
          selectedCategory={this.state.selectedCategory}
          selectedFields={this.state.query.fields}
          setQueryFields={this.setQueryFields}
        />
        <AddFiltersTab
          getCategories={this.getCategories}
          categories={this.state.categories}
          getCategoryFields={this.getCategoryFields}
          selectedCategory={this.state.selectedCategory}
          filters={this.state.query.filters}
          setFilters={this.setQueryFilters}
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
