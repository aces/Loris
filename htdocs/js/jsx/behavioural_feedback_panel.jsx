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
	render: function(){
        console.log(this.props.feedback_values);
		return(
			<table id ="current_thread_table" className="table table-hover table-primary table-bordered dynamictable">
		<thead id="current_thread_table_header">
		<tr className="info">
		<td>Date Opened</td>
		<td>Author</td>
		</tr>
		</thead>
		<tbody>
		  {this.props.feedback_values.map(function(row){
			  return <FeedbackPanelRow key={row.FeedbackID} status={row.QC_status} date={row.date}/>
		   })}
		</tbody>
            </table>
        );
	}
});

var FeedbackPanelRow = React.createClass({
	getInitialState:function(){
	getInitialState:function(){
		return{
			status : this.props.status
		}
	},
	render: function() {
        return(
            <tr>
                <td>Date</td>
                <td>FieldName</td>
            <td><button name ="thread_button" type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Opened
            <span className="caret"></span>
        </button></td>
            </tr>
        );
    }
});

var FeedbackPanel = React.createClass({
	render: function(){
		return (
        <SliderPanel>
            <div className="panel-group" id="accordion">
		<div className="panel panel-default" id="panel1">

            <FeedbackPanelContent feedback_values={this.props.thread_list} feedback_level={this.props.feedback_level}/>
            </div>
            </div>
        </SliderPanel>
        );
	}
});

BehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);


