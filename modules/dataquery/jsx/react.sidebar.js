Sidebar = React.createClass({
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
            return <div />;
        }
        return (
                <div>
                    <h2>{this.props.Name}</h2>
                    {this.props.children}
                </div>
       );
    }
});
FieldsSidebar = React.createClass({
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
            return <div />;
        }

        var fieldDiv = '';
        var fieldList = [];
        if(this.props.Fields) {
            for(var i = 0; i < this.props.Fields.length; i += 1) {
                fieldList.push(<li className="list-group-item" key={this.props.Fields[i]}>{this.props.Fields[i]}</li>);
            }
        }
        return (<Sidebar Name="Fields">
                    <button onClick={this.reloadPage}>Clear Query</button>
                    <ul className="list-group">
                        {fieldList}
                    </ul>
            </Sidebar>);
    }
});
