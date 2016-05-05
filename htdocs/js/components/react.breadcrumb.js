"use strict";

Breadcrumbs = React.createClass({
	displayName: "Breadcrumbs",

	render: function render() {
		var baseurl = this.props.baseURL,
		    breadcrumbs = this.props.breadcrumbs.map(function (element, i) {
			var url = baseurl + element.query;
			crumb = React.createElement(
				"a",
				{ href: url, className: "btn btn-primary" },
				React.createElement(
					"div",
					null,
					element.text
				)
			);
			return crumb;
		});
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(
				"div",
				{ className: "col-xs-12" },
				React.createElement(
					"div",
					{ id: "bc2", className: "btn-group btn-breadcrumb alert alert-info alert-sm" },
					React.createElement(
						"a",
						{ href: baseurl, className: "btn btn-primary" },
						React.createElement("span", { className: "glyphicon glyphicon-home", "aria-hidden": "true" })
					),
					breadcrumbs
				)
			)
		);
	}
});

RBreadcrumbs = React.createFactory(Breadcrumbs);
//# sourceMappingURL=react.breadcrumb.js.map
