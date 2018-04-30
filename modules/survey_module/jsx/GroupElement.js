/*eslint-disable */
class GroupElement extends React.Component {

	constructor(props) {
	    super(props);
	}

	render() {
		let element;

		switch(this.props.element.GroupType){
			case "Element":
				element = (
					<ElementGroup
						element={this.props.element}
						values={this.props.values}
						updateAnswer={this.props.updateAnswer}
						errors={this.props.errors}
					/>
				);
				break;

		}
		
		return (
			<div>
				{element}
			</div>
		);
	}
}

class ElementGroup extends React.Component {

	constructor(props) {
	    super(props);
	}

	render() {
		let labelClass;
		let elementClass;
		let elements;
		let error;
		let errorMessage;

		switch(this.props.element.Elements.length) {
			case 1:
				labelClass = 'col-xs-12 col-sm-4';
				elementClass = 'col-xs-12 col-sm-8';
				break;
			case 2:
				labelClass = 'col-xs-12 col-sm-4';
				elementClass = 'col-xs-12 col-sm-4';
				break;
			case 3:
				labelClass = 'col-xs-12 col-sm-3';
				elementClass = 'col-xs-12 col-sm-3';
				break;
			case 4:
				labelClass = 'col-xs-12 col-sm-4';
				elementClass = 'col-xs-12 col-sm-2';
				break;
			case 5:
				labelClass = 'col-xs-12 col-sm-2';
				elementClass = 'col-xs-12 col-sm-2';
				break;
		}

		if(this.props.errors[this.props.element.Name]) {
			error = true;
			labelClass += ' has-error';
		}

		elements = this.props.element.Elements.map(function(element) {
			if(!error && this.props.errors[element.Name]) {
				error = true;
				errorMessage = this.props.errors[element.Name];
			}
			return (
				<BaseElement
					element={element}
					classInfo={elementClass}
					value={this.props.values[element.Name]}
					updateAnswer={this.props.updateAnswer}
					error={error}
					errorMessage={errorMessage}
				/>
			);
		}.bind(this));

		let description = '';
		if (!!this.props.element.Description) {
			description = (
				<div className={labelClass}>
					<Markdown content={this.props.element.Description} />
				</div>
			);
		}

		return (
			<div className='col-xs-12'>
				{description}
				{elements}
			</div>
		);
	}
}

class GroupDateElement extends React.Component {
	constructor(props) {
	    super(props);

	    this.updateValue = this.updateValue.bind(this);
	}

	updateValue(e) {
		this.props.updateAnswer(this.props.element.Name, e.target.value);
	}

	componentDidMount() {
		var that = this;
		if(!checkInput(this.props.element.Type)) {
			$("#" + this.props.element.Name).datepicker({
				"dateFormat" : "yy-mm-dd",
				"minDate" : this.props.element.Options.MinDate,
				"maxDate" : this.props.element.Options.MaxDate,
			}).on("change", function(e) {
			    that.updateValue(e);
			});
		}
	}

	render() {

		let input = (
			<input
				name = {this.props.element.Name}
				type="date"
				className="form-control"
				min = {this.props.element.Options.MinDate}
				max = {this.props.element.Options.MaxDate}
				onChange = {this.updateValue}
				value = {this.props.value}
			/>
		);

		if(!checkInput(this.props.element.Type)) {
			input = (
				<input
					name = {this.props.element.Name}
					type="text"
					className="form-control"
					value = {this.props.value}
					id = {this.props.element.Name}
				/>
			);
		}

		return (
			<div>
				{input}
			</div>
		);
	}
}

class GroupTimeElement extends React.Component {
	constructor(props) {
	    super(props);

	    if(!checkInput(this.props.element.Type)) {
	    	let hour = "";
	    	let min = "";
	    	if(this.props.value) {
	    		const val = this.props.value.split(":");
	    		hour = val[0];
	    		min = val[1];
	    	}
	    	this.state = {
	    		"hour" : hour,
	    		"min" : min
	    	};
	    }

	    this.updateValue = this.updateValue.bind(this);
	}

	updateValue(e) {
		if(checkInput(this.props.element.Type)) {
			const val = e.target.value != '' ? this.props.value : null;
			this.props.updateAnswer(this.props.element.Name, val);
		}
	}

	updateTime(unit, e) {
		let val
		if(unit == "hour") {
			if(e.target.value == "") {
				val = null;
			} else if(this.state.min != "") {
				val = e.target.value + ":" + this.state.min + ":00";
			}
			this.props.updateAnswer(this.props.element.Name, val);
			this.setState({
				"hour" : e.target.value
			});
		} else if(unit == "min") {
			if(e.target.value == "") {
				val = null;
			} else if(this.state.hour != "") {
				val = this.state.hour + ":" + e.target.value + ":00";
			}
			this.props.updateAnswer(this.props.element.Name, val);
			this.setState({
				"min" : e.target.value
			});
		}
	}

	render() {

		let input = (
			<input
				type="time"
				name={this.props.element.Name}
				className="form-control"
				onChange={this.updateValue}
				value={this.props.value}
			/>
		);

		if(!checkInput(this.props.element.Type)) {
			let hourOptions = [];
			let minOptions = [];
			let val;
			let i;

			hourOptions.push(
				<option value=""></option>
			);
			minOptions.push(
				<option value=""></option>
			);

			for (i = 0; i < 24; i++) {
				if (i < 10) {
					val = "0" + i;
				} else {
					val = String(i);
				}
				hourOptions.push(
					<option value={val}>{val}</option>
				);
			}
			for (i = 0; i < 60; i++) {
				if (i < 10) {
					val = "0" + i;
				} else {
					val = String(i);
				}
				minOptions.push(
					<option value={val}>{val}</option>
				);
			}

			input = (
				<div className="row">
					<div className="col-xs-4">
						<select
							className="form-control"
							onChange={this.updateTime.bind(this, "hour")}
							value={this.state.hour}
						>
							{hourOptions}
						</select>
					</div>
					<div className="col-xs-4">
						<select
							className="form-control"
							onChange={this.updateTime.bind(this, "min")}
							value={this.state.min}
						>
							{minOptions}
						</select>
					</div>
				</div>
			);
		}

		return (
			<div>
				{input}
			</div>
		);
	}
}

class BaseElement extends React.Component {
	constructor(props) {
	    super(props);

	    this.updateValue = this.updateValue.bind(this);
	}

	updateValue(e) {
		this.props.updateAnswer(this.props.element.Name, e.target.value);
	}

	render() {
		let element;
		let classInfo = this.props.classInfo;
		let value;
		let errorMessage;

		if(this.props.error) {
			classInfo += " has-error";
		}

		if(this.props.errorMessage) {
			classInfo += " questionError";
			errorMessage = (
				<div>
					{this.props.errorMessage}
				</div>
			);
		}

		switch(this.props.element.Type){
			case 'text':
				value = this.props.value != null ? this.props.value : '';
				element = (
					<input
						type="text"
						name={this.props.element.Name}
						className="form-control"
						onChange={this.updateValue}
						value={value}
					/>
				);
				break;
			case 'select':
				let options = [];
				value = this.props.value != null ? this.props.value : '';

				for (var key in this.props.element.Options.Values) {
					options.push(
						<option value={key}>{this.props.element.Options.Values[key]}</option>
					);
				}
				element = (
					<select
						className="form-control"
						onChange={this.updateValue}
						value={value}
					>
						{options}
					</select>
				);
				break;
			case 'label':
				let content = '';
				if(!!this.props.value) {
					content = this.props.value;
				} else if(!!this.props.element.Description) {
					content = this.props.element.Description;
				}
				element = (
					<Markdown content={content} />
				);
				break;
			case 'date':
				element = (
					<GroupDateElement
						element = {this.props.element}
						value = {this.props.value}
						updateAnswer = {this.props.updateAnswer}
					/>
				);
				break;
			case 'time':
				value = this.props.value != null ? this.props.value : '';

				element = (
					<GroupTimeElement
						element = {this.props.element}
						value = {this.props.value}
						updateAnswer = {this.props.updateAnswer}
					/>
				);
				
				break;
			default:
				element = (
					<div>
						{this.props.element.Type} is not yet implemented group
					</div>
				);
		}

		return (
			<div className={classInfo}>
				{element}
				{errorMessage}
			</div>
		);
	}
}
/*eslint-enable */

export default GroupElement;
