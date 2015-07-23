/*The config for the pagination of tables */
var Config = React.createClass({
  render: function() {
    return <div>
      <h2>Config</h2>
      <label htmlFor="pageSize">Page Size:</label>
      <select id="pageSize" value={this.props.pageSize} onChange={this.props.handlePageSizeChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
	  </div>;
  }
});

var IncompleteCandidatesTable = React.createClass({
	propTypes: {
		'incomplete_candidates' : React.PropTypes.array.isRequired,
		
	},
	getInitialState: function(){
		return{
			pageSize: 15,
			currentPage: 1
		}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			currentPage: 1
		})
	},
	getPage: function(){
		var start = this.state.pageSize * (this.state.currentPage - 1);
		var end = start + this.state.pageSize;

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
		var numPages = Math.floor(this.props.incomplete_candidates.length / this.state.pageSize);
		if (this.props.incomplete_candidates.length % this.state.pageSize > 0){
			numPages++
		}
		return numPages			
	},
	handlePageChange: function(pageNum) {
		this.setState({currentPage: pageNum})
	},
	render: function(){
		var page = this.getPage();
		var topics = page.incomplete_candidates.map(function(topic) {
			return
			<h1>hi</h1>
		});
		console.log({topics});
		return(

			<table className="table table-hover table-primary table-bordered colm-freeze">
			  <thead>
			    <tr className="info">
			      <td>candid</td>
			      <td>test_name</td>
			      <td>vist_label</td>
			    </tr>
			  </thead>
			  <tbody>
			    {topics}

			  </tbody>
			</table>
				
	)}
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
