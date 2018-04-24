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
		}

		elements = this.props.element.Elements.map(function(element) {
			if(!error && this.props.errors[element.Name]) {
				error = true;
			}
			return (
				<BaseElement
					element={element}
					classInfo={elementClass}
					value={this.props.values[element.Name]}
					updateAnswer={this.props.updateAnswer}
					error={error}
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

		if(this.props.error) {
			classInfo += " has-error";
		}

		switch(this.props.element.Type){
			case 'text':
				element = (
					<input
						type="text"
						name={this.props.element.Name}
						className="form-control"
						onChange={this.updateValue}
						value={this.props.value}
					/>
				);
				break;
			case 'select':
				let options = [];
				const value = this.props.value != null ? this.props.value : '';

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
			</div>
		);
	}
}


export default GroupElement;