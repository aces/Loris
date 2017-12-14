/* exported DisplayHelp */

/*
This file contains a React component which displays Markdown content from the Help Editor module
onto the dropdown Help section on all Loris pages.

@author: Zaliqa Rosli
@version 0.0.1

*/
class DisplayHelp extends React.Component {

  render() {
    function hasDate(date) {
      return (
        <div>
          <hr />
          <p>Last updated: {date}</p>
        </div>
      );
    }
    return (
      <div>
	<h3>{this.props.Topic ? this.props.Topic : ''}</h3>
	<Markdown content={this.props.Content} />
	{this.props.Updated && hasDate(this.props.Updated)}
      </div>
    );
  }
}

DisplayHelp.propTypes = {
  Topic: React.PropTypes.string,
  Content: React.PropTypes.string.isRequired,
  Updated: React.PropTypes.string
};

var RDisplayHelp = React.createFactory(DisplayHelp);

window.DisplayHelp = DisplayHelp;
window.RDisplayHelp = RDisplayHelp;

export default DisplayHelp;
