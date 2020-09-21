import StaticDataTable from 'StaticDataTable';

/**
 * ViewSurveysIndex
 *
 * Create a parent portal form
 *
 * @author  Shen Wang
 * @version 1.0.0
 */
class ViewSurveysIndex extends React.Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.formatColumn = this.formatColumn.bind(this);
  }
  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    let color = '';
    switch (column) {
    case 'Survey Link':
      const url = loris.BaseURL + '/survey.php?key=' + row[3];
      result = <td><a href={url}>Open Survey</a></td>;
      break;
    case 'Status':
          switch (row[2]) {
          case 'Complete':
            color = 'green';
          break;
          case 'In Progress':
            color = 'orange';
          break;
          case 'Created':
            color = 'yellow';
          break;
        default:
     }
      result = <td style={{backgroundColor: color}} >{cell}</td>;
      break;
    }

    return result;
  }
 /**
   * Called by React when the component has been rendered on the page.
   * @return {JSX} - React markup for the component
   */
  render() {
    // If error occurs, return a message.
let res = this.props.data;
let table = res.map((node) => Object.values(node));
     return (
          <div>
          <h1>Welcome To Parent Portal! ID:{this.props.id}</h1>
          <StaticDataTable
            Data= {table}
            Headers={[
              'Visit',
              'Survey',
              'Status',
              'Survey Link',
            ]}
            getFormattedCell={this.formatColumn}
          />
          </div>
     );
  }
}
export default ViewSurveysIndex;

