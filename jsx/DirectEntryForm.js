/**
 * This file contains React form components for Direct Data Entry
 *
 * @author Jordan Stirling (StiringApps ltd.)
 * @version 0.0.1
 *
 */

import GroupElement from './GroupElement.js';


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

	    // console.lo/?g(props);
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
					<label className="btn btn-defualt btn-circle active">
						{checked}
					</label>
					{this.props.element.Options.Values[key]}
				</div>
			);
		}

		const element = (
			<div className='row field_input' data-toggle="buttons">
				{options}
			</div>
		);

		return (
			<div>
				<h4 className='col-xs-12 field_question'>{this.props.element.Description}</h4>
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
		const type = (this.props.element.Options.Type === 'small') ? "text" : "textArea";
		let classInfo = 'col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4';
		let value = '';

		if(this.props.error) {
			classInfo += ' has-error';
		}

		if(this.props.value) {
			value = this.props.value;
		}

		return (
			<div>
				<h4 className='col-xs-12 field_question'>{this.props.element.Description}</h4>
				<div className={classInfo}>
					<input
						name = {this.props.element.Name}
						type={type}
						className="form-control"
						onChange = {this.updateText}
						value = {value}
					/>
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

	updateDate(e) {

		this.props.updateAnswer(this.props.element.Name, e.target.value);
	}

	render() {

		return (
			<div>
				<h4 className='col-xs-12 field_question'>{this.props.element.Description}</h4>
				<div className='col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4'>
					<input
						name = {this.props.element.Name}
						type="date"
						className="form-control"
						min = {this.props.element.Options.MinDate}
						max = {this.props.element.Options.MaxDate}
						onChange = {this.updateDate}
						value = {this.props.value}
					/>
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
		return (
			<div>
				<h3>{this.props.element.Description}</h3>
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
					<h1>{this.props.element.Description}</h1>
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

