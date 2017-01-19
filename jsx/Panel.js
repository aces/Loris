/* exported Panel */

/**
 * This file contains React component for Panel
 *
 * @author Alex I.
 * @version 1.0.0
 *
 */

/**
 * Panel component
 * Wraps children in a collapsible bootstrap panel
 */
class Panel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    // Selection filter open by default
    let glyphClass = "glyphicon pull-right glyphicon-chevron-up";
    let panelClass = "panel-collapse collapse in";

    // Change arrow direction when closed
    if (this.state.collapsed) {
      glyphClass = "glyphicon pull-right glyphicon-chevron-down";
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-heading"
             onClick={this.toggleCollapsed}
             data-toggle="collapse"
             data-target={'#' + this.props.id}
             style={{cursor: 'pointer'}}
        >
          {this.props.title}
          <span className={glyphClass}></span>
        </div>
        <div id={this.props.id} className={panelClass} role="tabpanel">
          <div className="panel-body" style={{height: this.props.height}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  id: React.PropTypes.string,
  height: React.PropTypes.string,
  title: React.PropTypes.string
};
Panel.defaultProps = {
  id: 'default-panel',
  height: '100%',
  title: 'Selection Filter'
};
