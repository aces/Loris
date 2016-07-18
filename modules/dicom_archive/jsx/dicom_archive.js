DicomArchive = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    getInitialState: function() {
        return {
            Filter: {},
        }
    },
    getDefaultProps: function() {
        return {
            Gender: {
                M: 'Male',
                F: 'Female',
                O: 'N/A'
            }
        }
    },
    setFilterValues: function(fieldName, fieldValue) {

        // Create deep copy of a current filter
        var Filter = JSON.parse(JSON.stringify(this.state.Filter));

        if (fieldValue === "") {
            delete Filter[fieldName];
        } else {
            Filter[fieldName] = fieldValue;
        }

        this.setState({Filter: Filter});
    },
    render: function() {
        return (
            <div>
                <FilterTable Module="dicom_archive">
                    <div className="row">
                        <div className="col-md-6">
                            <TextboxElement
                                name="Patient ID"
                                label="Patient ID"
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextboxElement
                                name="Patient Name"
                                label="Patient Name"
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <SelectElement
                                name="Sites"
                                label="Sites"
                                options={this.props.Sites}
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                        <div className="col-md-6">
                            <SelectElement
                                name="Gender"
                                label="Gender"
                                options={this.props.Gender}
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <DateElement
                                name="Date Of Birth"
                                label="Date of Birth"
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                        <div className="col-md-6">
                            <DateElement
                                name="Acquisition"
                                label="Acquisition Date"
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <TextboxElement
                                name="Archive Location"
                                label="Archive Location"
                                onUserInput={this.setFilterValues}
                            />
                        </div>
                    </div>
                </FilterTable>
                <DynamicDataTable
                    DataURL={this.props.DataURL}
                    Filter={this.state.Filter}
                    getFormattedCell={this.props.getFormattedCell}
                />
            </div>
        );
    }
});


RDicomArchive = React.createFactory(DicomArchive);
