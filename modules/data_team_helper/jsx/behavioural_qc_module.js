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
            return mapped;
        });
        if(rows_for_current_page.length){
            var table_contents = <table className="table table-hover table-primary table-bordered colm-freeze">
                <PagedRowHeader header_row={this.props.table_headers}/>
                <tbody>
                {rows_for_current_page}
                </tbody>
            </table>

        }
        else{
            var table_contents = "There is no data to display";
        }
        return <div>
        {table_contents}	
        <nav>
	    <BVLPager page={page}/>
        </nav>
        </div>
    }
});


var IncompleteCandidatesRow = React.createClass({
    handleClick: function(event){
        event.preventDefault();
        var link = React.findDOMNode(this.refs.incomplete);
        window.open(link, "Incomplete Candidate");
    },
    propTypes:{
        'row' : React.PropTypes.object.isRequired,
        'BaseURL' : React.PropTypes.string.isRequired

    },
    render: function(){
        var row = this.props.row;
        return <tr key={row.id} onClick={this.handleClick}>
            <td>
                <a href={this.props.BaseURL + "/" + row.candid + "/" + row.SessionID + "/"}> {row.visit_label} </a>
            </td>
            <td>
                <a href={this.props.BaseURL + "/" + row.candid + "/"}>
		      {row.candid}
                </a>
            </td>
            <td>
                <a href={this.props.BaseURL + "/" + row.candid + "/" + row.SessionID + "/" + row.test_name + "/?commentID=" + row.commentid} ref="incomplete">
		      {row.Full_name}
                </a>
            </td>
        </tr>;
    }
});

var InstrumentConflictsRow = React.createClass({
    proptypes:{
        'row' : React.PropTypes.object.isRequired,
        'BaseURL' : React.PropTypes.string.isRequired
    },
    render: function(){
        var row = this.props.row;
        return <tr key={row.CandID + row.visit_label + row.test_name_display + row.FieldName} onClick={this.handleClick}>
            <td>{row.visit_label}</td>
            <td>
                <a href={this.props.BaseURL + "/" + row.CandID + "/"}>
		      {row.CandID}
                </a>
            </td>
            <td>
                <a href="conflict" href={this.props.BaseURL + "/conflict_resolver/?CandID=" + row.CandID} className="conflict_resolver_link" data-pscid = {row.PSCID} data-question = {row.FieldName} data-instrument = {row.TableName} data-visits = {row.visit_label}>
		      {row.test_name_display}
                </a>
            </td>
            <td>{row.FieldName}</td>
        </tr>
    }
});

var BehaviouralFeedbackRow = React.createClass({
    handleClick: function(event){
        event.preventDefault();
        var link = React.findDOMNode(this.refs.feedback).href;
        var feedbackwindow = window.open(link, "Behavioural Feedback");
    },
    propTypes:{
        'row' : React.PropTypes.object.isRequired,
        'BaseURL' : React.PropTypes.string.isRequired
    },
    render: function(){
        var row = this.props.row;
        var bvl_link;
        var bvl_level;

        if (row.Feedback_level == 'visit') {
            bvl_link = this.props.BaseURL + "/" + row.CandID + "/" + row.SessionID + "/";
            bvl_level = "Visit : " + row.Visit_label;
        }

        if (row.Feedback_level == 'instrument'){
            bvl_link = this.props.BaseURL + "/" + row.CandID + "/" + row.SessionID + "/" + row.Test_name + "/?commentID=" + row.CommentID;
            bvl_level = "Instrument : " + row.Full_name;
        }

        if (row.Feedback_level == 'profile'){
            bvl_link = this.props.BaseURl + "/" + row.CandID + "/";
            bvl_level = "Profile";
        }

        return <tr key = {row.FeedbackID} onClick={this.handleClick}>
            <td>
                <a href={this.props.BaseURL + "/" + row.CandID + "/"}>{row.CandID}</a>
            </td>
            <td>
                <a href={bvl_link} onClick={this.handleClick} ref="feedback">{bvl_level}</a>
            </td>
            <td>
                {row.FieldName}
            </td>
        </tr>
    }
});


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
                    <IncompleteCandidatesRow BaseURL={this.props.BaseURL} />
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
                    <InstrumentConflictsRow BaseURL={this.props.BaseURL} />
                </PagedTable>
            </DefaultPanel>
        );
    }
});

var BehaviouralFeedback = React.createClass({
    render: function(){
        return(
            <DefaultPanel title={this.props.title}>
                <PagedTable table_rows={this.props.feedback} table_headers={this.props.header}>
                    <BehaviouralFeedbackRow BaseURL={this.props.BaseURL} />
                </PagedTable>
            </DefaultPanel>
        );
    }
});

var BVLPager = React.createClass({
    render: function(){
	var page = this.props.page;
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
		pageLinks.push(<li><span>...</span></li>)
		pageLinks.push(<li onClick={page.handleClick(page.numPages)}><span>{page.numPages}</span></li>)
            }
            pageLinks.push(<li onClick={page.handleClick(page.currentPage + 1)}><span aria-hidden="true">›</span>
		</li>)
	}	
        return (
	    <ul className="pagination pagination-sm">{pageLinks}</ul>
        );
    }
});

var dataTeamGraphics = React.createClass({
    componentDidMount: function() {
        var chart = c3.generate({
            bindto: '#completedChart',
            data: {
                columns: [
                    ['data', this.props.percentCompleted]
                ],
                type: 'gauge',
            },
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                threshold: {
                    //            unit: 'value', // percentage is default
                    //            max: 200, // 100 is default
                    values: [30, 60, 90, 100]
                }
            }
        });
    },
    render: function(){
        if(this.props.pscid){
            var pscid_status = "Candidate " + this.props.pscid;
        }
        else{
            var pscid_status = "All Candidates";
        }
        if(this.props.visit){
            var visit_status = "On " + this.props.visit;
        }
        else{
            var visit_status = "Across All Visits"
        }
        if(this.props.instrument){
            var instrument_status = "On Instrument " + this.props.instrument;
        }
        else{
            var instrument_status = "Across All Instruments";
        }
        return(
            <div className="col-sm-12 col-md-5">
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        At A Glance: {pscid_status} - {visit_status} - {instrument_status}
                    </div>
                    <div className="panel-body">
                        <div id="completedChart"></div>
                    </div>
            </div>
            </div>
        );
    }
});

GraphicsPanel = React.createFactory(dataTeamGraphics);
BehaviouralFeedbackTab = React.createFactory(BehaviouralFeedback);
IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
InstrumentConflictsPanel = React.createFactory(InstrumentConflicts);
