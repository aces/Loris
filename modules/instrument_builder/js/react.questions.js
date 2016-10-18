/**
 *	This file contains the React classes for instrument builder
 * 	module. It is used to add and edit questions in the instrument
 *	builder.
 */

/*
 * Note: This is a wrapper for Form.js (Only used in instrument builder)
 *
 * This is the React class for a LORIS element. It takes
 * in an element and render's the HTML based on its type
 *
 */
LorisElement = React.createClass({
    displayName: 'LorisElement',

    render: function () {
        var element = this.props.element;
        var elementHtml = '';
        switch (element.Type) {
            case 'header':
                elementHtml = React.createElement(
                    'h2',
                    null,
                    element.Description
                );
                break;
            case 'label':
                elementHtml = React.createElement(
                    'p',
                    null,
                    element.Description
                );
                break;
            case 'score':
                elementHtml = React.createElement(StaticElement, { text: 0, label: element.Description });

                break;
            case 'text':
                if (element.Options.Type === 'small') {
                    elementHtml = React.createElement(TextboxElement, { label: element.Description });
                } else {
                    elementHtml = React.createElement(TextareaElement, { label: element.Description });
                }
                break;
            case 'select':
                if (element.Options.AllowMultiple) {
                    elementHtml = React.createElement(SelectElement, { label: element.Description,
                        options: element.Options.Values,
                        multiple: true });
                } else {
                    elementHtml = React.createElement(SelectElement, { label: element.Description,
                        options: element.Options.Values });
                }
                break;
            case 'date':
                elementHtml = React.createElement(DateElement, {
                    label: element.Description,
                    minYear: element.Options.MinDate,
                    maxYear: element.Options.MaxDate
                });
                break;
            case 'numeric':
                elementHtml = React.createElement(NumericElement, {
                    label: element.Description,
                    min: element.Options.MinValue,
                    max: element.Options.MaxValue
                });
                break;
            default:
                break;
        }
        return React.createElement(
            'div',
            null,
            elementHtml
        );
    }
});

/*
 *	This is the React class for the question text input
 */
QuestionText = React.createClass({
    displayName: 'QuestionText',

    // Keep track of the current input
    onChange: function (e) {
        this.props.updateState({ Description: e.target.value });
    },
    // Render the HTML
    render: function () {
        var errorMessage = '',
            errorClass = 'form-group';
        if (this.props.element.error && this.props.element.error.questionText) {
            // If an error is present, display the error
            errorMessage = React.createElement(
                'font',
                { className: 'form-error' },
                this.props.element.error.questionText
            );
            errorClass += " has-error";
        }
        return React.createElement(
            'div',
            { className: errorClass },
            React.createElement(
                'label',
                { className: 'col-sm-2 control-label' },
                'Question Text: '
            ),
            React.createElement(
                'div',
                { className: 'col-sm-6' },
                React.createElement('input', { className: 'form-control col-xs-12',
                    type: 'text', id: 'questionText',
                    size: '75',
                    value: this.props.element ? this.props.element.Description : '',
                    onChange: this.onChange
                }),
                errorMessage
            )
        );
    }
});

/*
 *	This is the React class for the question name input
 */
BasicOptions = React.createClass({
    displayName: 'BasicOptions',

    // Keep track of the current input
    onChange: function (e) {
        // replace whitespaces with underscores
        var questionName = e.target.value.trim().split(' ').join('_');
        this.props.updateState({ Name: questionName });
    },
    // Render the HTML
    render: function () {
        var errorMessage = '',
            errorClass = 'form-group';
        if (this.props.element.error && this.props.element.error.questionName) {
            // If an error is present, display the error
            errorMessage = React.createElement(
                'font',
                { className: 'form-error' },
                this.props.element.error.questionName
            );
            errorClass += " has-error";
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: errorClass },
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Question Name: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-6' },
                    React.createElement('input', { className: 'form-control',
                        type: 'text', id: 'questionName',
                        onChange: this.onChange,
                        value: this.props.element ? this.props.element.Name : ''
                    }),
                    errorMessage
                )
            ),
            React.createElement(QuestionText, { updateState: this.props.updateState, element: this.props.element })
        );
    }
});

/*
 *	This is the React class for the Dropdown options
 */
DropdownOptions = React.createClass({
    displayName: 'DropdownOptions',

    // Keep track the current option input
    getInitialState: function () {
        return {
            option: ''
        };
    },
    onChange: function (e) {
        this.setState({
            option: e.target.value
        });
    },
    // Add an option to the element
    addOption: function () {
        var option = this.state.option.trim();

        // Check for empty options
        if (option == "") {
            var temp = this.state.error ? this.state.error : {};
            temp.newSelectOption = "Dropdown options cannot be empty!";
            this.setState({
                error: temp
            });
            return;
        }

        // Remove error if corrected
        if (this.state.error) {
            var temp = this.state.error;
            delete temp.newSelectOption;
            this.setState({
                error: temp
            });
        }

        // add to option list
        var temp = Instrument.clone(this.props.element.Options);
        var key = Instrument.Enumize(this.state.option);
        temp.Values[key] = this.state.option;
        this.props.updateState({ Options: temp });

        // clear input field
        this.state.option = "";
    },
    // Reset the dropdown options
    resetOptions: function () {
        temp = Instrument.clone(this.props.element.Options);
        temp.Values = {};
        this.props.updateState({ Options: temp });
    },
    // Render the HTML
    render: function () {

        var multi = '';
        var options = Instrument.clone(this.props.element.Options.Values);
        var errorMessage = '';
        var dropdownClass = 'form-group';

        // Set the select option type
        if (this.props.element.Options.AllowMultiple) {
            multi = "multiple";
        }

        // If an error is present, display the error
        if (this.state.error && this.state.error.newSelectOption) {
            errorMessage = React.createElement(
                'span',
                { className: 'form-error' },
                this.state.error.newSelectOption
            );
            dropdownClass += " has-error";
        }

        return React.createElement(
            'div',
            null,
            React.createElement(BasicOptions, { updateState: this.props.updateState, element: this.props.element }),
            React.createElement(
                'div',
                { className: dropdownClass },
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Dropdown Option: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-3' },
                    React.createElement('input', { className: 'form-control', type: 'text', id: 'newSelectOption', value: this.state.option, onChange: this.onChange })
                ),
                React.createElement('input', { className: 'btn btn-default', type: 'button', value: 'Add option', onClick: this.addOption.bind(this, false) }),
                React.createElement('input', { className: 'btn btn-default', type: 'button', value: 'Reset', onClick: this.resetOptions }),
                React.createElement(
                    'div',
                    { className: 'col-sm-6 col-sm-offset-2' },
                    errorMessage
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Preview: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement(
                        'select',
                        { multiple: multi, id: 'selectOptions', className: 'form-control' },
                        Object.keys(options).map(function (option) {
                            return React.createElement(
                                'option',
                                null,
                                options[option]
                            );
                        })
                    )
                )
            )
        );
    }
});

/*
 *	This is the React class for the date options
 */
DateOptions = React.createClass({
    displayName: 'DateOptions',

    // Initilize
    getInitialState: function () {
        return {
            dateFormat: {
                "Date": "Standard Date",
                "BasicDate": "Basic Date (does not include 'Not Answered' option)",
                "MonthYear": "Month Year (does not include day of the month)"
            }
        };
    },
    componentDidMount: function () {
        this.props.element.Options.dateFormat = "";
    },
    // Keep track of the inputed years
    onChange: function (e) {
        var options = Instrument.clone(this.props.element.Options);
        if (e.target.id === 'datemin' && e.target.value.length > 0) {
            options.MinDate = e.target.value + "-01-01";
        } else if (e.target.id === 'datemax' && e.target.value.length > 0) {
            options.MaxDate = e.target.value + "-12-31";
        } else if (e.target.id === 'dateFormat') {
            options.dateFormat = e.target.value;
        }
        this.props.updateState({ Options: options });
    },
    // Render the HTML
    render: function () {
        // Truncate off the month and day from the date to only have the year.
        var minYear = this.props.element.Options.MinDate.split('-')[0],
            maxYear = this.props.element.Options.MaxDate.split('-')[0];

        var dateOptionsClass = 'options form-group',
            errorMessage = '';

        var dateFormatOptions = this.state.dateFormat;

        if (this.props.element.error && this.props.element.error.dateOption) {
            // If an error is present, display the error
            errorMessage = React.createElement(
                'span',
                { className: 'form-error' },
                this.props.element.error.dateOption
            );
            dateOptionsClass += " has-error";
        }

        return React.createElement(
            'div',
            null,
            React.createElement(BasicOptions, { updateState: this.props.updateState, element: this.props.element }),
            React.createElement(
                'div',
                { id: 'dateoptions', className: dateOptionsClass },
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Start year: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement('input', { className: 'form-control', type: 'number', id: 'datemin', min: '1900', max: '2100', value: minYear, onChange: this.onChange }),
                    errorMessage
                ),
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'End year: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement('input', { className: 'form-control', type: 'number', id: 'datemax', min: '1900', max: '2100', onChange: this.onChange, value: maxYear })
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Date Format: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-6' },
                    React.createElement(
                        'select',
                        { id: 'dateFormat', className: 'form-control', onChange: this.onChange },
                        Object.keys(dateFormatOptions).map(function (option) {
                            return React.createElement(
                                'option',
                                { value: option },
                                dateFormatOptions[option]
                            );
                        })
                    )
                )
            )
        );
    }
});

/*
 *	This is the React class for the numeric options
 */
NumericOptions = React.createClass({
    displayName: 'NumericOptions',

    // Keep track of the inputed numbers, casting them to
    // interger values.
    onChange: function (e) {
        var options = Instrument.clone(this.props.element.Options);

        if (e.target.id === 'numericmin') {
            options.MinValue = parseInt(e.target.value);
        } else if (e.target.id === 'numericmax') {
            options.MaxValue = parseInt(e.target.value);
        }
        this.props.updateState({ Options: options });
    },
    // Render the HTML
    render: function () {
        var errorMessage = '';
        var optionsClass = 'options form-group';

        // If an error is present, display the error
        if (this.props.element.error && this.props.element.error.numeric) {
            errorMessage = React.createElement(
                'span',
                { className: 'form-error' },
                this.props.element.error.numeric
            );
            optionsClass += "options form-group has-error";
        }

        return React.createElement(
            'div',
            null,
            React.createElement(BasicOptions, { updateState: this.props.updateState, element: this.props.element }),
            React.createElement(
                'div',
                { id: 'numericoptions', className: optionsClass },
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Min: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement('input', { className: 'form-control', type: 'number', id: 'numericmin', onChange: this.onChange, value: this.props.element.Options.MinValue })
                ),
                React.createElement(
                    'label',
                    { className: 'col-sm-2 control-label' },
                    'Max: '
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-2' },
                    React.createElement('input', { className: 'form-control', type: 'number', id: 'numericmax', onChange: this.onChange, value: this.props.element.Options.MaxValue })
                ),
                React.createElement(
                    'div',
                    { className: 'col-sm-offset-2 col-sm-10' },
                    errorMessage
                )
            )
        );
    }
});

/*
 *	This is the React class for the dropdown for the
 * 	different question types.
 */
ListElements = React.createClass({
    displayName: 'ListElements',

    // Set the desired question type
    selectType: function (newId, newValue) {
        var newState = {
            selected: {
                id: newId,
                value: newValue
            }
        },
            multi = false,
            textSize = 'small';
        // Set the options for the desired type
        switch (newId) {
            case 'textarea':
                textSize = 'large';
            case 'textbox':
                newState.Options = {
                    Type: textSize
                };
                break;
            case 'multiselect':
                multi = true;
            case 'dropdown':
                newState.Options = {
                    Values: {},
                    AllowMultiple: multi
                };
                break;
            case 'date':
                newState.Options = {
                    MinDate: '',
                    MaxDate: ''
                };
                break;
            case 'numeric':
                newState.Options = {
                    MinValue: 0,
                    MaxValue: 0
                };
                break;
        };
        this.props.updateState(newState);
    },
    // Render the HTML
    render: function () {
        return React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
                'label',
                { 'for': 'selected-input', className: 'col-sm-2 control-label' },
                'Question Type:'
            ),
            React.createElement(
                'div',
                { className: 'col-sm-4' },
                React.createElement(
                    'div',
                    { className: 'btn-group' },
                    React.createElement(
                        'button',
                        { id: 'selected-input', type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
                        React.createElement(
                            'span',
                            { id: 'search_concept' },
                            this.props.value,
                            ' '
                        ),
                        React.createElement('span', { className: 'caret' })
                    ),
                    React.createElement(
                        'ul',
                        { className: 'dropdown-menu', role: 'menu' },
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'div',
                                { className: 'col-sm-12' },
                                React.createElement(
                                    'h5',
                                    { className: '' },
                                    'Information'
                                )
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "header", "Header") },
                            React.createElement(
                                'a',
                                { id: 'header', className: 'option', title: 'Centered, header information' },
                                'Header'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "label", "Label") },
                            React.createElement(
                                'a',
                                { id: 'label', className: 'option', title: 'Unemphasized display text' },
                                'Label'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "score", "Scored Field") },
                            React.createElement(
                                'a',
                                { id: 'scored', className: 'option', title: 'Column which stores calculated data' },
                                'Scored Field'
                            )
                        ),
                        React.createElement('li', { className: 'divider' }),
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'div',
                                { className: 'col-sm-12' },
                                React.createElement(
                                    'h5',
                                    { className: '' },
                                    'Data entry'
                                )
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "textbox", "Textbox") },
                            React.createElement(
                                'a',
                                { id: 'textbox', className: 'option', title: 'Text box for user data entry' },
                                'Textbox'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "textarea", "Textarea") },
                            React.createElement(
                                'a',
                                { id: 'textarea', className: 'option', title: 'Larger text area for data entry' },
                                'Textarea'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "dropdown", "Dropdown") },
                            React.createElement(
                                'a',
                                { id: 'dropdown', className: 'option', title: 'Dropdown menu for users to select data from' },
                                'Dropdown'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "multiselect", "Multiselect") },
                            React.createElement(
                                'a',
                                { id: 'multiselect', className: 'option', title: 'Data entry where multiple options may be selected' },
                                'Multiselect'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "date", "Date") },
                            React.createElement(
                                'a',
                                { id: 'date', className: 'option', title: 'User data entry of a date' },
                                'Date'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "numeric", "Numeric") },
                            React.createElement(
                                'a',
                                { id: 'numeric', className: 'option', title: 'User data entry of a number' },
                                'Numeric'
                            )
                        ),
                        React.createElement('li', { className: 'divider' }),
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'div',
                                { className: 'col-sm-12' },
                                React.createElement(
                                    'h5',
                                    { className: '' },
                                    'Formatting'
                                )
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "line", "Blank Line") },
                            React.createElement(
                                'a',
                                { id: 'line', className: 'option', title: 'Empty line' },
                                'Blank Line'
                            )
                        ),
                        React.createElement(
                            'li',
                            { onClick: this.selectType.bind(this, "page-break", "Page Break") },
                            React.createElement(
                                'a',
                                { id: 'page-break', className: 'option', title: 'Start a new page' },
                                'Page Break'
                            )
                        )
                    )
                )
            )
        );
    }
});

/*
 *	This is the React class for adding a new element or
 * 	editing an exsiting one
 */
AddElement = React.createClass({
    displayName: 'AddElement',

    // Keep track of the current element state
    getInitialState: function () {
        var state;
        if (this.props.element) {
            // Editing an element, set to elements state
            state = {
                Options: Instrument.clone(this.props.element.Options),
                Description: Instrument.clone(this.props.element.Description),
                Name: Instrument.clone(this.props.element.Name),
                selected: Instrument.clone(this.props.element.selected)
            };
        } else {
            state = {
                Options: {},
                Description: '',
                Name: '',
                selected: {
                    id: '',
                    value: 'Select One'
                }
            };
        }
        return state;
    },
    // Update element state
    updateState: function (newState) {
        this.setState(newState);
    },
    // Add a question to the buildPane
    addQuestion: function () {
        var selected = this.state.selected.id,
            questionText = this.state.Description,
            questionName = this.state.Name,
            hasError = false,
            element;

        if (questionName && questionName.indexOf('status') > -1) {
            alert("Question name can't contain 'status' as part of the name!");
            return;
        }

        if (!selected) {
            // Error, no element selected, alert the user and return
            alert("No element type selected");
            return;
        }

        if (selected == 'date') {
            var min = this.state.Options.MinDate,
                max = this.state.Options.MaxDate;

            var minDate = Date.parse(min),
                maxDate = Date.parse(max);

            if (isNaN(minDate) && min != '' || isNaN(maxDate) && max != '') {
                var temp = this.state.error ? this.state.error : {};

                temp.dateOption = "Invalid date provided";
                this.setState({
                    error: temp
                });
                hasError = true;
            }

            if (minDate > maxDate && min != '' && max != '') {
                var temp = this.state.error ? this.state.error : {};

                temp.dateOption = "End year append befor start year";
                this.setState({
                    error: temp
                });
                hasError = true;
            }

            if (!hasError && this.state.error) {
                var temp = this.state.error;
                delete temp.dateOption;
                this.setState({
                    error: temp
                });
            }
        }

        // Checking for error on numeric field
        if (selected == 'numeric') {
            var min = this.state.Options.MinValue;
            var max = this.state.Options.MaxValue;

            if (min >= max) {
                var temp = this.state.error ? this.state.error : {};
                temp.numeric = "Max value must be larger than min value";
                this.setState({
                    error: temp
                });
                hasError = true;
            }

            // If error corrected, remove error message and error
            if (!hasError && this.state.error) {
                var temp = this.state.error;
                delete temp.numeric;
                this.setState({
                    error: temp
                });
            }
        }

        if (questionText == '' && selected != 'line') {
            // Error, question text is required. Set the element error flag
            // for the questionText with message. Set the hasError flag
            var temp = this.state.error ? this.state.error : {};
            if (selected == 'page-break') {
                temp.questionText = "Must use question text as page header";
            } else {
                temp.questionText = "No question text specified";
            }
            this.setState({
                error: temp
            });
            hasError = true;
        }

        if (!hasError && this.state.error) {
            // No error, remove the elememt's questionText error flag
            // if set
            var temp = this.state.error;
            delete temp.questionText;
            this.setState({
                error: temp
            });
        }

        if (questionName == '' && selected != "header" && selected != "label" && selected != 'line' && selected != 'page-break') {
            // Error, question name is needed for the desired type. Set the element error flag
            // for the questionName with message. Set the hasError flag
            var temp = this.state.error ? this.state.error : {};
            temp.questionName = "Must specifiy name for database to save value into";
            this.setState({
                error: temp
            });
            hasError = true;
        } else if (this.state.error) {
            // No error, remove the elememt's questionName error flag
            // if set
            var temp = this.state.error;
            delete temp.questionName;
            this.setState({
                error: temp
            });
        }
        if (hasError) {
            // An error is present, return
            return;
        }
        // Setup the desired element to be added
        switch (selected) {
            case 'header':
            case 'label':
                questionName = '';
                break;
            case 'textbox':
            case 'textarea':
                selected = 'text';
                break;
            case 'dropdown':
            case 'multiselect':
                selected = 'select';
                break;
            case 'page-break':
                // If page-break, add new page to the buildPane
                // element list
                this.props.addPage(questionText);
                return;
        }
        // Remove all error flags
        delete this.state.error;
        var element = {
            Type: selected,
            Description: questionText,
            Name: questionName,
            Options: this.state.Options,
            selected: this.state.selected
        };

        // Add/Update the Page's element array. The updateQuestion returns true
        // if element was added/updated, false if the element name already exists.
        if (typeof this.props.index !== 'undefined') {
            // If editing, supply updateQuestion with the elements index in the
            // Page's element array.
            hasError = !this.props.updateQuestions(element, this.props.index);
        } else {
            hasError = !this.props.updateQuestions(element);
        }
        if (hasError) {
            // Error, element name already exists. Set the element error flag
            // for the questionName with message.
            this.setState(function (state) {
                var temp = state.error ? state.error : {};
                temp.questionName = "Duplicate question name";
                return {
                    error: temp
                };
            });
        }
    },
    // Add an option to the options array
    addOption: function (multi) {
        // Use a function to update the state to enqueue an atomic
        // update that consults the previous value of state before
        // setting any values
        this.setState(function (state) {
            var temp = state.options,
                option = multi ? $("#newmultiSelectOption").val() : $("#newSelectOption").val();
            temp.push(option);
            return {
                options: temp
            };
        });
    },
    // Reset the options array
    resetOptions: function () {
        this.setState({
            options: []
        });
    },
    // Render the HTML
    render: function () {
        var questionInput,
            multi = false,
            options,
            header = '',
            buttons;
        // Set the inputs to display based on the desired element type
        switch (this.state.selected.id) {
            case 'header':
            case 'label':
            case 'page-break':
                questionInput = React.createElement(QuestionText, { updateState: this.updateState, element: this.state });
                break;
            case 'score':
            case 'textbox':
            case 'textarea':
                questionInput = React.createElement(BasicOptions, { updateState: this.updateState, element: this.state });
                break;
            case 'multiselect':
            case 'dropdown':
                questionInput = React.createElement(DropdownOptions, { updateState: this.updateState, element: this.state });
                break;
            case 'date':
                questionInput = React.createElement(DateOptions, { updateState: this.updateState, element: this.state });
                break;
            case 'numeric':
                questionInput = React.createElement(NumericOptions, { updateState: this.updateState, element: this.state });
                break;
            case 'defualt':
                break;
        }
        // Set the button/header based on whether you are editing or adding an element.
        if (this.props.element) {
            buttons = React.createElement('input', { className: 'btn btn-default', type: 'button', value: 'Edit Row', onClick: this.addQuestion });
        } else {
            header = React.createElement(
                'h2',
                null,
                'Add Question'
            );
            buttons = React.createElement('input', { className: 'btn btn-default', type: 'button', value: 'Add Row', onClick: this.addQuestion });
        }
        return React.createElement(
            'div',
            { className: 'col-xs-12' },
            header,
            React.createElement(
                'div',
                { className: 'form-horizontal', role: 'form' },
                React.createElement(ListElements, { updateState: this.updateState, value: this.state.selected.value }),
                questionInput,
                React.createElement(
                    'div',
                    { className: 'form-group' },
                    React.createElement(
                        'div',
                        { className: 'col-sm-offset-2 col-sm-10' },
                        buttons
                    )
                )
            )
        );
    }
});
