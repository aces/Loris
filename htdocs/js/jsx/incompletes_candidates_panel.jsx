var data = [
	{feedback: "this is feedback"},
	{feedback: "this is another feedback"}
]

var IncompleteCandidatesPanel = React.createClass({
	propTypes: {
		'Candidate' : React.PropTypes.string.isRequired,
		
	},
	getInitialState: function(){
		return{data: {participants: ["james", "kelly"]},
			'collapsed' : false
		};
	},
	toggleCollapsed: function() {
		this.setState({'collapsed' : !this.state.collapsed});
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
			    <h1>{this.props.Candidate}</h1>
			  </div>
			</div>
		);
	}
});

var CandidatesPanel = React.createClass({displayName: 'CandidatesPanelTable',
	render: function(){
		return (<IncompleteCandidatesPanel Candidate="evan LUC MCILROy"/>
		);
	}
});

EVANCANDIDATES = React.createFactory(CandidatesPanel);


/* React.render(
   <CandidatesPanel/>,
   document.getElementById('myDiv')
   ); */

