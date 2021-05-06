import React, {Component} from 'react';
import QueryPanel from './querypanel';
import SelectFieldsTab from './selectfieldstab';

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
        filters: [],
      },
      queryResults: {
        culumns: [],
        data: [],
      },
    };

    this.getCategories = this.getCategories.bind(this);
    this.getCategoryFields = this.getCategoryFields.bind(this);
    /*
    this.getQueries() = this.getQueries.bind(this);
    this.postQuery = this.postQuery.bind(this);
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
    console.info(name);
    console.info(link);
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
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        <h1>DQT</h1>
        <QueryPanel />
        <SelectFieldsTab
          getCategories={this.getCategories}
          getCategoryFields={this.getCategoryFields}
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
