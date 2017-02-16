var SliderPanel = React.createClass({
  render: function() {
      return (
        <div className="panel-group" id="bvl_feedback_menu">
            <div className="breadcrumb-panel">
                <a className="info">
                    Feedback for PSCID: {this.props.pscid}
                </a>
            </div>
            {this.props.children}
        </div>
      );
    }
});

var FeedbackPanelContent = React.createClass({
  propTypes: {
    feedback_level : React.PropTypes.string.isRequired,
    feedback_values : React.PropTypes.array
  },
  getInitialState: function(){
    return {
      currentEntryToggled: null
    }
  },
  markCommentToggle: function(index) {
    if(index == this.state.currentEntryToggled){
      this.setState({
        currentEntryToggled: null
      });
    }
    else{
      this.setState({
      currentEntryToggled: index
    });
    }
  },
  openThread(index){
    this.props.open_thread(index);
  },
  closeThread(index){
      this.props.close_thread(index);
      this.setState({
          currentEntryToggled: null
      });
  },
    render: function() {

      var headers = ["Type", "Author", "Status"];

      if (this.props.feedback_level === "instrument") {
        headers[0] = "Fieldname";
      }

      var table_headers = (
        <tr className="info">
          {headers.map(function(header) {
            return (<td>{header}</td>);
          })}
        </tr>
      );

    if (this.props.threads.length){
      var currentEntryToggled = this.state.currentEntryToggled;

      var that = this
      var feedbackRows = this.props.threads.map(function(row, index){
        if (currentEntryToggled == index){
          var thisRowCommentToggled = true;
        }
        else{
          var thisRowCommentToggled = false;
        }
          return (
            <FeedbackPanelRow key={row.FeedbackID}
                              commentToggled = {thisRowCommentToggled}
                              feedbackID={row.FeedbackID}
	                            sessionID={that.props.sessionID}
                              type={row.Type}
                              commentID={that.props.commentID}
                              candID={that.props.candID}
                              status={row.QC_status}
                              date={row.Date}
                              commentToggle={that.markCommentToggle.bind(this, index)}
                              fieldname={row.FieldName}
                              author={row.User}
                              onClickClose={this.closeThread.bind(this,index)}
                              onClickOpen={that.props.open_thread.bind(this,index)}
            />
          )
      }.bind(this));

	    var table =
	            <table id ="current_thread_table" className="table table-hover table-primary table-bordered dynamictable">
        <thead id="current_thread_table_header">
        {table_headers}
        </thead>
        {feedbackRows}
        </table>


      return(
        <div className="panel-collapse collapse in">
        <div className="panel-body">
	  {table}
        </div>
        </div>
      )
    }
    else{
	return(
	            <div className="panel-body">

            There are no threads for this user!
	            </div>

      )
    }
  }
});


var FeedbackPanelRow = React.createClass({
  getInitialState: function(){
    return {
      thread_entries_toggled: false,
      thread_entries_loaded: [],
      thread_comment_toggled: false
    }
  },
  componentDidMount: function(){
    this.loadServerState();
  },
  loadServerState: function(){
    var that = this;

    request = $.ajax({
      type: "GET",
      url: loris.BaseURL + "/bvl_feedback/ajax/get_thread_entry_data.php",
      data:{
        "feedbackID" : this.props.feedbackID
      },
      success:function(data){
        that.setState({thread_entries_loaded : data});
      },
      error: function (xhr, desc, err){
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    });
  },
  toggle_entries: function(newComment){
    var toggle = false;
    if (newComment) {
      toggle = true;
    } else {
      toggle = !this.state.thread_entries_toggled;
    }
    this.setState({thread_entries_toggled: toggle});
  },
  toggle_thread_comment: function(){

    this.setState({thread_comment_toggled : !this.state.thread_comment_toggled});

  },
  new_thread_entry: function(comment){

    var that = this;
    var feedbackID = this.props.feedbackID
    var sessionID = this.props.sessionID;
    var candID = this.props.candID;

    request = $.ajax({
      type: "POST",
      url: loris.BaseURL + "/bvl_feedback/ajax/thread_comment_bvl_feedback.php",
      data: {"comment" : comment,
      "feedbackID" : feedbackID,
      "candID" : candID},
      success: function (response) {
        that.loadServerState();
      },//end of success function
      error: function (xhr, desc, err){
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    })
  },
  render: function() {
    var d = new Date();
    var feedbackID = this.props.feedbackID;
    if (this.state.thread_entries_toggled){
      var arrow = 'glyphicon glyphicon-chevron-down glyphs';
      var threadEntries = this.state.thread_entries_loaded.map(function(entry){
        return <tr className="thread_entry"><td colSpan="100%">{entry.UserID} on {entry.TestDate} commented:
        <br/> {entry.Comment}</td></tr>}
      );

    }
    else{
      var arrow = 'glyphicon glyphicon-chevron-right glyphs';
    }

    if (this.props.status == 'closed'){
      var buttonText = 'closed';
      var buttonClass = 'btn btn-success dropdown-toggle btn-sm' ;
      var dropdown = <li><a onClick={this.props.onClickOpen}>Open</a></li>;
      var commentButton = null;
    }
    else if (this.props.status == 'opened'){
      var buttonText = 'opened'
      var buttonClass = 'btn btn-danger dropdown-toggle btn-sm';
      var dropdown = <li><a onClick={this.props.onClickClose}>Close</a></li>;
      var commentButton = <span className="glyphicon glyphicon-pencil" onClick={this.props.commentToggle}></span>;
    }
    return(
      <tbody>
      	<tr>
      	  {this.props.fieldname? <td>{this.props.fieldname}<br/>{this.props.type}</td> : <td>{this.props.type}</td>}
          <td>{this.props.author} on:<br/>{this.props.date}</td>
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
            <span className={arrow} onClick={this.toggle_entries.bind(this, false)}></span>
            {commentButton}
          </td>
        </tr>
        {this.props.commentToggled ?
              <CommentEntryForm user={this.props.user} onCommentSend={this.new_thread_entry} toggleThisThread={this.toggle_entries.bind(this, true)}/>: null }
              {threadEntries}
      </tbody>
      );
    }
  });

  var CommentEntryForm = React.createClass({
    getInitialState: function(){
      return {
        value: null
      };
    },
    sendComment: function(){
      this.props.onCommentSend(this.state.value);
      this.setState({
        value: "Comment added!"
      })
      this.props.toggleThisThread();
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render: function(){
      var value = this.state.value;
      return (
        <tr><td colSpan="100%">Add a thread entry :
        <div className="input-group" style={{width:'100%'}}><textarea className="form-control" value={value} style={{resize:'none'}} rows="2" ref="threadEntry" onChange={this.handleChange}></textarea><span className="input-group-addon btn btn-primary" onClick={this.sendComment}>Send</span></div></td></tr>
      );
    }

  });

  var AccordionPanel = React.createClass({
    getInitialState: function(){
      return{
        toggled : false
      }
    },
    toggleChange: function(){
      this.setState({
        toggled: !(this.state.toggled)
      })
    },
    render: function(){
      if(this.state.toggled){
       var panel_body_class = "panel-collapse collapse"
       var arrow_class = "collapsed"
      }
      else{
       var panel_body_class= "panel-collapse collapse in"
       var arrow_class = null
      }
      return(
        <div className="panel-group" id="accordion">
        <div className="panel panel-default">
        <div className="panel-heading">
        <h4 className="panel-title"><a className={arrow_class} onClick={this.toggleChange}>{this.props.title}</a></h4>
        </div>
        <div className={panel_body_class}>
        {this.props.children}
        </div>
        </div>
        </div>
      )
    }
  })

  var NewThreadPanel = React.createClass({
    propTypes: {
      select_options : React.PropTypes.array
    },
    getInitialState: function(){
      return{
        text_value : '',
        select_value : 'Across All Fields',
        input_value : 1
      }
    },
    handleSelectChange: function(event){
      this.setState({select_value: event.target.value});
    },
    handleTextChange: function(event){
      this.setState({text_value: event.target.value});
    },
    handleInputChange: function(event){
      this.setState({input_value: event.target.value});
    },
    createNewThread: function(){

      var that = this;
      if(this.state.text_value.length){
      request = $.ajax({
        type: "POST",
        url: loris.BaseURL + "/bvl_feedback/ajax/new_bvl_feedback.php",
        data:{
          "input_type": this.state.input_value,
          "field_name" : this.state.select_value,
          "comment" : this.state.text_value,
          "candID": this.props.candID,
          "sessionID" : this.props.sessionID,
          "commentID" : this.props.commentID,
          "user" : this.props.commentID
        },
        success:function(data){
          that.setState({
            text_value: "The new thread has been submitted!"
          });

            that.props.addThread(data);
	    that.props.updateSummaryThread();
        },
        error: function (xhr, desc, err){
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
        }
      });
      }

    },
    render: function(){
      var options = [];
      for (var key in this.props.select_options) {
        if (this.props.select_options.hasOwnProperty(key)) {
          options.push(<option value={key}>{this.props.select_options[key]}</option>)
        }
      }

	if(this.props.feedback_level == "instrument"){
	          var fieldname_select = <div className="form-group">
	<div className="row">

      <label className="col-xs-4">Field Name</label>
      <div className="col-xs-8">
      <select className="form-control input-sm" name = "input_type" selected={this.state.select_value} onChange={this.handleSelectChange} className="form-control">
      {options}
      </select>
      </div>
      </div>
      </div>
	}

      var feedback_types = this.props.feedback_types;
      var input = [];
      for(var key in feedback_types) {
        if(feedback_types.hasOwnProperty(key)) {
          input.push(<option value={feedback_types[key].Type}>{feedback_types[key].Label}</option>)
    }
}

      return <div className="panel-body" id ="new_feedback">
      <div className="form-group">
      <textarea className="form-control" rows="4" id="comment" value={this.state.text_value} onChange={this.handleTextChange}></textarea>
      </div>
	{fieldname_select}
      <div className="form-group">
      <div className="row">
      <label className="col-xs-4">Feedback Type</label>
      <div className="col-xs-8">
      <select className="form-control input-sm" name = "input" selected={this.state.input_value} onChange={this.handleInputChange} className="form-control">
      {input}
      </select>
      </div>
      </div>
      </div>
      <div className="form-group">
      <button id="save_data" onClick={this.createNewThread} className="btn btn-default pull-right btn-sm">Save data</button>
      </div>
      </div>
    }
  });

var FeedbackSummaryPanel = React.createClass({
    getInitialState: function(){
	return{
	    summary: null
	}
    },
    render: function(){
	if(this.props.summary_data){
	    var summary_rows = this.props.summary_data.map(function(row){
		return <tr>
		<td>{row.QC_Class}</td>
		<td><a href={loris.BaseURL + "/" + row.Instrument + "/?candID=" + row.CandID + "&sessionID=" + row.SessionID + "&commentID=" + row.CommentID}>{row.Instrument}</a></td>
		<td><a href={loris.BaseURL + "/instrument_list/?candID=" + row.CandID + "&sessionID="
		+ row.SessionID}>{row.Visit}</a></td>
		<td>{row.No_Threads}</td>
		</tr>
	    });
	}

	if (!(summary_rows === undefined || summary_rows.length == 0)){
	return <div className="panel-body">
	<table className = "table table-hover table-primary table-bordered dynamictable">
	<thead>
	<tr className="info">
	<th nowrap="nowrap">QC Class</th>

        <th nowrap="nowrap">Instrument</th>

       <th nowrap="nowrap">Visit</th>

        <th nowrap="nowrap"># Threads</th>
	</tr>
	</thead>
	<tbody>
	{summary_rows}
	</tbody>
	</table>
	    </div>
	}
	else{
	    return <div className="panel-body">
	    This candidate has no behavioural feedback.
	    </div>
	}
    }
});

var FeedbackPanel = React.createClass({
    getInitialState: function(){
      return {
          threads: '',
	      summary: null
      }
    },
      componentDidMount: function(){
	  this.loadSummaryServerData();

      var that = this;
      request = $.ajax({
        type: "POST",
        url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",
        data:{
          "candID": this.props.candID,
          "sessionID" : this.props.sessionID,
          "commentID" : this.props.commentID,
          "user" : this.props.commentID
        },
        success: function (data){
          state = data;
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
         loadSummaryServerData: function(){
	var that = this;

	request = $.ajax({
	    type:"POST",
	    url: loris.BaseURL + "/bvl_feedback/ajax/get_bvl_feedback_summary.php",
	    data:{
		"candID": this.props.candID,
		"sessionID" : this.props.sessionID,
		"commentID" : this.props.commentID
	    },
        success: function (data){
	    that.setState({
		summary:data
	    });
        },
        error: function (xhr, desc, err){
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
        }
	});
    },
      loadThreadServerState: function(){
        var that = this;
        request = $.ajax({
          type: "POST",
          url: loris.BaseURL + "/bvl_feedback/ajax/react_get_bvl_threads.php",
          data:{
            "candID": this.props.candID,
            "sessionID" : this.props.sessionID,
            "commentID" : this.props.commentID,
            "user" : this.props.commentID
          },
          success: function (data){
            state = data;
            that.setState({
              threads: state
            })
	      that.loadSummaryServerData();
          },
          error: function (xhr, desc, err){
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
          }
        });
      },
      addThread: function(data){
        this.loadThreadServerState();
      },
      markThreadClosed: function(index) {
        var threads = this.state.threads;
        var entry = this.state.threads[index];
          threads.splice(index, 1);
	  var feedbackID = entry.FeedbackID;
        entry.QC_status = 'closed';

          threads.push(entry);

	  var that = this;

	request = $.ajax({
	    type:"POST",
	    url: loris.BaseURL + "/bvl_feedback/ajax/close_bvl_feedback_thread.php",
	    data:{
		"candID": this.props.candID,
		"feedbackID" : feedbackID
	    },
        success: function (data){
	            that.setState({
          threads: threads
		    });
	    that.loadSummaryServerData();
        },
        error: function (xhr, desc, err){
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
        }
      });
      },
      markThreadOpened: function(index) {
        var threads = this.state.threads;
        var entry = this.state.threads[index];
        threads.splice(index, 1);
	  var feedbackID = entry.FeedbackID;

	  entry.QC_status = 'opened';

        threads.unshift(entry);

	  var that = this;

	request = $.ajax({
	    type:"POST",
	    url: loris.BaseURL + "/bvl_feedback/ajax/open_bvl_feedback_thread.php",
	    data:{
		"candID": this.props.candID,
		"feedbackID" : feedbackID
	    },
        success: function (data){
	            that.setState({
          threads: threads
		    });
	    that.loadSummaryServerData();
        },
        error: function (xhr, desc, err){
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
        }
	});


      },
    render: function(){
      title = "New " + this.props.feedback_level + " level feedback";
      return (
          <SliderPanel pscid={this.props.pscid}>
          <AccordionPanel title="Open Thread Summary">
	  <FeedbackSummaryPanel summary_data={this.state.summary}/>
        </AccordionPanel>
        <AccordionPanel title={title}>
          <NewThreadPanel select_options={this.props.select_options} feedback_level={this.props.feedback_level}
	  candID={this.props.candID}
          sessionID={this.props.sessionID} commentID={this.props.commentID} addThread={this.addThread}
	  updateSummaryThread={this.loadSummaryServerData} feedback_types={this.props.feedback_types}></NewThreadPanel>
        </AccordionPanel>
        <AccordionPanel title="Feedback Threads">
          <FeedbackPanelContent threads={this.state.threads} close_thread={this.markThreadClosed} open_thread={this.markThreadOpened} feedback_level={this.props.feedback_level}
	  candID={this.props.candID} sessionID={this.props.sessionID} commentID={this.props.commentID}/>
        </AccordionPanel>
        </SliderPanel>
      );
    }
  });

  RBehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);
