Sidebar = React.createClass({
    displayName: 'Sidebar',

    getInitialState: function () {
        return {
            'hidden': false
        };
    },
    toggleHidden: function () {
        this.setState({ 'hidden': !this.state.hidden });
    },
    hide: function () {
        this.setState({ 'hidden': true });
    },
    show: function () {
        this.setState({ 'hidden': false });
    },
    render: function () {
        if (this.state.hidden) {
            return React.createElement('div', null);
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                this.props.Name
            ),
            this.props.children
        );
    }
});
FieldsSidebar = React.createClass({
    displayName: 'FieldsSidebar',

    getDefaultProps: function () {
        return {
            Fields: [],
            Criteria: {}
        };
    },
    render: function () {
        if ((!this.props.Fields || this.props.Fields.length === 0) && (!this.props.Criteria || Object.keys(this.props.Criteria).length === 0)) {
            return React.createElement('div', null);
        }

        var fieldDiv = '';
        var fieldList = [];
        if (this.props.Fields) {
            for (var i = this.props.Fields.length - 1; i >= 0; i--) {
                var fieldInfo = this.props.Fields[i].split(",");
                fieldList.push(React.createElement(
                    'div',
                    { className: 'list-group-item row', key: this.props.Fields[i] },
                    React.createElement(
                        'h4',
                        { className: 'list-group-item-heading col-xs-12' },
                        fieldInfo[0]
                    ),
                    React.createElement(
                        'span',
                        { className: 'col-xs-12' },
                        fieldInfo[1]
                    )
                ));
            }
        }
        return React.createElement(
            Sidebar,
            { Name: 'Fields' },
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'button',
                    { className: 'btn btn-primary', onClick: this.props.resetQuery },
                    'Clear Query'
                )
            ),
            fieldList
        );
    }
});
