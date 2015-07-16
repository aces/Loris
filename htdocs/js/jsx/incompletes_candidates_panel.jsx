var data = [
	{feedback: "this is feedback"},
	{feedback: "this is another feedback"}
]

var IncompleteCandidatesPanel = React.createClass({
	getInitialState: function(){
		return{data: {participants: ["james", "kelly"]}};
	},
	render: function(){
		return(
			<div className="panel panel-primary">
			  <div className="panel-heading">Incomplete Candidates</div>
			  <div className="panel-body">Body contents:
			    <ul>{
				    this.state.data.participants.map(function(player) {
					    return <li>{player}</li>})										  }
			    </ul>
			  </div>
			</div>
		);
	}
});

React.render(
	<IncompleteCandidatesPanel/>,
	document.getElementById('myDiv')
);
