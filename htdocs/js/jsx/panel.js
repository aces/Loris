var Panel = React.createClass({
	displayName: "Panel",

	render: function render() {
		return React.createElement(
			"div",
			null,
			" hello "
		);
	}
});

BVLPanel = React.createFactory(Panel);

