class EditContent extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    
    function removeDiv(event) {
      document.getElementById("preview").remove();
      event.preventDefault(); 
    } 

    return(
      <div>
	<pre>
	  <h3>{this.props.Title}</h3>
	  <p><Markdown content={this.props.Content} /></p>
	  <hr />
	  <p>Last updated: {this.props.MyDate.getFullYear()}-{this.props.MyDate.getMonth()+1}-{this.props.MyDate.getDate()} {this.props.MyDate.getHours()}:{this.props.MyDate.getMinutes()}:{this.props.MyDate.getSeconds()}</p>
	</pre>
	<button className="btn btn-default" id="helpclose" onClick={removeDiv}>Close</button>
      </div>
    );
  }  
}

$(document).ready(function(){

$("input[name=preview]").click(function(e) {
    if($('div.help-content').length) {
        $('div.help-content').remove();
        e.preventDefault();
    }
    var title   = $('input[name="title"]').val(),
        content = $('textarea[name="content"]').val(),
        myDate  = new Date(),
        div     = document.createElement("div"),
        text    = document.createTextNode("Edit");

    document.getElementById('page').appendChild(div);
    div.setAttribute("class", "help-content");
    div.setAttribute("id", "preview");    
    ReactDOM.render(<EditContent Title={title} Content={content} MyDate={myDate} />, document.getElementById("preview"));
    e.preventDefault();
});
});
