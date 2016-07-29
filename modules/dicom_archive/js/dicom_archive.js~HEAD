DicomArchive = React.createClass({
    displayName: 'DicomArchive',

    mixins: [React.addons.PureRenderMixin],

    getInitialState: function () {
        return {
            Filter: {}
        };
    },
    getDefaultProps: function () {
        return {
            Gender: {
                M: 'Male',
                F: 'Female',
                O: 'N/A'
            }
        };
    },
    setFilterValues: function (fieldName, fieldValue) {

        // Create deep copy of a current filter
        var Filter = JSON.parse(JSON.stringify(this.state.Filter));

        if (fieldValue === "") {
            delete Filter[fieldName];
        } else {
            Filter[fieldName] = fieldValue;
        }

        this.setState({ Filter: Filter });
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                FilterTable,
                { Module: 'dicom_archive' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(TextboxElement, {
                            name: 'Patient ID',
                            label: 'Patient ID',
                            onUserInput: this.setFilterValues
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(TextboxElement, {
                            name: 'Patient Name',
                            label: 'Patient Name',
                            onUserInput: this.setFilterValues
                        })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(SelectElement, {
                            name: 'Sites',
                            label: 'Sites',
                            options: this.props.Sites,
                            onUserInput: this.setFilterValues
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(SelectElement, {
                            name: 'Gender',
                            label: 'Gender',
                            options: this.props.Gender,
                            onUserInput: this.setFilterValues
                        })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(DateElement, {
                            name: 'Date Of Birth',
                            label: 'Date of Birth',
                            onUserInput: this.setFilterValues
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(DateElement, {
                            name: 'Acquisition',
                            label: 'Acquisition Date',
                            onUserInput: this.setFilterValues
                        })
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-md-6' },
                        React.createElement(TextboxElement, {
                            name: 'Archive Location',
                            label: 'Archive Location',
                            onUserInput: this.setFilterValues
                        })
                    )
                )
            ),
            React.createElement(DynamicDataTable, {
                DataURL: this.props.DataURL,
                Filter: this.state.Filter,
                getFormattedCell: this.props.getFormattedCell
            })
        );
    }
});

RDicomArchive = React.createFactory(DicomArchive);