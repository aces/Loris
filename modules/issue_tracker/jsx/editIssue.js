var IssueEditForm = React.createClass({

    propTypes: {
        DataURL: React.PropTypes.string.isRequired,
        action: React.PropTypes.string.isRequired,
    },

    getInitialState: function() {
        return {
            'Data':         [],
            'formData':     {},
            'submissionResult': null,
            'errorMessage': null,
            'isLoaded':     false,
            'loadedData':   0,
            'isNewIssue': false
        };
    },

    componentDidMount: function() {
        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function(evt) {
                    that.setState({
                        'loadedData': evt.loaded
                    });
                });
                return xhr;
            },
            success: function(data) {

                if(data.issueData) {
                    var formData = {
                        'issueID': data.issueData.issueID,
                        'title': data.issueData.title,
                        'lastUpdate': data.issueData.lastUpdate,
                        'site': data.issueData.site,
                        'PSCID': data.issueData.PSCID,
                        'DCCID': data.issueData.DCCID,
                        'reporter': data.issueData.reporter,
                        'assignee': data.issueData.assignee,
                        'status': data.issueData.status,
                        'priority': data.issueData.priority,
                        'comment': data.issueData.comment,
                        'watching': data.issueData.watching,
                        'visitLabel': data.issueData.visitLabel,
                        'dateCreated': data.issueData.dateCreated,
                        'category': data.issueData.category
                    };
                }else{
                    that.setState({'isNewIssue': true});
                }

                that.setState({
                    'Data':      data,
                    'isLoaded':  true,
                    'issueData': data.issueData,
                    'formData':  formData
                });
            },
            error: function(data, error_code, error_msg) {
                that.setState({
                    'error': error_msg
                });
            }
        });
    },

    render: function() {

        if (!this.state.isLoaded) {
            if (this.state.error != undefined) {
                return (
                    <div className="alert alert-danger text-center">
                        <strong>
                            {this.state.error}
                        </strong>
                    </div>
                );
            }

            return (
                <button className="btn-info has-spinner">
                    Loading
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                </button>
            );
        }

        var helpText = ""; //todo: here fill out the fields that are neccessary.
        var alertMessage = "";
        var alertClass = "alert text-center hide";

        return (
            <div>
                <div className={alertClass} role="alert" ref="alert-message">
                    {alertMessage}
                </div>
                <FormElement
                    name="issueEdit"
                    onSubmit={this.handleSubmit}
                    ref="form"
                >
                    <h3>Edit Issue</h3>
                    <br />
                    <TextElement
                        name="title"
                        label="Title"
                        onUserInput={this.setFormData}
                        ref="title"
                        required={true}
                        value={this.state.issueData.title}
                    />
                    <LabelElement
                        name="last_update"
                        label="Last Update"
                        onUserInput={this.setFormData}
                        ref="visit_label"
                        required={true}
                        disabled={true}
                        value={this.state.issueData.last_update}
                    />
                    <TextareaElement
                        name="comments"
                        label="Comments"
                        onUserInput={this.setFormData}
                        ref="comments"
                        value={this.state.mediaData.comments}
                    />
                    <FileElement
                        id="mediaEditEl"
                        onUserInput={this.setFormData}
                        required={true}
                        disabled={true}
                        ref="file"
                        label="Uploaded file"
                        value={this.state.mediaData.file_name}
                    />
                    <SelectElement
                        name="hide_file"
                        label="Hide File"
                        emptyOption={false}
                        options={["No", "Yes"]}
                        onUserInput={this.setFormData}
                        ref="hide_file"
                        value={this.state.mediaData.hide_file}
                    />
                    <ButtonElement label="Update Issue"/>
                </FormElement>
            </div>
        )
    },

    /**
     * Handles form submission
     * @param e
     */
    handleSubmit: function(e) {
        e.preventDefault();

        var self = this;
        var myFormData = this.state.issueData;
        var formRefs = this.refs;
        var formData = new FormData();
        var hasErrors = false;

        for (var key in myFormData) {
            if (myFormData[key] != "") {
                formData.append(key, myFormData[key]);
            }
        }

        $('#mediaEditEl').hide();
        $("#file-progress").removeClass('hide');

        $.ajax({
            type:        'POST',
            url:         self.props.action,
            data:        formData,
            cache:       false,
            contentType: false,
            processData: false,
            xhr:         function() {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var progressbar = $("#progressbar");
                        var progresslabel = $("#progresslabel");
                        var percent = Math.round((evt.loaded / evt.total) * 100);
                        $(progressbar).width(percent + "%");
                        $(progresslabel).html(percent + "%");
                        progressbar.attr('aria-valuenow', percent);
                    }
                }, false);
                return xhr;
            },
            success:     function(data) {
                $("#file-progress").addClass('hide');
                self.setState({
                    uploadResult: "success"
                });
                self.showAlertMessage();
            },
            error:       function(err) {
                console.error(err);
                self.setState({
                    uploadResult: "error"
                });
                self.showAlertMessage();
            }

        });
    },

    /**
     * Sets the form data based on state values of child elements/componenets
     *
     * @param formElement
     * @param value
     */
    setFormData: function(formElement, value) {
        var formData = this.state.formData;
        formData[formElement] = value;

        this.setState({
            formData: formData
        });
    },

    /**
     * Validates the form
     *
     * @param formRefs
     * @param formData
     * @returns {boolean}
     */
    isValidForm: function(formRefs, formData) {

        var isValidForm = true;
        var requiredFields = {
            'pscid': null,
            'visit_label': null,
            'file' : null
        };

        Object.keys(requiredFields).map(function(field) {
            if (formData[field]) {
                requiredFields[field] = formData[field];
            } else {
                if (formRefs[field]) {
                    formRefs[field].props.hasError = true;
                    isValidForm = false;
                }
            }
        });
        this.forceUpdate();

        return isValidForm;

    },
    /**
     * Display a success/error alert message after form submission
     */
    showAlertMessage: function() {
        var self = this;

        if (this.refs["alert-message"] == null) {
            return;
        }

        var alertMsg = this.refs["alert-message"].getDOMNode();
        $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function() {
            self.setState({
                uploadResult: null
            });
        });
    }


});

RIssueEditForm = React.createFactory(IssueEditForm);