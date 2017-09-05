/**
 * This file contains React component for Direct Data Entry
 *
 * @author Jordan Stirling (StiringApps ltd.)
 * @version 0.0.1
 *
 */

/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */

import Page from './DirectEntryForm';

class DirectEntry extends React.Component {

	constructor(props) {
	    super(props);

	    const height = window.innerHeight / 3;
	    const style = {
	    	"margin-top": height
	    }
	    let page = -1;

	    if (props.InstrumentJSON.Elements[0].Type === 'ElementGroup' && props.InstrumentJSON.Elements[0].GroupType === 'Page') {
	    	// The following Instrument has pages
	    	page = 0;
	    }

	    this.nextPage = this.nextPage.bind(this);
	    this.prevPage = this.prevPage.bind(this);
	    this.updateAnswer = this.updateAnswer.bind(this);
	    this.setupPageValues = this.setupPageValues.bind(this);


	    this.state = {
	    	style: style,
	    	page: page,
	    	values: this.props.Values,
	    	errors: {},
	    	InstrumentJSON: props.InstrumentJSON
	    };

	}

	componentDidMount() {
		this.setupPageValues(this.state.page);
	}

	setupPageValues(page) {
		const pageElements = this.state.InstrumentJSON.Elements[page].Elements;
		let pageValues = {};

		for (let i = 0; i < pageElements.length; i++) {
			const name = this.getElementName(pageElements[i]);
			if(name instanceof Array) {
				for(let j = 0; j < name.length; j++) {
					if(name[j] in this.props.Values) {
						pageValues[name[j]] = this.props.Values[name[j]];
					}
				}
			} else if(name in this.props.Values) {
				pageValues[name] = this.props.Values[name];
			}
		}

		this.setState({
	    	pageValues: pageValues
	    });
	}

	getElementName(element) {
		let name;
		if (element.Type === 'ElementGroup') {
			name = [];
			for(let i = 0; i < element.Elements.length; i++) {
				name.push(this.getElementName(element.Elements[i]));
			}
		} else {
			name = element.Name
		}

		return name;
	}

	nextPage() {

		const data = {
			"data" : this.state.pageValues,
			"page" : this.state.page
		};
		const that = this;

		$.ajax({
		    url : window.location.href,
		    data : JSON.stringify(data),
		    type : 'PUT',
		    contentType : 'application/json',
		    success : function(result){
		        const page = that.state.page + 1;
		        const InstrumentJSON = JSON.parse(result);

		        that.setState({
					page: page,
					errors: {},
					InstrumentJSON: InstrumentJSON
				});

				that.setupPageValues(page);
				window.scrollTo(0,0);
		   },
		}).fail((responseData) => {
			if(responseData.status === 400) {
				const response = JSON.parse(responseData.responseText)
				this.setState({
					errors: response
				});
				alert("Please resolve page errors before continuing");
			}
		});

		
	}

	prevPage() {
		const page = this.state.page - 1;

        this.setState({
			page: page,
			errors: {}
		});
		this.setupPageValues(page);

		window.scrollTo(0,0);
	}

	updateAnswer(fieldName, value) {
		let data = {};
		data[fieldName] = value;

		console.log(data);

		$.ajax({
		    url : window.location.href,
		    data : JSON.stringify(data),
		    type : 'PATCH',
		    contentType : 'application/json'
		}); 

		this.setState(function(state) {
			let values = state.values;
			let pageValues = state.pageValues;
			values[fieldName] = value;
			pageValues[fieldName] = value;
			return {
				values: values,
				pageValues: pageValues
			}
		});
	}

	render() {
		let DirectEntryFormElements;
		let buttons;
		if (this.state.page >= 0) {
			DirectEntryFormElements = (
				<Page
					elements={this.state.InstrumentJSON.Elements[this.state.page].Elements}
					values={this.state.values}
					updateAnswer={this.updateAnswer}
					errors={this.state.errors}
				/>
			);
		} else {
			DirectEntryFormElements = (
				<Page
					elements={this.state.InstrumentJSON.Elements}
					values={this.state.values}
					updateAnswer={this.updateAnswer}
					errors={this.state.errors}
				/>
			);
		}
		if (this.state.page === -1 || (this.state.page === 0 && this.state.InstrumentJSON.Elements.length === 1)) {
			 buttons = (
			 	<button type="button" className="btn btn-primary btn-lg">Done</button>
			 );
		} else if (this.state.page === 0) {
			buttons = (
			 	<button type="button" className="btn btn-primary btn-lg" onClick={this.nextPage}>Next</button>
			 );
		} else if (this.state.page === this.state.InstrumentJSON.Elements.length - 1) {
			buttons = (
				<div>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.prevPage}>Prev</button>
				 	<button type="button" className="btn btn-primary btn-lg">Done</button>
				 </div>
			 );
		} else {
			buttons = (
				<div>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.prevPage}>Prev</button>
				 	<button type="button" className="btn btn-primary btn-lg" onClick={this.nextPage}>Next</button>
				</div>
			 );
		}
		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top">
  					<span className="h1" className="navbar-brand">LORIS</span>
				</nav>
				<div id='page' className='container-fluid' style={this.state.style}>
					{DirectEntryFormElements}
					<div className='question-container col-xs-12 col-sm-10 col-sm-offset-1'>
						{buttons}
					</div>
				</div>
			</div>
		);
	}
}

window.DirectEntry = DirectEntry;

export default DirectEntry;