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
    render: function() {
        if((!this.props.Fields || this.props.Fields.length === 0)
                &&
           (!this.props.Criteria || Object.keys(this.props.Criteria).length === 0)) {
            return <div />;
        }

        var fieldDiv = '';
        var fieldList = [];
        if(this.props.Fields) {
            for(var i = this.props.Fields.length - 1; i >= 0; i--) {
                var fieldInfo = this.props.Fields[i].split(",");
                fieldList.push(
                    <div className="list-group-item row" key={this.props.Fields[i]}>
                        <h4 className="list-group-item-heading col-xs-12">{fieldInfo[0]}</h4>
                        <span className="col-xs-12">{fieldInfo[1]}</span>
                    </div>
                );
            }
        }
        return (
            <Sidebar Name="Fields">
                <div className="form-group">
                    <button className="btn btn-primary" onClick={this.props.resetQuery}>Clear Query</button>
                </div>
                    {fieldList}
            </Sidebar>);
    }
});
