LoadInstrument = React.createClass({displayName: "LoadInstrument",
	render: function () {
		return (
			React.createElement("div", {className: "col-sm-4 hidden-xs"}, 
			    React.createElement("div", {className: "panel panel-primary"}, 
			        React.createElement("div", {className: "panel-heading", onclick: "hideLoad();"}, 
			            "Load Instrument (optional)", 
			            React.createElement("span", {className: "glyphicon glyphicon-chevron-down pull-right", styles: "display:none", id: "down-load"}), 
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

InstrumentBuilderApp = React.createClass({displayName: "InstrumentBuilderApp",
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(LoadInstrument, null), 
				React.createElement("h1", null, "HELLO WORLD")
			)
		);
	}
});

RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);