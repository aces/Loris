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
class Breadcrumbs extends React.Component {

  render() {
    const baseURL = this.props.baseURL;
    const breadcrumbs = this.props.breadcrumbs.map(function(element, i) {
      const url = baseURL + element.query;
      const crumb = (
        <a key={'crumb_' + i} href={url} className="btn btn-primary">
          <div>
            {element.text}
          </div>
        </a>
      );
      return crumb;
    });

    return (
      <div id="bc2" className="btn-group btn-breadcrumb">
        <a href={baseURL} className="btn btn-primary">
          <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
        </a>
        {breadcrumbs}
      </div>
    );
  }

}

var RBreadcrumbs = React.createFactory(Breadcrumbs);

window.Breadcrumbs = Breadcrumbs;
window.RBreadcrumbs = RBreadcrumbs;

export default Breadcrumbs;
