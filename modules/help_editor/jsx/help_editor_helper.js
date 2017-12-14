class EditContent extends React.Component {

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
$(document).ready(function() {
  $("input[name=preview]").click(function(e) {
    if ($('div.help-content').length) {
      $('div.help-content').remove();
      e.preventDefault();
    }
    var title = $('input[name="title"]').val();
    var content = $('textarea[name="content"]').val();
    var myDate = new Date();
    var div = document.createElement("div");
    document.getElementById('page').appendChild(div);
    div.setAttribute("class", "help-content");
    div.setAttribute("id", "preview");
    ReactDOM.render(<EditContent Title={title} Content={content} MyDate={myDate} />, document.getElementById("preview"));
    e.preventDefault();
  });
});
