var FilterPanel = React.createClass({
	render: function(){
		return (
			<div class="panel panel-primary">
			  <div class="panel-heading" onclick="hideFilter();">
			    Selection Filter
			  </div>
			  <div class="panel-body" id="panel-body">
			    <form class="form-horizontal" role="form">
			      <div class="form-group">
				<label class="control-label col-sm-2" for="email">Email:</label>
				<div class="col-sm-10">
				  <input type="email" class="form-control" id="email" placeholder="Enter email"/>
				</div>						
			      </div>
			    </form>
			  </div>
			</div>
		);
	}
}); 

/* var IncompleteCandidatesPanel = React.createClass({
   render: function() {
   return(
   <div class="panel panel-body">
   <div class="panel-heading">Incomplete Candidates</div>
   <div class="panel-body"></div>
   );
   }
   
   }); */

React.render(
	<FilterPanel/>,
	document.getElementById('myDiv')
);
