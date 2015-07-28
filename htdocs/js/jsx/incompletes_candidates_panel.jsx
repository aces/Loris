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

var PagedRowHeader = React.createClass({
	propType:{
		'header_row' : React.PropTypes.array.isRequired
	},
	render: function(){
		return <thead>
		  <tr className="info">
		    {this.props.header_row.map(function(header_column){
			    return <th>{header_column}</th>
		     })}
		  </tr>
		</thead>;
	}
});

var PagedTable = React.createClass({


	propTypes:{
		'table_headers' : React.PropTypes.array,
		'table_rows' : React.PropTypes.array
	},
	getInitialState: function(){
		return{
			pageSize: 10,
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
			table_rows: this.props.table_rows.slice(start, end),
			numPages: this.getNumPages(),
			handleClick: function(pageNum) {
				return function() {
					this.handlePageChange(pageNum)
				}.bind(this)
			}.bind(this)
		}	
	},
	getNumPages: function() {
		var numPages = Math.floor(this.props.table_rows.length / this.state.pageSize);
		if (this.props.table_rows.length % this.state.pageSize > 0){
			numPages++
		}
		return numPages			
	},
	handlePageChange: function(pageNum) {
		this.setState({currentPage: pageNum})
	},
	render:function(){
		var page = this.getPage();
		var rows_to_map = page.table_rows;
		var children_to_map = this.props.children;
		var rows_for_current_page = rows_to_map.map(function(row){							
								     var mapped = React.Children.map(children_to_map, function (child) {
									     return React.cloneElement(child, {
										     row: row
									     });			
								     });
								     console.log(mapped);
								     return mapped; 
								     });
								     return <div>
								     {pager(page)}
								     <table className="table table-hover table-primary table-bordered colm-freeze">
								       <PagedRowHeader header_row={this.props.table_headers}/>
								       <tbody>
									 {rows_for_current_page}
								       </tbody>
								     </table>
								     {pager(page)}

								     </div>
	}
})

	var IncompleteCandidatesRow = React.createClass({
							 propTypes:{
								 'row' : React.PropTypes.object.isRequired

							 },
							 render: function(){
								 var row = this.props.row;
								 return <tr key={row.id}>
								 <td>{row.visit_label}</td>
								 <td>{row.candid}</td>
								 <td>{row.test_name}</td>
								 <td>{row.commentid}</td>
								 
								 </tr>;
								 
							 }
							 })

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
								      {this.props.children}
								      </div>
								      </div>
							      );
						      }
						      });

var weirdDiv = React.createClass({
	
													render:function(){
														return (<div>{this.props.dance}</div>);
													}
													});


								      								   var header = ["hi, hello, bye"];

		var IncompleteCandidates = React.createClass({
						      render: function(){
							      return (
								      <DefaultPanel>
								      <PagedTable table_rows={this.props.incomplete_candidates} table_headers={this.props.header}>
								      <IncompleteCandidatesRow/>
								      </PagedTable>
								      </DefaultPanel>
							      );
						      }
						      });

								      
								      IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
