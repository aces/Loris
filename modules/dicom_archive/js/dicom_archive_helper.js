DICOMFilterTable = React.createClass({
    displayName: 'DICOMFilterTable',

    mixins: [React.addons.PureRenderMixin],
    getFormValue: function (Name) {
        if (this.props.FilterValues && this.props.FilterValues[Name]) {
            return this.props.FilterValues[Name];
        }
        return undefined;
    },
    render: function () {
        var Genders = {
            M: 'Male',
            F: 'Female',
            O: 'N/A'
        };
        return React.createElement(
            FilterTable,
            { Module: 'dicom_archive' },
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(FilterField, {
                    Label: 'Site',
                    Type: 'Dropdown',
                    Options: this.props.Sites,
                    FormName: 'SiteID',
                    Value: this.getFormValue("SiteID")
                }),
                React.createElement(FilterField, {
                    Label: 'Patient ID',
                    Type: 'Text',
                    FormName: 'PatientID',
                    Value: this.getFormValue("PatientID")
                })
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(FilterField, {
                    Label: 'Patient Name',
                    Type: 'Text',
                    FormName: 'PatientName',
                    Value: this.getFormValue("PatientName")
                }),
                React.createElement(FilterField, {
                    Label: 'Gender',
                    Type: 'Dropdown',
                    Options: Genders,
                    FormName: 'Gender',
                    Value: this.getFormValue("Gender")
                })
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(FilterField, {
                    Label: 'Date of Birth',
                    Type: 'Text',
                    FormName: 'DoB',
                    Value: this.getFormValue("DoB")
                }),
                React.createElement(FilterField, {
                    Label: 'Acquisition Date',
                    Type: 'Text',
                    FormName: 'Acquisition',
                    Value: this.getFormValue("Acquisition")
                })
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(FilterField, {
                    Label: 'Archive Location',
                    Type: 'Text',
                    FormName: 'Location',
                    Value: this.getFormValue("Location")
                }),
                React.createElement(FilterActions, { Module: 'dicom_archive' })
            )
        );
    }

});
RDICOMFilterTable = React.createFactory(DICOMFilterTable);