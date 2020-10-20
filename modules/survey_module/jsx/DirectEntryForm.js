/* eslint-disable */
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
/**
 * 	THIS ELEMENT IS FOR DEVELOPMENT PURPOSES ONLY
 */
class NotSupported extends React.Component {
	constructor(props) {
	    super(props);
	}

	render() {
		return (
			<div>
				{this.props.element.Type} is not supported by browser
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
		let errorMessage;
		let questionClass = 'question-container col-xs-12 col-sm-10 col-sm-offset-1';
		let group;

		switch (this.props.element.Type) {
			case 'select':
				element = (
					<SelectElement
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
				);
				break;
			case 'text':
				element = (
					<TextElement
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
				);
				break;
			case 'date':
				element = (
					<DateElement
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
				);
				break;
			case 'label':
				element = (
					<LabelElement element={this.props.element} />
				);
				break;
			case 'header':
				element = (
					<HeaderElement element={this.props.element} />
				);
				break;
			case 'ElementGroup':
				group='true';
				element = (
					<GroupElement
						element={this.props.element}
						values={this.props.values}
						updateAnswer={this.props.updateAnswer}
						errors={this.props.errors}
					/>
				);
				break;
			case 'advcheckbox':
				element = (
					<AdvcheckboxElement
						element={this.props.element}
						value={this.props.values[this.props.element.Name]}
						updateAnswer={this.props.updateAnswer}
						error={this.props.errors[this.props.element.Name]}
					/>
					);
				break;
			default:
				element = (
					<NotImplement element={this.props.element} />
				);
		};

		if (this.props.errors[this.props.element.Name]) {
			questionClass += ' questionError';
			errorMessage = (
				<h4 className='col-xs-12 has-error'>
					* {this.props.errors[this.props.element.Name]}
				</h4>
			);
		}
    let element_name=this.props.element.Name;
    let str=element_name.toLowerCase();
		if (group=='true' && str.includes('score')) {
      questionClass = 'hidden';
		}

		return (
			<div className={questionClass}>
				{element}
				{errorMessage}
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
	    	value: '',
	    };
	}

	onSelect(value) {
		// this.setState({'value': value});
		if (this.props.value !== value) {
			this.props.updateAnswer(this.props.element.Name, value);
		} else {
			this.props.updateAnswer(this.props.element.Name, null);
		}
	}

	render() {
		let options = [];
		let optionLabel;

		for (let key in this.props.element.Options.Values) {
			let checked;
			if (key === '') {
				continue;
			} else if (key === this.props.value) {
				checked = (
					<i className="glyphicon glyphicon-ok" ></i>
				);
			}
			optionLabel = String(this.props.element.Options.Values[key]);
			options.push(
				<div className="col-xs-12 col-sm-6 select-option" onClick={this.onSelect.bind(this, key)}>
					<div className="selectBox">
						<label className="btn btn-default btn-circle">
							{checked}
						</label>
					</div>
					<div className="selectOption">
						<Markdown content={optionLabel} />
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

		if (this.props.error) {
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
		if (this.props.value) {
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

		if (this.props.error) {
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

	    this.updateDate = this.updateDate.bind(this);
	}

	updateDate(e) {
		this.props.updateAnswer(this.props.element.Name, e.target.value);
	}

	componentDidMount() {
		let that = this;
		if (!checkInput(this.props.element.Type)) {
			$('#' + this.props.element.Name).datepicker({
				'dateFormat': 'yy-mm-dd',
				'minDate': this.props.element.Options.MinDate,
				'maxDate': this.props.element.Options.MaxDate,
				'changeMonth': true,
      			'changeYear': true,
      			'yearRange': '-100:+15',
			}).on('change', function(e) {
			    that.updateDate(e);
			});
		}
	}

	render() {
		let classInfo = 'col-xs-12 field_question';
		let value = '';
		if (this.props.value) {
			value = this.props.value;
		}

		let input = (
			<input
				name = {this.props.element.Name}
				type="date"
				className="form-control"
				min = {this.props.element.Options.MinDate}
				max = {this.props.element.Options.MaxDate}
				onChange = {this.updateDate}
				value = {value}
			/>
		);

		if (!checkInput(this.props.element.Type)) {
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

		if (this.props.error) {
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
    let score_header=this.props.element.Description;
    let str=score_header.toLowerCase();
    if (str.includes('score')) {
        element = (
					<h1>
					</h1>
		 );
		 } else {
        element = (
					<h1>
						<Markdown content={this.props.element.Description}/>
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

class AdvcheckboxElement extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        value: '',
	    };
	}

	onSelect(lNull, value) {
		if (this.props.value !== value) {
			this.props.updateAnswer(this.props.element.Name, value);
		} else {
			this.props.updateAnswer(this.props.element.Name, lNull);
		}
	}

	render() {
		let checkbox = [];
		let value = this.props.value != null ? this.props.value : '';
		let checked = null;
		if (this.props.element.States.length == 2) {
			let lNull = this.props.element.States[0];
			let strValue = String(this.props.element.States[1]);
			if (strValue === value) {
				checked = (
					<i className="glyphicon glyphicon-ok" ></i>
				);
			}
			let rightTxt = null;
			if (this.props.element.RightTxt !== '') {
				rightTxt = (
					<div className="h3title rightTxt">
						<span>{this.props.element.RightTxt}</span>
					</div>
				);
			}
			checkbox = (
				<div className="col-xs-9 col-sm-6 select-option" onClick={this.onSelect.bind(this, lNull, strValue)}>
					<div className="selectBox">
						<label className="btn btn-default btn-box">
							{checked}
						</label>
					</div>
					{rightTxt}
				</div>
			);
		}

		let classInfo = 'col-xs-3 col-sm-6 h3title field_question';
		if (this.props.error) {
			classInfo += ' has-error';
		}

		let description = '';
		if (!!this.props.element.Description) {
			description = (
				<div className={classInfo}>
					<Markdown content={this.props.element.Description} />
				</div>
			);
		}

		return (
			<div className='row field_input' data-toggle="buttons">
				{description}
				{checkbox}
			</div>
		);
	}
}

export default Page;
