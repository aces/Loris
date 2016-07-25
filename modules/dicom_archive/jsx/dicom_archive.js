DICOMFilterTable = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getFormValue: function(Name) {
        if(this.props.FilterValues && this.props.FilterValues[Name]) {
            return this.props.FilterValues[Name];
        }
        return undefined;
    },
    render: function() {
        var Genders = {
            M: 'Male',
            F: 'Female',
            O: 'N/A'
        };
        return (<FilterTable Module="dicom_archive">
                <div className="row">
                    <FilterField
                        Label="Site"
                        Type="Dropdown"
                        Options={this.props.Sites}
                        FormName="SiteID"
                        Value={this.getFormValue("SiteID")}
                    />
                    <FilterField
                        Label="Patient ID"
                        Type="Text"
                        FormName="PatientID"
                        Value={this.getFormValue("PatientID")}
                     />
                </div>
                <div className="row">
                    <FilterField
                        Label="Patient Name"
                        Type="Text"
                        FormName="PatientName"
                        Value={this.getFormValue("PatientName")}
                    />
                    <FilterField
                        Label="Gender"
                        Type="Dropdown"
                        Options={Genders}
                        FormName="Gender"
                        Value={this.getFormValue("Gender")}
                    />
                </div>
                <div className="row">
                    <FilterField
                        Label="Date of Birth"
                        Type="Text"
                        FormName="DoB"
                        Value={this.getFormValue("DoB")}
                    />
                    <FilterField
                        Label="Acquisition Date"
                        Type="Text"
                        FormName="Acquisition"
                        Value={this.getFormValue("Acquisition")}
                    />
                </div>
                <div className="row">
                    <FilterField
                        Label="Archive Location"
                        Type="Text"
                        FormName="Location"
                        Value={this.getFormValue("Location")}
                    />
                    <FilterActions Module="dicom_archive" />
                </div>
        </FilterTable>
        );
    }

});
RDICOMFilterTable = React.createFactory(DICOMFilterTable);
