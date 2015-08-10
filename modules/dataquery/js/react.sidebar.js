Sidebar = React.createClass({displayName: "Sidebar",
    getInitialState: function() {
        return {
            'hidden' : false
        };
    },
    toggleHidden: function() {
        this.setState({ 'hidden' : !this.state.hidden });
    },
    hide: function() {
        this.setState({ 'hidden' : true });
    },
    show: function() {
        this.setState({ 'hidden' : false});
    },
    render: function() {
        if(this.state.hidden) {
            return React.createElement("div", null);
        }
        return (
                React.createElement("div", null, 
                    React.createElement("h2", null, this.props.Name), 
                    this.props.children
                )
       );
    }
});
FieldsSidebar = React.createClass({displayName: "FieldsSidebar",
    getDefaultProps: function() {
        return {
            Fields: [],
            Criteria: {}
        }
    },
    reloadPage: function() {
        location.reload();
    },
    render: function() {
        if((!this.props.Fields || this.props.Fields.length === 0)
                &&
           (!this.props.Criteria || Object.keys(this.props.Criteria).length === 0)) {
            return React.createElement("div", null);
        }

        var fieldDiv = '';
        var fieldList = [];
        if(this.props.Fields) {
            for(var i = 0; i < this.props.Fields.length; i += 1) {
                fieldList.push(React.createElement("li", {className: "list-group-item", key: this.props.Fields[i]}, this.props.Fields[i]));
            }
        }
        return (React.createElement(Sidebar, {Name: "Fields"}, 
                    React.createElement("button", {onClick: this.reloadPage}, "Clear Query"), 
                    React.createElement("ul", {className: "list-group"}, 
                        fieldList
                    )
            ));
    }
});
