FilterTable = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        'Module' : React.PropTypes.string.isRequired,
    },
    getInitialState: function() {
        return { 'collapsed' : false }
    },
    toggleCollapsed: function() {
        this.setState({ 'collapsed' : !this.state.collapsed });
    },
    render: function() {
        var children, glyph, formURL = loris.BaseURL + "/" + this.props.Module + "/";
        if(this.state.collapsed === false) {
            children = <div className="panel-body">
                        <form method="post" action={formURL}>
                            {this.props.children}
                        </form>
                       </div>;

        }
        glyph = "glyphicon " + (this.state.collapsed ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up') + " pull-right";

        return (
                <div className="row">
                    <div className="col-sm-9">
                        <div className="panel panel-primary">
                            <div className="panel-heading" onClick={this.toggleCollapsed}>
                                Selection Filter <span className={glyph}></span>
                            </div>
                            {children}
                        </div>
                    </div>

                </div>
       );
    }
});

FilterField = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        'Label' : React.PropTypes.string.isRequired,
        'FormName' : React.PropTypes.string.isRequired,
        'Type' : React.PropTypes.oneOf(['Dropdown', 'Text'])
    },
    getDefaultProps: function() {
        return {
            'Type' : "Text",
        };
    },
    render: function() {
        var item = <div></div>;
        if(this.props.Type === 'Text') {
            item = <div className="col-sm-12 col-md-8">
                    <input name={this.props.FormName} type="text" className="form-control input-sm"
                            defaultValue={this.props.Value}/>
                </div>
        }
        if(this.props.Type === 'Dropdown') {
            var that = this;
            var options = Object.keys(this.props.Options).map(function (keyID) {
                var selected;
                if (keyID === "") {
                    return;
                }
                if (keyID === that.props.Value) {
                    selected = "selected";
                }
                return <option value={keyID} selected={selected}>{that.props.Options[keyID]}</option>;
            });
            options.unshift(<option value="">All</option>);
            item =  <div className="col-sm-12 col-md-8">
                <select name={this.props.FormName} className="form-control input-sm">
                {options}
                </select>
                    </div>
        }
        return <div className="form-group col-sm-6">
                <label className="col-sm-12 col-md-4">{this.props.Label}</label>
                {item}
            </div>
    }
});

FilterActions = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        'Module' : React.PropTypes.string.isRequired,
    },
    resetFilters: function() {
        location.href = loris.BaseURL + '/' + this.props.Module + "/?reset=true";
    },
    render: function() {
        return <div>
                    <div className="form-group col-md-2">
                        <input type="submit" className="btn btn-sm btn-primary col-xs-12" name="filter" value="Show Data" />
                    </div>
                    <div className="form-group col-md-2">
                        <input type="button" name="reset" value="Clear Form" className="btn btn-sm btn-primary col-xs-12" onClick={this.resetFilters} />
                    </div>
            </div>
    }
});

RFilterTable = React.createFactory(FilterTable);
