/**
 * Created by Alizée Wickenheiser on 6/25/18.
 * Les contes de fées sont faits pour être défaits...
 */

const style = {
  root: {
    top: 0,
    bottom: 0,
    overflow: 'auto',
    // display: 'table-cell'
  },
  sidebar: {
    top: 0,
    bottom: 0,
    zIndex: 1,
    overflowY: 'auto',
  },
  content: {
    top: 0,
    bottom: 0,
    overflowY: 'scroll',
  }
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // width of the sidebar in pixels
      sidebar: props.sidebar,
    };

    this.saveSidebarRef = this.saveSidebarRef.bind(this);
  }

  componentDidMount() {
    this.setState({

    });
    this.saveSidebarWidth();
  }

  saveSidebarRef(node) {
    this.sidebar = node;
  }

  saveSidebarWidth() {
    const width = this.sidebar.offsetWidth;

    if (width !== this.state.sidebar.width) {
      let sidebar = this.state.sidebar;
      sidebar.width = width;
      this.setState({sidebar});
    }
  }

  render() {
    const styleSidebar = {...style.sidebar, ...this.props.styles.sidebar};
    const rootProps = {
      style: {...style.root, ...this.props.styles.root},
      role: 'navigation',
    };

    // sidebarStyle right/left
    if (this.props.pullRight) {
      styleSidebar.right = 0;
    } else {
      styleSidebar.left = 0;
    }

    return (
      <div {...rootProps}>
        <div style={styleSidebar} ref={this.saveSidebarRef}>
          {this.props.content}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  // styles
  styles: React.PropTypes.shape({
    root: React.PropTypes.object,
    sidebar: React.PropTypes.object,
    content: React.PropTypes.object,
  }),

  // sidebar content to render
  content: React.PropTypes.node.isRequired,

  // Place the sidebar on the right
  pullRight: React.PropTypes.bool,

  sidebar: React.PropTypes.object,
};

Sidebar.defaultProps = {
  styles: {},
  pullRight: false,
  sidebar: {
    width: 0,
  }
};

export default Sidebar;