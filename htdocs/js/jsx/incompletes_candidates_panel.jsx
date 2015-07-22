/* var data = [
	{feedback: "this is feedback"},
	{feedback: "this is another feedback"}
] */

var IncompleteCandidatesTable = React.createClass({
	propTypes: {
		'incomplete_candidates' : React.PropTypes.array.isRequired,
		
	},
	getInitialState: function(){
		return{
			pageSize: 10
		}
	},
	componentWillReceiverProps: function(nextProps) {
		this.setState({
			currentPage: 1
		})
	},
	getPage: function(){
		var start = this.props.pageSize * (this.state.currentPage - 1);
		var end = start + this.props.pageSize;

		return{
			currentPage: this.state.currentPage,
			incomplete_candidates: this.props.incomplete_candidates.slice(start, end),
			numPages: this.getNumPages(),
			handleClick: function(pageNum) {
				return function() {
					this.handlePageChange(pageNum)
				}.bind(this)
			}.bind(this)
		}	
	},
	getNumPages: function() {
		var numPages = Math.floor(this.props.incomplete_candidates.length / this.props.pageSize);
		if (this.props.incomplete_candidates.length % this.props.pageSize > 0){
			numPages++
		}
		return numPages			
	},
	handlePageChange: function(pageNum) {
		this.setState({currentPage: pageNum})
	},
	render: function(){
		return(
			<table className="table table-hover table-bordered dynamictable">
			  <thead>
			<tr className="info">
			<th>Candidate ID</th>
			      <th>Visit Label</th>
			<th>Instrument</th>
			<th>Fieldname</th>
			    </tr>
			  </thead>
			  <tbody>
			    {this.props.incomplete_candidates.map(function(candidate){
				    return(
					    <div className="PaginationLinks">
					    <tr>
					      <td>{candidate.candid}</td>
					      <td>{candidate.visit_label}</td>
					      <td>{candidate.test_name}</td>
					      <td>{candidate.commentid}</td>
					    </tr>
					    </div>
				    ) 
			     })}
			  </tbody>
			</table>
		);
	}
});


/**
 * Renders a pager component.
 */
function pager(page) {
  var pageLinks = []
  if (page.currentPage > 1) {
    if (page.currentPage > 2) {
      pageLinks.push(<span className="pageLink" onClick={page.handleClick(1)}>«</span>)
      pageLinks.push(' ')
    }
    pageLinks.push(<span className="pageLink" onClick={page.handleClick(page.currentPage - 1)}>‹</span>)
    pageLinks.push(' ')
  }
  pageLinks.push(<span className="currentPage">Page {page.currentPage} of {page.numPages}</span>)
  if (page.currentPage < page.numPages) {
    pageLinks.push(' ')
    pageLinks.push(<span className="pageLink" onClick={page.handleClick(page.currentPage + 1)}>›</span>)
    if (page.currentPage < page.numPages - 1) {
      pageLinks.push(' ')
      pageLinks.push(<span className="pageLink" onClick={page.handleClick(page.numPages)}>»</span>)
    }
  }
  return <div>{pageLinks}</div>
}

var DefaultPanel = React.createClass({displayName: 'CandidatesPanelTable',
	propTypes: {
		'incomplete_candidates' : React.PropTypes.array
	},
	render: function(){
		return (
			<div className="panel panel-primary">
			  <div className="panel-heading">Incomplete Candidates</div>
			  <div className="panel-body">
			    <IncompleteCandidatesTable incomplete_candidates={this.props.incomplete_candidates}/>
			  </div>
			</div>
		);
	}
});

IncompleteCandidatesPanel = React.createFactory(DefaultPanel);
