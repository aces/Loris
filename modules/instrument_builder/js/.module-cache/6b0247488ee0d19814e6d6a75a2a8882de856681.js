LoadInstrument = React.createClass({displayName: "LoadInstrument",
	render: function () {
		var spanDownStyle = {
			display: 'none'
		};
		return (
			React.createElement("div", {className: "col-sm-4 hidden-xs"}, 
			    React.createElement("div", {className: "panel panel-primary"}, 
			        React.createElement("div", {className: "panel-heading", onclick: "hideLoad();"}, 
			            "Load Instrument (optional)", 
			            React.createElement("span", {className: "glyphicon glyphicon-chevron-down pull-right", style: spanDownStyle, id: "down-load"}), 
			            React.createElement("span", {className: "glyphicon glyphicon-chevron-up pull-right", id: "up-load"})
			        ), 
			        React.createElement("div", {className: "panel-body", id: "panel-load"}, 
			            React.createElement("input", {className: "fileUpload", type: "file", id: "instfile"}), 
			            React.createElement("br", null), 
			            React.createElement("input", {className: "btn btn-default", type: "button", id: "load", value: "Load Instrument"})
			        )
			    )
			)
		);
	}
});

DisplayElement = React.createClass({displayName: "DisplayElement",
	render: function () {
		React.createElement("div", {className: "row"}, 
			React.createElement("div", {className: "col-xs-2"}, 
				this.props.databaseName
			), 
			React.createElement("div", {className: "col-xs-8"}, 
				this.props.element
			), 
			React.createElement("div", {className: "col-xs-2"}, 
				"oiwdjfiojwd"
			)
		)
	}
});

InstrumentBuilderApp = React.createClass({displayName: "InstrumentBuilderApp",
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "row"}, React.createElement(LoadInstrument, null)), 
				React.createElement("div", {className: "row"}, 
					React.createElement(DisplayElement, {
						databaseName: "Database Name", 
						element: "Question Display (Front End)"}
					)
				), 
				React.createElement("div", {className: "row"}, React.createElement("h1", null, "HELLO WORLD"))
			)
		);
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);