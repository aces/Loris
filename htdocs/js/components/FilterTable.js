'use strict';

FilterTable = React.createClass({
    displayName: 'FilterTable',

    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        'Module': React.PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
        return { 'collapsed': false };
    },
    toggleCollapsed: function toggleCollapsed() {
        this.setState({ 'collapsed': !this.state.collapsed });
    },
    render: function render() {
        var children,
            glyph,
            formURL = loris.BaseURL + "/" + this.props.Module + "/";
        if (this.state.collapsed === false) {
            children = React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'form',
                    { method: 'post', action: formURL },
                    this.props.children
                )
            );
        }
        glyph = "glyphicon " + (this.state.collapsed ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up') + " pull-right";

        return React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-sm-9' },
                React.createElement(
                    'div',
                    { className: 'panel panel-primary' },
                    React.createElement(
                        'div',
                        { className: 'panel-heading', onClick: this.toggleCollapsed },
                        'Selection Filter ',
                        React.createElement('span', { className: glyph })
                    ),
                    children
                )
            )
        );
    }
});

FilterField = React.createClass({
    displayName: 'FilterField',

    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        'Label': React.PropTypes.string.isRequired,
        'FormName': React.PropTypes.string.isRequired,
        'Type': React.PropTypes.oneOf(['Dropdown', 'Text'])
    },
    getDefaultProps: function getDefaultProps() {
        return {
            'Type': "Text"
        };
    },
    render: function render() {
        var item = React.createElement('div', null);
        if (this.props.Type === 'Text') {
            item = React.createElement(
                'div',
                { className: 'col-sm-12 col-md-8' },
                React.createElement('input', { name: this.props.FormName, type: 'text', className: 'form-control input-sm',
                    defaultValue: this.props.Value })
            );
        }
        if (this.props.Type === 'Dropdown') {
            var that = this;
            var options = Object.keys(this.props.Options).map(function (keyID) {
                var selected;
                if (keyID === "") {
                    return;
                }
                if (keyID === that.props.Value) {
                    selected = "selected";
                }
                return React.createElement(
                    'option',
                    { value: keyID, selected: selected },
                    that.props.Options[keyID]
                );
            });
            options.unshift(React.createElement(
                'option',
                { value: '' },
                'All'
            ));
            item = React.createElement(
                'div',
                { className: 'col-sm-12 col-md-8' },
                React.createElement(
                    'select',
                    { name: this.props.FormName, className: 'form-control input-sm' },
                    options
                )
            );
        }
        return React.createElement(
            'div',
            { className: 'form-group col-sm-6' },
            React.createElement(
                'label',
                { className: 'col-sm-12 col-md-4' },
                this.props.Label
            ),
            item
        );
    }
});

FilterActions = React.createClass({
    displayName: 'FilterActions',

    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        'Module': React.PropTypes.string.isRequired
    },
    resetFilters: function resetFilters() {
        location.href = loris.BaseURL + '/' + this.props.Module + "/?reset=true";
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'form-group col-md-2' },
                React.createElement('input', { type: 'submit', className: 'btn btn-sm btn-primary col-xs-12', name: 'filter', value: 'Show Data' })
            ),
            React.createElement(
                'div',
                { className: 'form-group col-md-2' },
                React.createElement('input', { type: 'button', name: 'reset', value: 'Clear Form', className: 'btn btn-sm btn-primary col-xs-12', onClick: this.resetFilters })
            )
        );
    }
});

RFilterTable = React.createFactory(FilterTable);
//# sourceMappingURL=FilterTable.js.map
