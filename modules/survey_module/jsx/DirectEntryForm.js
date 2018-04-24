/**
 * This file contains React form components for Direct Data Entry
 *
 * @author Jordan Stirling (StiringApps ltd.)
 * @version 0.0.1
 *
 */

import GroupElement from './GroupElement.js';
// import Markdown from './Markdown.js';


/**
 * 	THIS ELEMENT IS FOR DEVELOPMENT PURPOSES ONLY
 */ 
class NotImplement extends React.Component {

	constructor(props) {
	    super(props);
	}

	render() {
		return (
			<div>
				{this.props.element.Type} is not yet implemented
			</div>
		);
	}
}

class DirectEntryFormElement extends React.Component {

	constructor(props) {
	    super(props);
	}

	render() {
		let element;
		switch(this.props.element.Type) {
			case "select":
				element = (
					<SelectElement
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
				);
				break;
			case "text":
				element = (
					<TextElement
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
				);
				break;
			case "date":
				element = (
					<DateElement 
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
				);
				break;
			case "label":
				element = (
					<LabelElement element={this.props.element} />
				);
				break;
			case "header": 
				element = (
					<HeaderElement element={this.props.element} />
				);
				break;
			case "ElementGroup":
				element = (
					<GroupElement
						element={this.props.element}
						values={this.props.values}
						updateAnswer={this.props.updateAnswer}
						errors={this.props.errors}
					/>
				);
				break;
			default:
				element = (
					<NotImplement element={this.props.element} />
				);
		};
		return (
			<div 
				className='question-container col-xs-12 col-sm-10 col-sm-offset-1'
			>
				{element}
			</div>
		);
	}
}

class Page extends React.Component {
	constructor(props) {
	    super(props);

	}

	render() {

		const DirectEntryFormElements = this.props.elements.map((element) => {
			return (
				<DirectEntryFormElement
					element={element}
					values={this.props.values}
					updateAnswer={this.props.updateAnswer}
					errors={this.props.errors}
				/>
			);
		});

		return (
			<div>
				{DirectEntryFormElements}
			</div>
		);

	}
}

class SelectElement extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	value: ''
	    };
	}

	onSelect(value) {
		// this.setState({'value': value});
		this.props.updateAnswer(this.props.element.Name, value);
	}

	render() {
		let options = [];

		for (var key in this.props.element.Options.Values) {
			let checked;
			if(key === '') {
				continue;
			} else if(key === this.props.value) {
				checked = (
					<i className="glyphicon glyphicon-ok" ></i>
				);
			}
			options.push(
				<div className="col-xs-12 col-sm-6 select-option" onClick={this.onSelect.bind(this, key)}>
					<div className="selectBox">
						<label className="btn btn-defualt btn-circle active">
							{checked}
						</label>
					</div>
					<div className="selectOption">
						<Markdown content={this.props.element.Options.Values[key]} />
					</div>
				</div>
			);
		}

		const element = (
			<div className='row field_input' data-toggle="buttons">
				{options}
			</div>
		);

		let classInfo = 'col-xs-12 field_question';

		if(this.props.error) {
			classInfo += ' has-error';
		}

		let description = '';
		if (!!this.props.element.Description) {
			description = (
				<h3 className={classInfo}>
					<Markdown content={this.props.element.Description} />
				</h3>
			);
		}

		return (
			<div>
				{description}
				{element}
			</div>
		);
	}
}

class TextElement extends React.Component {
	constructor(props) {
	    super(props);

	    this.updateText = this.updateText.bind(this);
	}

	updateText(e) {
		this.props.updateAnswer(this.props.element.Name, e.target.value);
	}

	render() {
		let type;
		let value = '';
		if(this.props.value) {
			value = this.props.value;
		}
		if (this.props.element.Options.Type === 'small') {
			type = (
				<input
					name = {this.props.element.Name}
					type='text'
					className="form-control"
					onChange = {this.updateText}
					value = {value}
				/>
			);
		} else {
			type = (
				<textarea
					name = {this.props.element.Name}
					className="form-control"
					onChange = {this.updateText}
					value = {value}
				/>
			);
		}
		let classInfo = 'col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4';
		let descClass = 'col-xs-12 field_question';
		
		if(this.props.error) {
			classInfo += ' has-error';
			descClass += ' has-error';
		}

		let description = '';
		if (!!this.props.element.Description) {
			description = (
				<h3 className={descClass}>
					<Markdown content={this.props.element.Description} />
				</h3>
			);
		}

		return (
			<div>
				{description}
				<div className={classInfo}>
					{type}
				</div>
			</div>
		);
	}
}

class DateElement extends React.Component {
	constructor(props) {
	    super(props);

	    this.updateDate = this.updateDate.bind(this)
	}

	componentDidMount() {
		var that = this;
		if(!checkInput(this.props.element.Type)) {
			$("#" + this.props.element.Name).datepicker({
				"dateFormat" : "yy-mm-dd",
				"minDate" : this.props.element.Options.MinDate,
				"maxDate" : this.props.element.Options.MaxDate,
			}).on("change", function(e) {
			    that.updateDate(e);
			});
		}
	}

	updateDate(e) {

		this.props.updateAnswer(this.props.element.Name, e.target.value);
	}

	render() {

		let classInfo = 'col-xs-12 field_question';

		let input = (
			<input
				name = {this.props.element.Name}
				type="date"
				className="form-control"
				min = {this.props.element.Options.MinDate}
				max = {this.props.element.Options.MaxDate}
				onChange = {this.updateDate}
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

		if(this.props.error) {
			classInfo += ' has-error';
		}

		let description = '';
		if (!!this.props.element.Description) {
			description = (
				<h3 className='col-xs-12 field_question'>
					<Markdown content={this.props.element.Description} />
				</h3>
			);
		}

		return (
			<div>
				{description}
				<div className='col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4'>
					{input}
				</div>
			</div>
		);
	}
}

class LabelElement extends React.Component {
	constructor(props) {
	    super(props);
	}

	render() {
		let description = '';
		if (!!this.props.element.Description) {
			description = (
				<h3 className='col-xs-12 field_question'>
					<Markdown content={this.props.element.Description} />
				</h3>
			);
		}
		return (
			<div>
				{description}
			</div>
		);
	}
}

class HeaderElement extends React.Component {

	constructor(props) {
	    super(props);
	}

	render() {
		let element;
		switch(this.props.element.Options.Level) {
			default: 
				element = (
					<h1>
						<Markdown content={this.props.element.Description} />
					</h1>
				);
		}
		return (
			<div>
				{element}
			</div>
		);
	}
}


export default Page;

