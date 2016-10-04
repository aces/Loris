FilterTable = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    'Module' : React.PropTypes.string.isRequired,
  },
  getDefaultProps: function() {
    return {
      "filterClass": "col-md-9"
    }
  },
  getInitialState: function() {
    return { 'collapsed' : false }
  },
  toggleCollapsed: function() {
    this.setState({ 'collapsed' : !this.state.collapsed });
  },
  render: function() {
    // Selection filter open by default
    var glyphClass = "glyphicon pull-right glyphicon-chevron-up";
    var panelClass = "panel-collapse collapse in";

    // Change arrow direction when closed
    if (this.state.collapsed) {
      glyphClass= "glyphicon pull-right glyphicon-chevron-down";
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading"
             onClick={this.toggleCollapsed}
             data-toggle="collapse"
             data-target="#selection-filter"
        >
          Selection Filter
          <span className={glyphClass}></span>
        </div>
        <div id="selection-filter" className={panelClass} role="tabpanel">
          <div className="panel-body">
            <div className="row">
              <div className={this.props.filterClass}>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

RFilterTable = React.createFactory(FilterTable);