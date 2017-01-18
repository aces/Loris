/* exported RBreadcrumbs */

/**
 * This file contains React component for Breadcrumbs.
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Breadcrumbs Component.
 * Used for navigation on all Loris pages.
 */
var Breadcrumbs = React.createClass({
  render: function() {
    var baseurl = this.props.baseURL;
    var breadcrumbs = this.props.breadcrumbs.map(function(element, i) {
      var url = baseurl + element.query;
      var crumb = (
          <a key={'crumb_' + i} href={url} className="btn btn-primary">
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
              <span className="glyphicon glyphicon-home" aria-hidden="true">
              </span>
            </a>
            {breadcrumbs}
          </div>
        </div>
      </div>
    );
  }
});

var RBreadcrumbs = React.createFactory(Breadcrumbs);
