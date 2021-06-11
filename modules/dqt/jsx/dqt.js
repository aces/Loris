import React, {Component} from 'react';
import QueryPanel from './querypanel';
import SelectFieldsTab from './selectfieldstab';
import AddFiltersTab from './addfilterstab';
import QueryResultsTab from './queryresultstab';

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
        headers: [],
        data: [],
      },
    };

    this.getCategories = this.getCategories.bind(this);
    this.getCategoryFields = this.getCategoryFields.bind(this);
    this.setQueryInfo = this.setQueryInfo.bind(this);
    this.setQueryFields = this.setQueryFields.bind(this);
    this.setQueryFilters = this.setQueryFilters.bind(this);
    this.getQueries = this.getQueries.bind(this);
    this.getQuery = this.getQuery.bind(this);
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
   * Update the query in state with new values
   * then saves it.
   *
   * @param {object} query The new query values
   */
  setQueryInfo(query) {
    console.info('DQT::setQueryInfo');
    this.setState({
      query: query,
    }, this.postQuery);
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
   *
   * @return {object}
   */
  getQueries() {
     console.info('DQT::getQueries');
     const url = this.props.baseURL.concat('/dqt/queries');
     const opt = {
      method: 'get',
      credentials: 'same-origin',
    };
    return fetch(url, opt)
      .then((resp) => resp.json())
      .then((json) => {
        if ('error' in json) {
          throw new Error(json.error);
        }
        return json;
      })
      .then((data) => this.setState({queries: data.queries}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * getQuery
   *
   * @param {string} link The url path part of the query
   *
   * @return {object}
   */
  getQuery(link) {
     console.info('DQT::getQuery');
     const url = this.props.baseURL.concat(link);
     const opt = {
      method: 'get',
      credentials: 'same-origin',
    };
    return fetch(url, opt)
      .then((resp) => resp.json())
      .then((json) => {
        if ('error' in json) {
          throw new Error(json.error);
        }
        return json;
      })
      .then((query) => this.setState({query}))
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
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * To run a query, it needs to be saved first so that results are made
   * available.
   */
  getResults() {
    console.info('DQT::getResults');
    this.postQuery()
      .then((json) => json.links.results)
      .then((url) => {
         const opt = {
           method: 'get',
           credentials: 'same-origin',
        };
        return fetch(url, opt)
          .then((resp) => resp.json())
          .then((json) => {
            if ('error' in json) {
              throw new Error(json.error);
            }
            return json;
          })
          .then((results) => this.setState({queryResults: results}))
          .catch((error) => {
            this.setState({error: true});
            console.error(error);
          });
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
          saveQuery={this.setQueryInfo}
          loadQueries={this.getQueries}
          loadQuery={this.getQuery}
          setQueryFields={this.setQueryFields}
          setFilters={this.setQueryFilters}
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
        <QueryResultsTab
          data={this.state.queryResults}
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
