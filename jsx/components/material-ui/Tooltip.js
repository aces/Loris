import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MaterialTooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 12,
  }
});

class Tooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <MaterialTooltip
        title={this.props.text}
        classes={{ tooltip: classes.lightTooltip }}
        placement={this.props.placement}>
        <div style={{display: 'inline-block'}}>
          {this.props.component}
        </div>
      </MaterialTooltip>
    );
  }
}

Tooltip.propTypes = {
  text: PropTypes.string,
  placement: PropTypes.string.isRequired,
  component: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.string,
    ]
  )
};

export default withStyles(styles)(Tooltip);
