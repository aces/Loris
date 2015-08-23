var SliderPanel = React.createClass({
    render: function() {
	return <div className="breadcrumb-panel" id="bvl_feedback_menu">
	{this.props.children}
	</div>
    }
});

var FeedbackPanelContent = React.createClass({
    propTypes: {
	feedback_level : React.PropTypes.string.isRequired,
	feedback_values : React.PropTypes.array
    },
    getInitialState: function(){
	return {
	    threads: ''
	}
    },
    componentDidMount: function(){

	var that = this; 
	
	request = $.ajax({
	    type: "POST",
	    url: "ajax/react_get_bvl_threads.php",
	    data:{
		"candID": this.props.candID,
		"sessionID" : this.props.sessionID,
		"commentID" : this.props.commentID,
		"user" : this.props.commentID
	    },
	    success: function (data){
		state = data;
		console.log(state);
		that.setState({
		    threads: state
		})
	    },
	    error: function (xhr, desc, err){
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }
	});
    },
    markThreadClosed: function(index) {
	var threads = this.state.threads;
	var entry = this.state.threads[index];
	console.log(entry);
	threads.splice(index, 1);
	entry.QC_status = 'closed';

	threads.push(entry);

	this.setState({
	    threads: threads
	});
    },
    markThreadOpened: function(index) {
	var threads = this.state.threads;
	var entry = this.state.threads[index];
	console.log(entry)
	threads.splice(index, 1);
	entry.QC_status = 'opened';

	threads.unshift(entry);

	this.setState({
	    threads: threads
	});
    },
    render: function(){
	console.log(this.state.threads);
	console.log(this.props.feedback_values);

	if (this.state.threads){
	    var threadList = this.state.threads.map(function(row, index){
		return(
		    <FeedbackPanelRow key={row.FeedbackID} status={row.QC_status} date={row.date} onClickClose={this.markThreadClosed.bind(this, index)} onClickOpen={this.markThreadOpened.bind(this, index)}/>
		);
	    }.bind(this));
	    
	    return(
	    <table id ="current_thread_table" className="table table-hover table-primary table-bordered dynamictable">
	    <thead id="current_thread_table_header">
	    <tr className="info">
	    <td>Date Opened</td>
	    <td>Author</td>
	    </tr>
	    </thead>
	    <tbody>
	    {this.state.threads.map(function(row, index){
		return <FeedbackPanelRow key={row.FeedbackID} feedbackID={row.FeedbackID} status={row.QC_status} date={row.date} onClickClose={this.markThreadClosed.bind(this, index)} onClickOpen={this.markThreadOpened.bind(this, index)}/>
	    }.bind(this))}
	     </tbody>
            </table>
	    )
	}
	else{
	    return(
		<div>There are no threads for this user!</div>
		)
	}

    }
});


var FeedbackPanelRow = React.createClass({
    getInitialState: function(){
	return {
	    thread_entries_toggled: false,
	    thread_entries_loaded: false
	}
    },
    toggle_entries: function(){
	this.setState({thread_entries_toggled: !this.state.thread_entries_toggled});

	if (!this.state.thread_entries_loaded){
	    var threadEntries = this.load_thread_entries();	

	    this.setState({
		thread_entries_loaded : threadEntries
	    })
	}
	
    },
    load_thread_entries: function(){
	request = $.ajax({
	    type: "POST",
	    url: "ajax/get_thread_entry_data.php",
	    data:{
		"callFunc1" : this.props.feedbackID
	    },
	    success:function(data){
		console.log("in success fn");
	    },
	    error: function (xhr, desc, err){
                console.log(xhr);
                console.log("Details: " + desc + "\nError:" + err);
            }	    

	});
    },
    new_thread_entry: function(){},
    render: function() {

	if (this.state.thread_entries_toggled){
	    var arrow = 'glyphicon glyphicon-chevron-right';
	    var threadEntries = this.state.thread_entries_loaded.map(function(entry){
									    console.log(entry);
									    return <tr>entry</tr>}
);}
	else{
	    var arrow = 'glyphicon glyphicon-chevron-down';
	}
	
	if (this.props.status == 'closed'){
	    var buttonText = 'closed';
	    var buttonClass = 'btn btn-success dropdown-toggle' ;
	    var dropdown = <li><a onClick={this.props.onClickOpen}>Open</a></li>;
	}
	else if (this.props.status == 'opened'){
	    var buttonText = 'opened'
	    var buttonClass = 'btn btn-danger dropdown-toggle';
	    var dropdown = <li><a onClick={this.props.onClickClose}>Close</a></li>;
	}
        return(
	    <tbody>
            <tr>
            <td>{this.props.date}</td>
            <td>FieldName</td>
            <td>
	    <div className="btn-group">
	    <button name ="thread_button" type="button" className={buttonClass} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {buttonText}
            <span className="caret"></span>
            </button>
	    <ul className="dropdown-menu">
	    {dropdown}
	    </ul>
	    </div>
	    <span className={arrow} onClick={this.toggle_entries}></span>
	    </td>
            </tr>
	    {threadEntries}
	    </tbody>
        );
    }
});

var FeedbackPanel = React.createClass({
    render: function(){
	return (
            <SliderPanel>
            <div className="panel-group" id="accordion">
	    <div className="panel panel-default" id="panel1">

            <FeedbackPanelContent feedback_values={this.props.thread_list} feedback_level={this.props.feedback_level} candID={this.props.candID} sessionID={this.props.sessionID} commentID={this.props.commentID}/>
            </div>
            </div>
            </SliderPanel>
        );
    }
});

BehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);


