/**
 * This file contains the React Component for a vertical Collapsible Element.
 *
 * @author Regis Ongaro-Carcy
 * @version 1.0.0
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Collapsible Component.
 * React wrapper for a vertical Collapsible Element.
 */
class Collapsible extends Component {
    /**
     * Constructor.
     *
     * @constructor
     *
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            collapsibleOpen: false,
        };

        this.toggleView = this.toggleView.bind(this);
    }

    /**
     * Toggle element open/close.
     */
    toggleView(e) {
        e.preventDefault();
        this.setState({ collapsibleOpen: !this.state.collapsibleOpen });
    }

    /**
     * Renders the React component.
     *
     * @return {JSX} - React markup for the component
     */
    render() {
        const { children, title, colorActive, colorInactive } = this.props;

        const detailsStyle = {
            border: '2px solid #689BCC',
            padding: '7px',
            borderRadius: '4px',
            marginBottom: '10px',
        };

        // const white = '#FFFFFF';
        // const beige = '#F5F1C5';
        // const red = '#FBE4DD';
        // const green = '#E3FAE8';
        // const blue = '#EAF6FF';

        const summaryStyle = {
            backgroundColor: (
                this.state.collapsibleOpen ? colorActive : colorInactive
            ),
            padding: '10px',
            borderRadius: '4px',
            marginBottom: (
                this.state.collapsibleOpen ? '10px' : '0'
            ),
        };

        const renderChildren = () => {
            return this.state.collapsibleOpen && (children ?? 'Empty');
        };

        return (
            <details
                style={detailsStyle}
                open={this.state.collapsibleOpen}
            >
                <summary
                    style={summaryStyle}
                    onClick={this.toggleView}
                >
                    {this.state.collapsibleOpen ? '▼' : '▶'} {title}
                </summary>
                {renderChildren()}
            </details>
        );
    }
}

Collapsible.propTypes = {
    title: PropTypes.string,
    throwWarning: PropTypes.bool,
    children: PropTypes.node,
    colorActive: PropTypes.string,
    colorInactive: PropTypes.string,
};

Collapsible.defaultProps = {
    throwWarning: false,
    colorActive: '#FFFFFF',
    colorInactive: '#EAF6FF',
};

export default Collapsible;
