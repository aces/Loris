HeaderElement = React.createClass({
	render: function(){
		return (
			<h2>{this.props.header}</h2>
		)
	}
});

LabelElement = React.createClass({
	render: function(){
		return (
			<p>{this.props.label}</p>
		)
	}
});

ScoredElement = React.createClass({
	render: function(){
		return (
			<div>
			<label className="lab col-sm-4 col-xs-12">
				{this.props.label}
			</label>
			<div className="col-sm-8">
				<div className="col-xs-12 element">
					0
				</div>
			</div>
			</div>
		)
	}
});

TextboxElement = React.createClass({
	render: function(){
		return (
			<div>
			<label className="lab col-sm-4 col-xs-12">
				{this.props.label}
			</label>
			<div className="col-sm-8">
				<div className="col-xs-12 col-sm-6 element">
					<input type="text" className="form-control input-sm user-success" />
				</div>
			</div>
			</div>
		)
	}
});

TextareaElement = React.createClass({
	render: function(){
		return (
			<div>
			<label className="lab col-sm-4 col-xs-12">
				{this.props.label}
			</label>
			<div className="col-sm-8">
				<div className="col-xs-12 col-sm-6 element">
					<textarea cols="25" rows="4" className="form-control input-sm user-success"></textarea>
				</div>
			</div>
			</div>
		)
	}
});

SelectElement = React.createClass({
	render: function(){
		var multiple = '';
		if(this.props.multiple){
			multiple = 'multiple';
		}
		return (
			<div>
			<label className="lab col-sm-4 col-xs-12">
				{this.props.label}
			</label>
			<div className="col-sm-8">
				<div className="col-xs-12 col-sm-6 element">
					<select multiple={multiple} className="form-control input-sm">
						{this.props.options.map(function(option){
							return (
								<option>
									{option}
								</option>
							)
						})}
					</select>
				</div>
			</div>
			</div>
		)
	}
});

DateElement = React.createClass({
	render: function(){
		var max = this.props.maxYear + "-12-31",
			min = this.props.minYear + "-01-01";
		return (
			<div>
			<label className="lab col-sm-4 col-xs-12">
				{this.props.label}
			</label>
			<div className="col-sm-8">
				<div className="col-xs-12 col-sm-6 element">
					<input type="date"
						   className="form-control input-sm user-success" 
						   min={min}
						   max={max}
				    />
				</div>
			</div>
			</div>
		)
	}
});

NumericElement = React.createClass({
	render: function(){
		return (
			<div>
			<label className="lab col-sm-4 col-xs-12">
				{this.props.label}
			</label>
			<div className="col-sm-8">
				<div className="col-xs-12 col-sm-6 element">
					<input type="number"
						   className="form-control input-sm user-success" 
						   min={this.props.min}
						   max={this.props.max}
				    />
				</div>
			</div>
			</div>
		)
	}
});

LorisElement = React.createClass({
	render: function (){
		var element = this.props.element,
			elementHtml = "dklfldkjf";
		switch(element.Type){
			case 'header':
				elementHtml = <HeaderElement header={element.Description} />;
				break;
			case 'label':
				elementHtml = <LabelElement label={element.Description} />
				break;
			case 'scored':
	    		elementHtml = <ScoredElement label={element.Description} />
	    		break;
	    	case 'text':
	    		if(element.Options.Type === 'small'){
	    			elementHtml = <TextboxElement label={element.Description} />
	    		} else {
	    			elementHtml = <TextareaElement label={element.Description} />
	    		}
	    		break;
	    	case 'select':
	    		if(element.Options.AllowMultiple){
	    			elementHtml = <SelectElement label={element.Description} options={element.Options.Values} multiple="true" />
	    		} else {
	    			elementHtml = <SelectElement label={element.Description} options={element.Options.Values} />
	    		}
	    		break;
	    	case 'date':
	    		elementHtml = <DateElement
	    							label={element.Description}
	    							minYear={element.Options.MinDate}
	    							maxYear={element.Options.MaxDate}
	    					   />
	    		break;
	    	case 'numeric':
	    		elementHtml = <NumericElement
	    							label={element.Description}
	    							min={element.Options.MinValue}
	    							max={element.Options.MaxValue}
	    					   />
			default:
				break;
		}
		return (
			<div>{elementHtml}</div>
		)
	}
});