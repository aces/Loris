var SliderPanel = React.createClass({
	render: function() {
		return <div className="breadcrumb-panel" id="bvl_feedback_menu">
		{this.props.children}
		</div>
	}
});

var FeedbackPanelContent = React.createClass({
	propType:{
		'feedback_level' : React.Proptypes.string.isRequired,
		'feedback_values' : React.Proptypes.array;
	},
	render: function(){
		return{ 
			<table id ="current_thread_table" className="table table-hover table-primary table-bordered dynamictable">
		<thead id="current_thread_table_header">
		<tr className="info">
		<td>Date Opened</td>
		<td>Author</td>
		</tr>
		</thead>
		<tbody>
		  {this.props.feedback_values.map(function(row){
			  return <FeedbackPanelRow status={this.props.row.QC_status}/>
		   })}
		</table>
		</tbody>
		}
	}
});

var FeedbackPanelRow = React.createClass({
	getInitialState:function(){
		return{
			status = this.props.status;
		}
	},
	render: function(){
					  <button name ="thread_button" type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  Opened <span className="caret"></span>
					  </button>
	}
});

var FeedbackPanel = React.createClass({
	render: function(){
		return <SliderPanel>
		<FeedbackPanelContent feedback_values={this.props.thread_list} feedback_level={this.props.feedback_level}/>
		</SliderPanel>
	}
});

BehaviouralFeedbackPanel = React.createFactory(FeedbackPanel);


