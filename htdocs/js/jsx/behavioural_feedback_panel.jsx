var SliderPanel = React.createClass({
  render: function() {
    return <div className="panel-group" id="bvl_feedback_menu">
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
      threads: '',
      currentEntryToggled: null
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
    threads.splice(index, 1);
    entry.QC_status = 'opened';

    threads.unshift(entry);

    this.setState({
      threads: threads
    });
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
  render: function(){

    if (this.state.threads){
      var currentEntryToggled = this.state.currentEntryToggled;
      return(
        <div className="panel-collapse collapse in">
        <div className="panel-body">
        <table id ="current_thread_table" className="table table-hover table-primary table-bordered dynamictable">
        <thead id="current_thread_table_header">
        <tr className="info">
        <td>Date Opened</td>
        <td>Author</td>
        </tr>
        </thead>
        <tbody>
        {this.state.threads.map(function(row, index){
          if (currentEntryToggled == index){
            var thisRowCommentToggled = true;
          }
          else{
            var thisRowCommentToggled = false;
          }
          console.log("map feedbackid " + row.FeedbackID);
          return <FeedbackPanelRow key={row.FeedbackID} commentToggled = {thisRowCommentToggled} feedbackID={row.FeedbackID} sessionID={this.props.sessionID} commentID={this.props.commentID} candID={this.props.candID} status={row.QC_status} date={row.date} commentToggle={this.markCommentToggle.bind(this, index)} onClickClose={this.markThreadClosed.bind(this, index)} onClickOpen={this.markThreadOpened.bind(this, index)}/>
        }.bind(this))}
        </tbody>
        </table>
        </div>
        </div>
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
      thread_entries_loaded: false,
      thread_comment_toggled: false
    }
  },
  componentDidMount: function(){
    this.loadServerState();
  },
  loadServerState: function(){
    var that = this;

    request = $.ajax({
      type: "POST",
      url: "ajax/get_thread_entry_data.php",
      data:{
        "callFunc1" : this.props.feedbackID
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
  toggle_entries: function(){

    this.setState({thread_entries_toggled: !this.state.thread_entries_toggled});

  },
  toggle_thread_comment: function(){

    this.setState({thread_comment_toggled : !this.state.thread_comment_toggled});
    console.log(this.state.thread_comment_toggled);
    console.log("in toggle thread comment, this is the feedbackid" + this.props.feedbackID);

  },
  new_thread_entry: function(comment){

    var that = this;
    var feedbackID = this.props.feedbackID
    var sessionID = this.props.sessionID;
    var candID = this.props.candID;

    request = $.ajax({
      type: "POST",
      url: "ajax/thread_comment_bvl_feedback.php",
      data: {"comment" : comment,
      "feedbackID" : feedbackID,
      "candID" : candID},
      success: function (response) {
        console.log("new thread entry successfully added");
        that.loadServerState();
      },//end of success function
      error: function (xhr, desc, err){
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      }
    })
  },
  render: function() {
    console.log("in row render : " + this.props.commentToggled);
    var d = new Date();
    var feedbackID = this.props.feedbackID;
    console.log("in render " + feedbackID);

    if (this.state.thread_entries_toggled){
      var arrow = 'glyphicon glyphicon-chevron-down glyphs';
      console.log("thread entries loaded" + this.state.thread_entries_loaded);
      var threadEntries = this.state.thread_entries_loaded.map(function(entry){
        return <tr className="thread_entry"><td colSpan="100%">{entry.UserID} on {entry.Testdate} commented:
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
    }
    else if (this.props.status == 'opened'){
      var buttonText = 'opened'
      var buttonClass = 'btn btn-danger dropdown-toggle btn-sm';
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
      <span className="glyphicon glyphicon-pencil" onClick={this.props.commentToggle}></span>

      </td>
      </tr>
      { this.props.commentToggled ?
        <CommentEntryForm onCommentSend={this.new_thread_entry.bind(this)}/>: null }
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
      console.log("how to send comment " + this.state.value);
      this.props.onCommentSend(this.state.value);
      this.setState({
        value: "Comment added!"
      })
    },
    handleChange: function(event) {
      this.setState({value: event.target.value});
    },
    render: function(){
      var value = this.state.value;
      return (
        <tr><td colSpan="100%">admin on today commented:
        <div className="input-group" style={{width:'100%'}}><textarea className="form-control" value={value} style={{resize:'none'}} rows="2" ref="threadEntry" onChange={this.handleChange}></textarea><span className="input-group-addon btn btn-primary" onClick={this.sendComment}>Send</span></div></td></tr>
      );
    }

  });

  var AccordionPanel = React.createClass({
    render: function(){
      return(
        <div className="panel-group" id="accordion">
        <div className="panel panel-default" id="panel1">
        <div className="panel-heading">
        <h4 className="panel-title">{this.props.title}</h4>
        </div>
        {this.props.children}
        </div>
        </div>
      )
    }
  })

  var NewThreadPanel = React.createClass({
    propTypes: {
      select_options : React.PropTypes.array
    },
    handleSelectChange: function(event){
      this.setState({select_value: event.target.value});
    },
    handleTextChange: function(event){
      this.setState({text_value: event.target.value});
    },
    createNewThread: function(){
      console.log("in create new thread");
      var that = this;

      request = $.ajax({
        type: "POST",
        url: "ajax/new_bvl_feedback.php",
        data:{
          "input_type": 1,
          "fieldname" : this.state.select_value,
          "comment" : this.state.text_value,
          "candID": this.props.candID,
          "sessionID" : this.props.sessionID,
          "commentID" : this.props.commentID,
          "user" : this.props.commentID
        },
        success:function(data){
          that.setState({
            text_value: "The new thread has been submitted"
          });
        },
        error: function (xhr, desc, err){
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
        }
      });
    },
    render: function(){
      var options = [];
      for (var key in this.props.select_options) {
        if (this.props.select_options.hasOwnProperty(key)) {
          options.push(<option value={key}>{this.props.select_options[key]}</option>)
        }
      }
      return <div className="panel-body">
      <div id ="new_feedback">
      <textarea className="form-control" rows="3" id="comment" onChange={this.handleTextChange}></textarea>
      <select name = "input_type" onChange={this.handleSelectChange}>
      {options}
      </select>
      <button id="save_data" onClick={this.createNewThread}>Save data</button>
      </div>
      </div>
    }
  });

  var FeedbackPanel = React.createClass({
    render: function(){
      return (
        <SliderPanel>
        <div className="panel-group" id="accordion">
        <div className="panel panel-default" id="panel1">
        <div className="panel-heading">
        <h4 className="panel-title">Feedback thread</h4>
        </div>
        <FeedbackPanelContent feedback_level={this.props.feedback_level} candID={this.props.candID} sessionID={this.props.sessionID} commentID={this.props.commentID}/>
        </div>
        </div>
        <AccordionPanel title="Who's there">
        <div id="collapseThree" className="panel-collapse collapse in">
                      <NewThreadPanel select_options={this.props.select_options} feedback_level={this.props.feedback_level} candID={this.props.candID} sessionID={this.props.sessionID} commentID={this.props.commentID}></NewThreadPanel>
            </div>
        </AccordionPanel>
        </SliderPanel>
      );
    }
  });

  BehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);
