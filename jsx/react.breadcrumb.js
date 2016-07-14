Breadcrumbs = React.createClass({
  render: function() {
    var baseurl = this.props.baseURL,
      breadcrumbs = this.props.breadcrumbs.map(function(element, i) {
        var url = baseurl + element.query
        crumb = (
          <a href={url} className="btn btn-primary">
            <div>
              {element.text}
            </div>
          </a>
        );
        return crumb;
      });
    return (
      <div className="row">
        <div className="col-xs-12">
          <div id="bc2" className="btn-group btn-breadcrumb">
            <a href={baseurl} className="btn btn-primary">
              <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
            </a>
            {breadcrumbs}
          </div>
        </div>
      </div>
    );
  }
});

RBreadcrumbs = React.createFactory(Breadcrumbs);