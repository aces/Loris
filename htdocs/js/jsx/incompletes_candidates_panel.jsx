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
		<nav>
		{pager(page)}
		</nav>
		</div>
	}
})


/**
* Renders a pager component.
*/
function pager(page) {
	var pageLinks = []
	if (page.currentPage > 1) {
		pageLinks.push(<li onClick={page.handleClick(page.currentPage - 1)}><span>‹</span></li>)
		if (page.currentPage > 2) {
			pageLinks.push(<li onClick={page.handleClick(1)}><span>1</span></li>)
			pageLinks.push(<li><span>...</span></li>)
		}
		      }
	if(page.numPages > 1){  pageLinks.push(<li className="active"><span>{page.currentPage}</span></li>)
	}
	if (page.currentPage < page.numPages) {
		pageLinks.push(<li onClick={page.handleClick(page.currentPage + 1)}><span>{page.currentPage + 1}</span></li>)
		if (page.currentPage < page.numPages - 1) {
			pageLinks.push(<li onClick={page.handleClick(page.currentPage + 2)}><span>{page.currentPage + 2}</span></li>)
		}
		if(page.currentPage < page.numPages - 2){
			pageLinks.push(<li onClick={page.handleClick(page.currentPage + 3)}><span>{page.currentPage + 3}</span></li>)
		}
		if(page.currentPage < page.numPages - 3){
			pageLinks.push(<li className="disabled"><span>...</span></li>)
			pageLinks.push(<li onClick={page.handleClick(page.numPages)}><span>{page.numPages}</span></li>)
		}
		pageLinks.push(<li onClick={page.handleClick(page.currentPage + 1)}><span aria-hidden="true">›</span>
 </li>)
	}
	return <ul className="pagination pagination-sm">{pageLinks}</ul>
}

var IncompleteCandidatesRow = React.createClass({
	propTypes:{
		'row' : React.PropTypes.object.isRequired

	},
	render: function(){
		var row = this.props.row;
		return <tr key={row.id}>
		  <td>
		    <a href={"main.php?test_name=instrument_list&candID=" + row.candid + "&sessionID=" + row.SessionID}> {row.visit_label} </a>
		  </td>
		  <td>
		    <a href={"main.php?test_name=timepoint_list&candID=" + row.candid}>
		      {row.candid}
		    </a>
		  </td>		
		  <td>
		    <a href={"main.php?test_name=" + row.test_name + "&candID=" + row.candid + "&sessionID=" + row.SessionID + "&commentID=" + row.commentid}>
		      {row.Full_name}
		    </a>
		  </td>
		</tr>;

	}
						 })

	var InstrumentConflictsRow = React.createClass({
		proptypes:{
			'row' : React.PropTypes.object.isRequired
		},
		render: function(){
			var row = this.props.row;
			return <tr key={row.CandID + row.visit_label + row.test_name_display + row.FieldName}>
		  <td>row.visit_label</td>
		  <td>row.candid</td>
		  <td>row.test_name</td>
		  <td>row.field_name</td>
			</tr>
		}		
	})
	
 
var DefaultPanel = React.createClass({displayName: 'CandidatesPanelTable',
propTypes: {
	'title' : React.PropTypes.string
},
render: function(){
	return (
		<div className="panel panel-primary">
		<div className="panel-heading">{this.props.title}</div>
		<div className="panel-body">
		{this.props.children}
		</div>
		</div>
	);
}
});

var IncompleteCandidates = React.createClass({
	render: function(){
		return (
			<DefaultPanel title={this.props.title}>
			<PagedTable table_rows={this.props.incomplete_candidates} table_headers={this.props.header}>
			<IncompleteCandidatesRow/>
			</PagedTable>
			</DefaultPanel>
		);
	}
});

var InstrumentConflicts = React.createClass({
	render: function(){
		return(
			<DefaultPanel title={this.props.title}>
			<PagedTable table_rows={this.props.conflicts} table_headers={this.props.header}>
			<InstrumentConflictsRow/>
			</PagedTable>
			</DefaultPanel>			
		);
	}
})


IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
InstrumentConflictsPanel = React.createFactory(InstrumentConflicts);
