LoadInstrument = React.createClass({displayName: "LoadInstrument",
	render: function () {
		return (
			React.createElement("div", {class: "col-sm-4 hidden-xs"}, 
			    React.createElement("div", {class: "panel panel-primary"}, 
			        React.createElement("div", {class: "panel-heading", onclick: "hideLoad();"}, 
			            "Load Instrument (optional)", 
			            React.createElement("span", {class: "glyphicon glyphicon-chevron-down pull-right", id: "down-load"}), 
			            React.createElement("span", {class: "glyphicon glyphicon-chevron-up pull-right", id: "up-load"})
			        ), 
			        React.createElement("div", {class: "panel-body", id: "panel-load"}, 
			            React.createElement("input", {class: "fileUpload", type: "file", id: "instfile"}), 
			            React.createElement("br", null), 
			            React.createElement("input", {class: "btn btn-default", type: "button", id: "load", value: "Load Instrument"})
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