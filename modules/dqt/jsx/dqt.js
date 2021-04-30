import React, {Component} from 'react';

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
      isLoaded: false,
    };

    this.getCategories = this.getCategories.bind(this);
    /*
    this.getCategoryFields = this.getCategoryFields.bind(this);
    this.getQueries() = this.getQueries.bind(this);
    this.postQuery = this.postQuery.bind(this);
    this.getResults = this.getResults.bind(this);
    */
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.getCategories()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Get the Categories
   *
   * @return {object}
   */
  getCategories() {
    const url = this.props.dataURL.concat('/categories');
    return fetch(url, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
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
      <div>DQT</div>
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <DQT dataURL={`${loris.BaseURL}/dqt`}/>,
    document.getElementById('lorisworkspace')
  );
});
