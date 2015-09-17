DICOMFilterTable = React.createClass({displayName: 'DICOMFilterTable',
    mixins: [React.addons.PureRenderMixin],
    render: function() {
        return (React.createElement(FilterTable, {Module: "dicom_archive"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement(FilterField, {Label: "Site", Type: "Dropdown", Options: this.props.Sites, FormName: "SiteID"}), 
                    React.createElement(FilterField, {Label: "Patient ID", Type: "Text", FormName: "PatientID"})
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement(FilterField, {Label: "Patient Name", Type: "Text", FormName: "PatientName"}), 
                    React.createElement(FilterField, {Label: "Gender", Type: "Text", FormName: "Gender"})
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement(FilterField, {Label: "Date of Birth", Type: "Text", FormName: "DoB"}), 
                    React.createElement(FilterField, {Label: "Acquisition Date", Type: "Text", FormName: "Acquisition"})
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement(FilterField, {Label: "Archive Location", Type: "Text", FormName: "Location"}), 
                    React.createElement(FilterActions, {Module: "dicom_archive"})
                )
        )
        );
    }

});
RDICOMFilterTable = React.createFactory(DICOMFilterTable);
