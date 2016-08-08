var IssueEditForm = React.createClass({

    propTypes: {
        DataURL: React.PropTypes.string.isRequired,
        action: React.PropTypes.string.isRequired,
    },

    getInitialState: function () {
        return {
            'Data': [],
            'formData': {},
            'submissionResult': null,
            'errorMessage': null,
            'isLoaded': false,
            'loadedData': 0,
            'isNewIssue': false,
            'issueID': 0
        };
    },

    componentDidMount: function () {

        var that = this;
        $.ajax(this.props.DataURL, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        'loadedData': evt.loaded
                    });
                });
                return xhr;
            },
            success: function (data) {
                if (!data.issueData.issueID) {
                    that.setState({'isNewIssue': true});
                }

                var formData = {
                    'issueID': data.issueData.issueID,
                    'title': data.issueData.title,
                    'lastUpdate': data.issueData.lastUpdate,
                    'centerID': data.issueData.centerID,
                    'PSCID': data.issueData.PSCID,
                    'DCCID': data.issueData.DCCID,
                    'reporter': data.issueData.reporter,
                    'assignee': data.issueData.assignee,
                    'status': data.issueData.status,
                    'priority': data.issueData.priority,
                    'watching': data.issueData.watching,
                    'visitLabel': data.issueData.visitLabel,
                    'dateCreated': data.issueData.dateCreated,
                    'category': data.issueData.category,
                    'lastUpdatedBy': data.issueData.lastUpdatedBy
                };

                that.setState({
                    'Data': data,
                    'isLoaded': true,
                    'issueData': data.issueData,
                    'formData': formData
                });

            },
            error: function (data, error_code, error_msg) {
                that.setState({
                    'error': "error"
                });
            }
        });

    },

    render: function () {

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
                    loading
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                </button>
            );
        }

        var helpText = ""; //todo: here fill out the fields that are neccessary.
        var alertMessage = "";
        var alertClass = "alert text-center hide";
        var hasEditPermission = this.state.Data.hasEditPermission; //bool

        var headerText = " ";
        if (this.state.isNewIssue) {
            headerText = "Create New Issue";
        }
        else {
            headerText = "Edit Issue #" + this.state.issueData.issueID;
        }

        var lastUpdateValue = " ";
        if (this.state.isNewIssue) {
            lastUpdateValue = "Never!"
        } else {
            lastUpdateValue = this.state.issueData.lastUpdate
        }

        var lastUpdatedByValue = " ";
        if (this.state.isNewIssue) {
            lastUpdatedByValue = "No-one!"
        } else {
            lastUpdatedByValue = this.state.issueData.lastUpdatedBy
        }

        var dateCreated = " ";
        if (this.state.isNewIssue) {
            dateCreated = "Sometime Soon!"
        } else {
            dateCreated = this.state.issueData.dateCreated
        }

        var submitButtonValue = "";
        if (this.state.isNewIssue) {
            submitButtonValue = "Submit Issue"
        } else {
            submitButtonValue = "Update Issue"
        }
        
        if (this.state.submissionResult) {
            if (this.state.submissionResult == "success") {
                alertClass = "alert alert-success text-center";
                alertMessage = "Submission Successful!";
            } else if (this.state.submissionResult == "error") {
                var errorMessage = this.state.errorMessage;
                alertClass = "alert alert-danger text-center";
                alertMessage = errorMessage ? errorMessage : "Failed to submit issue :(";
            }
        }

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
                    <HeaderElement
                        name="issueID"
                        header={headerText}
                        ref="issueID"
                    />
                    <br/>
                    <ScoredElement
                        name="lastUpdate"
                        label={"Last Update: "}
                        ref="lastUpdate"
                        score={lastUpdateValue}
                    />
                    <ScoredElement
                        name="lastUpdatedBy"
                        label={"Last Updated By: "}
                        ref="lastUpdatedBy"
                        score={lastUpdatedByValue}
                    />
                    <ScoredElement
                        name="dateCreated"
                        label={"Date Created: "}
                        ref="dateCreated"
                        score={dateCreated}
                    />
                    <ScoredElement
                        name="reporter"
                        label={"Reporter: "}
                        ref="reporter"
                        score={this.state.issueData.reporter}
                    />
                    <SmallTextareaElement
                        name="title"
                        label="Title"
                        onUserInput={this.setFormData}
                        ref="title"
                        value={this.state.issueData.title}
                    />
                    <SelectElement
                        name="assignee"
                        label="Assignee"
                        emptyOption={true}//just cause I already put it in
                        options={this.state.Data.assignees} //cjeck that this is actually the correct syntax
                        onUserInput={this.setFormData}
                        ref="assignee"
                        disabled={!hasEditPermission}
                        value={this.state.issueData.assignee}
                    />
                    <SelectElement
                        name="status"
                        label="Status"
                        emptyOption={false}//just cause I already put it in
                        options={this.state.Data.statuses} //cjeck that this is actually the correct syntax
                        onUserInput={this.setFormData}
                        ref="status"
                        value={this.state.issueData.status} //todo: edit this so the options are different if the user doesn't have permission
                    />
                    <SelectElement
                        name="priority"
                        label="Priority"
                        emptyOption={false}//just cause I already put it in
                        options={this.state.Data.priorities} //cjeck that this is actually the correct syntax
                        onUserInput={this.setFormData}
                        ref="priority"
                        required={false}
                        disabled={!hasEditPermission}
                        value={this.state.issueData.priority}
                    />
                    <SelectElement
                        name="category"
                        label="Category"
                        emptyOption={true}//just cause I already put it in
                        options={this.state.Data.categories} //cjeck that this is actually the correct syntax
                        onUserInput={this.setFormData}
                        ref="category"
                        disabled={!hasEditPermission}
                        value={this.state.issueData.category}
                    />
                    <SelectElement
                        name="module"
                        label="Module"
                        emptyOption={true}//just cause I already put it in
                        options={this.state.Data.modules} //cjeck that this is actually the correct syntax
                        onUserInput={this.setFormData}
                        ref="module"
                        disabled={!hasEditPermission}
                        value={this.state.issueData.module}
                    />

                    <SelectElement
                        name="centerID"
                        label="Site"
                        emptyOption={true}//just cause I already put it in
                        options={this.state.Data.sites} //cjeck that this is actually the correct syntax
                        onUserInput={this.setFormData}
                        ref="centerID"
                        disabled={!hasEditPermission}
                        value={this.state.issueData.centerID}
                    />
                    <SmallTextareaElement
                        name="PSCID"
                        label="(PSCID)"
                        onUserInput={this.setFormData}
                        ref="PSCID"
                        disabled={true}
                        value={this.state.issueData.PSCID}
                    />
                    <SmallTextareaElement
                        name="DCCID"
                        label="(DCCID)"
                        onUserInput={this.setFormData}
                        ref="DCCID"
                        disabled={true}
                        value={this.state.issueData.DCCID}
                    />
                    <SmallTextareaElement
                        name="visitLabel"
                        label="(Visit Label)"
                        onUserInput={this.setFormData}
                        ref="visitLabel"
                        disabled={true}
                        value={this.state.issueData.visitLabel}
                    />
                    <HelpTextElement
                        html={true}
                        name="allComments"
                        label="Comment History"
                        text={this.state.issueData.commentHistory}
                        ref="allComments"
                    />
                    <TextareaElement
                        name="comment"
                        label="New Comment"
                        onUserInput={this.setFormData}
                        ref="comment"
                        value={null}
                    />
                    <SelectElement
                        name="watching"
                        label="Watching?"
                        emptyOption={false}
                        options={["No", "Yes"]}
                        onUserInput={this.setFormData}
                        ref="watching"
                        value={this.state.issueData.watching}
                    />
                    <ButtonElement label={submitButtonValue}/>
                </FormElement>
            </div>
        )
    },

    getDataAndChangeState: function () {
        var that = this;

        var dataURL = this.props.DataURL;

        if (this.state.isNewIssue) {

            var dataURL = this.props.DataURL;
            dataURL = dataURL.substring(0, dataURL.length - 2); //todo: check this performs correctly, should get rid of the '' in the issueID= in the get request (current url)
            dataURL = dataURL + this.state.issueID.toString(); //really hope this  is a string.
        }

        $.ajax(dataURL, {
            dataType: 'json',
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function (evt) {
                    that.setState({
                        'loadedData': evt.loaded
                    });
                });
                return xhr;
            },

            success: function (data) {

                if (!data.issueData.issueID) {
                    that.setState({'isNewIssue': true});
                }

                var formData = {
                    'issueID': data.issueData.issueID,
                    'title': data.issueData.title,
                    'lastUpdate': data.issueData.lastUpdate,
                    'centerID': data.issueData.centerID,
                    'PSCID': data.issueData.PSCID,
                    'DCCID': data.issueData.DCCID,
                    'reporter': data.issueData.reporter,
                    'assignee': data.issueData.assignee,
                    'status': data.issueData.status,
                    'priority': data.issueData.priority,
                    'watching': data.issueData.watching,
                    'visitLabel': data.issueData.visitLabel,
                    'dateCreated': data.issueData.dateCreated,
                    'category': data.issueData.category,
                    'lastUpdatedBy': data.issueData.lastUpdatedBy,
                    'commentHistory': data.issueData.commentHistory
                };


                that.setState({
                    'Data': data,
                    'isLoaded': true,
                    'issueData': data.issueData,
                    'formData': formData
                });

                that.setState({
                    'error': "finished success"
                })
            },
            error: function (data, error_code, error_msg) {
                that.setState({
                    'error': "error"
                });
            }
        });

    },


    /**
     * Handles form submission
     * @param e
     */
    handleSubmit: function (e) {
        e.preventDefault();

        var self = this;
        var myFormData = this.state.formData;
        var formRefs = this.refs;
        var formData = new FormData();
        var hasErrors = false;
        var issueData = this.state.issueData;

        // Validate the form
        if (!this.isValidForm(formRefs, myFormData)) {
            return;
        }

        for (var key in myFormData) {
            if (myFormData[key] != "" && myFormData[key] !== issueData[key]) {
                console.log(key);
                console.log(myFormData[key]);
                console.log(issueData[key]);
                formData.append(key, myFormData[key]);
            }
            // else {
            //     formData.append(key, null);
            // }
        }

        formData.append('issueID', myFormData['issueID']);

        $.ajax({
            type: 'POST',
            url: self.props.action,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
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

            success: function (data) {
                self.setState({
                    submissionResult: "success",
                    issueID: data
                });
                self.getDataAndChangeState();

                // Trigger an update event to update all observers (i.e DataTable) //todo: figure out what this is
                $(document).trigger('update');

                self.showAlertMessage();


            },
            error: function (err) {
                console.error(err);
                self.setState({
                    submissionResult: "error"
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
    setFormData: function (formElement, value) {

        //todo: only give valid inputs for fields given previous input to other fields

        var formDataUpdate = this.state.formData;
        formDataUpdate[formElement] = value;

        this.setState({
            formData: formDataUpdate
        });
    },

    /**
     * Validates the form
     *
     * @param formRefs
     * @param formData
     * @returns {boolean}
     */
    isValidForm: function (formRefs, formDataToCheck) {

        var isValidForm = true;
        var requiredFields = {
            'title': null,
        };

        Object.keys(requiredFields).map(function (field) {
            if (formDataToCheck[field]) {
                requiredFields[field] = formDataToCheck[field];
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
    showAlertMessage: function () {
        var self = this;

        if (this.refs["alert-message"] == null) {
            return;
        }

        var alertMsg = this.refs["alert-message"].getDOMNode();
        $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(500, function () {
            self.setState({
                uploadResult: null
            });
        });
    }


});

RIssueEditForm = React.createFactory(IssueEditForm);
