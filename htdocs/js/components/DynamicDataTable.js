DynamicDataTable = React.createClass({
    propTypes: {
        DataURL: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
        return {
            'Headers': [],
            'Data': [],
            'isLoaded': false,
            'loadedData': 0
        };
    },
    getDefaultProps: function () {
        return {
            'DataURL': ''
        };
    },
    componentDidMount: function () {
        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    console.log(evt);
                    that.setState({
                        'loadedData': evt.loaded
                    });
                });
                return xhr;
            },
            success: function (data) {
                that.setState({
                    'Headers': data.Headers,
                    'Data': data.Data,
                    'isLoaded': true
                });
            },
            error: function (data) {
                that.setState({ "error": "Unknown error loading data" });
            }
        });
    },
    render: function () {
        if (!this.state.isLoaded) {
            return React.createElement(
                'button',
                { className: 'btn-info has-spinner' },
                'Loading ',
                React.createElement('span', { className: 'glyphicon glyphicon-refresh glyphicon-refresh-animate' })
            );
        }

        return React.createElement(StaticDataTable, { Headers: this.state.Headers, Data: this.state.Data, getFormattedCell: this.props.getFormattedCell });
    }
});

RDynamicDataTable = React.createFactory(DynamicDataTable);
