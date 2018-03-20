/* exported RPreviewHelp */

/* This file contains a React component which renders the front-end preview of an instrument's help content during editing.

   @author Zaliqa Rosli
   @version 0.0.1
*/

class PreviewHelp extends React.Component {

  render() {
    function removeDiv(event) {
      document.getElementById("preview").remove();
      event.preventDefault();
    }
    const date = this.props.MyDate;
    return (
      <div>
	<pre>
          <h3>{this.props.Title}</h3>
          <Markdown content={this.props.Content} />
          <hr />
          <p>Last updated: {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()} {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</p>
	</pre>
	<button className="btn btn-default" id="helpclose" onClick={removeDiv}>Close</button>
      </div>
    );
  }
}

PreviewHelp.propTypes = {
  Title: React.PropTypes.string.isRequired,
  Content: React.PropTypes.string.isRequired,
  MyDate: React.PropTypes.string.isRequred
};

var RPreviewHelp = React.createFactory(PreviewHelp);

window.PreviewHelp = PreviewHelp;
window.RPreviewHelp = RPreviewHelp;

export default PreviewHelp;
