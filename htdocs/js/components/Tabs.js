var Tabs = React.createClass({
    displayName: "Tabs",

    propTypes: {
        tabs: React.PropTypes.array.isRequired,
        defaultTab: React.PropTypes.string
    },
    getInitialState: function () {
        var activeTab = "";
        if (this.props.defaultTab) {
            activeTab = this.props.defaultTab;
        } else if (this.props.tabs.length > 0) {
            activeTab = this.props.tabs[0].id;
        }
        return {
            "activeTab": activeTab
        };
    },
    componentDidMount: function () {
        var e = new CustomEvent("tab-changed", {
            "activeTab": this.state.activeTab
        });
        window.dispatchEvent(e);
    },
    handleClick: function (id) {
        this.setState({
            "activeTab": id
        });
        var e = new CustomEvent("tab-changed", {
            "activeTab": id
        });
        window.dispatchEvent(e);
    },
    render: function () {
        var tabs = this.props.tabs.map(function (tab) {
            var tabClass;
            if (this.state.activeTab == tab.id) {
                tabClass = "active";
            }
            var href = "#" + tab.id;
            var tabID = "tab-" + tab.id;
            return React.createElement(
                "li",
                { role: "presentation", className: tabClass, onClick: this.handleClick.bind(tab.id) },
                React.createElement(
                    "a",
                    { id: tabID, href: href, role: "tab", "data-toggle": "tab" },
                    tab.label
                )
            );
        }, this);

        return (
            // each tab is an li
            React.createElement(
                "div",
                null,
                React.createElement(
                    "ul",
                    { className: "nav nav-tabs nav-tabs-loris", role: "tablist" },
                    tabs
                ),
                React.createElement(
                    "div",
                    { className: "tab-content" },
                    this.props.children
                )
            )
        );
    }
});

TabPane = React.createClass({
    displayName: "TabPane",

    getDefaultProps: function () {
        return {
            "DefaultTab": false
        };
    },
    getInitialState: function () {
        return {
            "isActive": this.props.DefaultTab
        };
    },
    componentWillMount: function () {
        var that = this;
        window.addEventListener("tab-changed", function (e) {
            if (e.activeTab === this.props.TabId) {
                that.setState({ isActive: true });
            } else {
                that.setState({ isActive: false });
            }
            console.log(e.activeTab);
        });
    },
    render: function () {
        var classList = "tab-pane";
        if (this.state.isActive) {
            classList += " active";
        }
        // Render the HTML
        return React.createElement(
            "div",
            { role: "tabpanel", className: classList, id: this.props.TabId },
            this.props.children
        );
    }
});
var RTabs = React.createFactory(Tabs);
