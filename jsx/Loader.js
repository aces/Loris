/**
 * This file contains the React component for Loader
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 */

/**
 * Loader component
 */
class Loader extends React.Component {

  render() {
    return (
        <div
          className="loader"
          style={{width: this.props.size, height: this.props.size}}
        />
    );
  }
}

Loader.propTypes = {size: React.PropTypes.int}
Loader.defaultProps = {size: 120}

export default Loader;
