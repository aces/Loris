DynamicDataTable = React.createClass({
    propTypes: {
        DataURL : React.PropTypes.string.isRequired,
    },

    getInitialState: function() {
        return {
            'Headers' : [],
            'Data' : [],
            'isLoaded': false,
            'loadedData' : 0
        };
    },
    getDefaultProps: function() {
        return {
            'DataURL' : ''
        };
    },
    componentDidMount: function() {
        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function(evt) {
                    console.log(evt);
                    that.setState({
                        'loadedData' : evt.loaded
                    });
                });
                return xhr;
            },
            success: function(data) {
                that.setState({
                    'Headers' : data.Headers,
                    'Data' : data.Data,
                    'isLoaded' : true
                });
            },
            error: function(data,error_code,error_msg) {
                console.error(error_code + ': ' + error_msg);
                that.setState({ "error" : "Error loading data" });
            }
        });
    },
    render: function() {
        if (!this.state.isLoaded) {

            if (this.state.error != undefined) {
                return <div className="alert alert-danger">
                         <strong>
                           {this.state.error}
                         </strong>
                       </div>;
            }

            return <button className="btn-info has-spinner">
                     Loading
                     <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
                     </span>
                   </button>;
        }

        return (
                <StaticDataTable Headers={this.state.Headers}
                                 Data={this.state.Data}
                                 Filter={this.props.Filter}
                                 getFormattedCell={this.props.getFormattedCell}
                                 freezeColumn={this.props.freezeColumn}
                />
            );
    }
});

RDynamicDataTable = React.createFactory(DynamicDataTable);
