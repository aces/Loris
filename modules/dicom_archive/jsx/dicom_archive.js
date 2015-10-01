DICOMFilterTable = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return (<FilterTable Module="dicom_archive">
                <div className="row">
                    <FilterField Label="Site" Type="Dropdown" Options={this.props.Sites} FormName="SiteID" />
                    <FilterField Label="Patient ID" Type="Text" FormName="PatientID" />
                </div>
                <div className="row">
                    <FilterField Label="Patient Name" Type="Text" FormName="PatientName" />
                    <FilterField Label="Gender" Type="Text" FormName="Gender" />
                </div>
                <div className="row">
                    <FilterField Label="Date of Birth" Type="Text" FormName="DoB" />
                    <FilterField Label="Acquisition Date" Type="Text" FormName="Acquisition" />
                </div>
                <div className="row">
                    <FilterField Label="Archive Location" Type="Text" FormName="Location" />
                    <FilterActions Module="dicom_archive" />
                </div>
        </FilterTable>
        );
    }

});
RDICOMFilterTable = React.createFactory(DICOMFilterTable);
