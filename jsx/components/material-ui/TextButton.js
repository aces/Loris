import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
// import Tooltip from '@material-ui/core/Tooltip';

/*
 * Icons: https://material.io/tools/icons/?style=baseline
 */

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class TextButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      text: props.text,
      size: props.size,
      onclick: props.onclick,
      classes: props.classes,
      type: TextButton.processType(props.type),
      outlined: props.outlined ? {variant: 'outlined'} : {},
      contained: props.contained ? {variant: 'contained'} : {},
      icon: props.icon ? props.icon : {symbol: 'settings', mode: ''},
      circular: props.circular ? {variant: props.circular['extended'] ? 'extendedFab' : 'fab'} : {}
    };
  }

  static processType(type) {
    switch (type) {
      case 'default':
        return {};
      case 'primary':
        return {color: 'primary'};
      case 'secondary':
        return {color: 'secondary'};
      case 'disabled':
        return {disabled: true};
      default:
        return {href: type};
    }
  }

  render() {
    let icon = {
      left: this.state.icon.mode === 'left'
        ? (
            <Icon className={this.state.classes.leftIcon}>
              {this.state.icon.symbol}
            </Icon>
          ) : null,
      right: this.state.icon.mode === 'right'
        ? (
            <Icon className={this.state.classes.rightIcon}>
              {this.state.icon.symbol}
            </Icon>
          ) : null,
    };
    return (
      <Button
        id={this.state.id}
        {...this.state.type}
        size={this.state.size}
        {...this.state.outlined}
        {...this.state.contained}
        {...this.state.circular}
        className={this.state.classes.button}
        onClick={this.state.onclick}
      >
        {icon.left}
        {this.state.text}
        {icon.right}
      </Button>
    );
  }
}
TextButton.defaultProps = {
  type: 'default',
  size: 'medium',
  icon: null,
};
TextButton.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  onclick: PropTypes.func,
  size: PropTypes.string,
  icon: PropTypes.object,
  outlined: PropTypes.bool,
  contained: PropTypes.bool,
  circular: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextButton);
