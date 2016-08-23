/**
 *  The following file contains the components used for the field select tab
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

/*
 *  The following component is used for displaying individual categories in the
 *  categories list
 */
CategoryItem = React.createClass({
    displayName: "CategoryItem",

    render: function () {
        var classList = "list-group-item",
            badge = '';
        if (this.props.selected) {
            classList += " active";
        }
        if (this.props.count >= 0) {
            badge = React.createElement(
                "span",
                { className: "badge" },
                this.props.count
            );
        }
        return React.createElement(
            "a",
            { href: "#", className: classList, onClick: this.props.onClick },
            this.props.name,
            badge
        );
    }
});

/*
 *  The following component is used for displaying the list of availible categories
 */
CategoryList = React.createClass({
    displayName: "CategoryList",

    getInitialState: function () {
        return {
            selectedCategory: ""
        };
    },
    selectCategoryHandler: function (category) {
        var that = this;
        return function (evt) {
            if (that.props.onCategorySelect) {
                that.props.onCategorySelect(category);
            }
            that.setState({
                selectedCategory: category
            });
        };
    },
    render: function () {
        var items = [],
            selectClosure = function (name) {
            return this.selectCategory(name);
        };
        for (i = 0; i < this.props.items.length; i += 1) {
            selected = false;
            if (this.props.items[i].category == this.state.selectedCategory) {
                selected = true;
            }
            items.push(React.createElement(CategoryItem, {
                key: this.props.items[i].category,
                name: this.props.items[i].category,
                count: this.props.items[i].numFields,
                selected: selected,
                onClick: this.selectCategoryHandler(this.props.items[i].category) }));
        }
        return React.createElement(
            "div",
            { className: "list-group col-md-3 col-sm-12" },
            items
        );
    }
});

/*
 *  The following component is used for displaying individual fields
 */
FieldItem = React.createClass({
    displayName: "FieldItem",

    visitSelect: function (evt) {
        // Selects and deselects visits

        var field = {
            instrument: this.props.Category,
            field: this.props.FieldName
        };
        if (evt.target.checked) {
            this.props.fieldVisitSelect("check", evt.target.value, field);
        } else {
            this.props.fieldVisitSelect("uncheck", evt.target.value, field);
        }
    },
    render: function () {
        // Renders the html for the component

        var classList = "list-group-item row",
            downloadIcon = "",
            criteria,
            multiselect,
            that = this;
        if (this.props.selected) {
            // If field is selected, add active class and visits
            classList += " active";
            multiselect = Object.keys(this.props.Visits).map(function (visit) {
                var checked = false;
                if (that.props.selectedVisits[visit]) {
                    checked = true;
                }
                return React.createElement(
                    "div",
                    { "class": "checkbox" },
                    React.createElement(
                        "label",
                        null,
                        React.createElement("input", { type: "checkbox", value: visit, checked: checked, onChange: that.visitSelect }),
                        " ",
                        visit
                    )
                );
            });
        }
        if (this.props.downloadable) {
            // Add download icon if field is downloadable
            downloadIcon = React.createElement("span", { className: "glyphicon glyphicon-download-alt pull-right", title: "Downloadable File" });
        }
        // Don't display the category in the field selector
        var displayName = this.props.FieldName;

        return React.createElement(
            "div",
            { className: classList },
            React.createElement(
                "div",
                { className: "col-xs-8", onClick: this.props.onClick },
                React.createElement(
                    "h4",
                    { className: "list-group-item-heading col-xs-12" },
                    displayName,
                    criteria,
                    downloadIcon
                ),
                React.createElement(
                    "span",
                    { className: "col-xs-12" },
                    this.props.Description
                )
            ),
            React.createElement(
                "div",
                { className: "col-xs-4" },
                multiselect
            )
        );
    }
});

/*
 *  The following component is used for displaying the list of availible fields for
 *  the selected category
 */
FieldList = React.createClass({
    displayName: "FieldList",

    getInitialState: function () {
        return {
            PageNumber: 1
        };
    },
    onFieldClick: function (fieldName, downloadable) {
        // Wrapper function used to update field
        this.props.onFieldSelect(fieldName, this.props.category, downloadable);
    },
    changePage: function (i) {
        this.setState({
            PageNumber: i
        });
    },
    render: function () {
        // Renders the html for the component

        var fields = [];
        var items = this.props.items || [];
        var fieldName, desc, isFile;
        var rowsPerPage = this.props.FieldsPerPage || 20;

        var start = (this.state.PageNumber - 1) * rowsPerPage;
        var filter = this.props.Filter.toLowerCase();
        var selectedFields;
        if (filter > 0) {
            start = 0;
        }

        // Display the fields using the FieldItem component
        for (var i = start; i < items.length; i += 1) {
            fieldName = items[i].key[1];
            desc = items[i].value.Description;
            type = items[i].value.Type || "varchar(255)";

            if (fieldName.toLowerCase().indexOf(filter) == -1 && desc.toLowerCase().indexOf(filter) == -1) {
                continue;
            }

            // Check if field is a file, if so set flag to true
            isFile = false;
            if (items[i].value.IsFile) {
                isFile = true;
            }

            // Check if field is selected, if so set flag to true
            selected = false;
            if (this.props.selected && this.props.selected[fieldName]) {
                selected = true;
            }

            // Get the fields selected visits, set to empty object if none
            if (this.props.selected && this.props.selected[fieldName]) {
                selectedFields = this.props.selected[fieldName];
            } else {
                selectedFields = {};
            }

            fields.push(React.createElement(FieldItem, { FieldName: fieldName,
                Category: this.props.category,
                Description: desc,
                ValueType: type,
                onClick: this.onFieldClick.bind(this, fieldName, isFile),
                selected: selected,
                downloadable: isFile,
                Visits: this.props.Visits,
                selectedVisits: selectedFields,
                fieldVisitSelect: this.props.fieldVisitSelect
            }));
            if (fields.length > rowsPerPage) {
                break;
            }
        }

        return React.createElement(
            "div",
            { className: "list-group col-md-9 col-sm-12" },
            fields,
            React.createElement(PaginationLinks, { Total: items.length, Active: this.state.PageNumber, onChangePage: this.changePage, RowsPerPage: rowsPerPage })
        );
    }
});

/*
 *  The following component is the base component for the field select tan
 */
FieldSelector = React.createClass({
    displayName: "FieldSelector",

    propTypes: {
        selectedFields: React.PropTypes.array
    },
    getInitialState: function () {
        var instruments = {};
        for (var i = 0; i < this.props.items.length; i++) {
            instruments[this.props.items[i].category] = this.props.items[i].category;
        }
        return {
            filter: "",
            selectedCategory: "",
            categoryFields: {},
            instruments: instruments
        };
    },
    onFieldSelect: function (fieldName, category, downloadable) {
        // Wrapper function for field changes
        this.props.onFieldChange(fieldName, category, downloadable);
    },
    onCategorySelect: function (category) {
        // Used for getting the fields of the given category

        var that = this;

        // Use the cached version if it exists
        if (this.state.categoryFields[category]) {} else {
            // Retrieve the data dictionary
            $.get(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=datadictionary.php", { category: category }, function (data) {
                var cf = that.state.categoryFields;
                cf[category] = data;
                that.setState({
                    categoryFields: cf
                });
            }, 'json');
        }
        this.setState({
            selectedCategory: category
        });
    },
    filterChange: function (evt) {
        this.setState({
            filter: evt.currentTarget.value
        });
    },
    addAll: function () {
        // Adds all fields the currently selected category
        var i, isFile, fieldName, category;
        for (i in this.state.categoryFields[this.state.selectedCategory]) {
            fieldName = this.state.categoryFields[this.state.selectedCategory][i].key[1];
            category = this.state.categoryFields[this.state.selectedCategory][i].key[0];
            if (this.props.selectedFields[category] && this.props.selectedFields[category][fieldName]) {
                // Do nothing, already added
            } else {
                    isFile = this.state.categoryFields[category][i].value.isFile ? true : false;
                    this.props.onFieldChange(fieldName, category, isFile);
                }
        }
    },
    deleteAll: function () {
        // Deletes all fields the currently selected category
        var i, index, fieldName;
        for (i in this.state.categoryFields[this.state.selectedCategory]) {
            fieldName = this.state.categoryFields[this.state.selectedCategory][i].key[1];
            category = this.state.categoryFields[this.state.selectedCategory][i].key[0];
            if (this.props.selectedFields[category] && this.props.selectedFields[category][fieldName]) {
                isFile = this.state.categoryFields[category][i].value.isFile ? true : false;
                this.props.onFieldChange(fieldName, category, isFile);
            }
        }
    },
    modifyCategoryFieldVists: function (visit, action) {
        if (this.state.selectedCategory && this.props.selectedFields[this.state.selectedCategory]) {
            for (var field in this.props.selectedFields[this.state.selectedCategory]) {
                if (field == "allVisits") {
                    continue;
                }
                if (action == "check" && !this.props.selectedFields[this.state.selectedCategory][field][visit]) {
                    this.props.fieldVisitSelect(action, visit, { "instrument": this.state.selectedCategory, "field": field });
                } else if (action == "uncheck" && this.props.selectedFields[this.state.selectedCategory][field][visit]) {
                    this.props.fieldVisitSelect(action, visit, { "instrument": this.state.selectedCategory, "field": field });
                }
            }
        }
    },
    render: function () {
        // Renders the html for the component
        var categoryVisits = {},
            selectedFieldsCount;
        if (this.state.selectedCategory != "") {
            if (this.props.selectedFields[this.state.selectedCategory]) {
                selectedFieldsCount = Object.keys(this.props.selectedFields[this.state.selectedCategory]).length - 1;
            }
            for (var key in this.props.Visits) {
                if (this.props.selectedFields[this.state.selectedCategory] && this.props.selectedFields[this.state.selectedCategory].allVisits[key] && this.props.selectedFields[this.state.selectedCategory].allVisits[key] == selectedFieldsCount) {
                    categoryVisits[key] = true;
                } else {
                    categoryVisits[key] = false;
                }
            }
        }

        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "h1",
                    { className: "col-md-8" },
                    this.props.title
                ),
                React.createElement(
                    "div",
                    { className: "form-group col-sm-4 search" },
                    React.createElement(
                        "label",
                        { className: "col-sm-12 col-md-4" },
                        "Search within instrument:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-12 col-md-8" },
                        React.createElement("input", { type: "text", onChange: this.filterChange, className: "form-control input-sm" })
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row form-group" },
                React.createElement(
                    "div",
                    { className: "col-md-8" },
                    React.createElement(
                        "button",
                        { type: "button", className: "btn btn-primary", onClick: this.addAll },
                        "Add All"
                    ),
                    React.createElement(
                        "button",
                        { type: "button", className: "btn btn-primary", onClick: this.deleteAll },
                        "Remove All"
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row form-group" },
                React.createElement(
                    "div",
                    { className: "form-group col-sm-8 search" },
                    React.createElement(
                        "label",
                        { className: "col-sm-12 col-md-2" },
                        "Instrument:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-12 col-md-8" },
                        React.createElement(SelectDropdown, {
                            multi: false,
                            options: this.state.instruments,
                            onFieldClick: this.onCategorySelect,
                            selectedCategory: this.state.selectedCategory
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group col-sm-4 search" },
                    React.createElement(
                        "label",
                        { className: "col-sm-12 col-md-4" },
                        "Visits:"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-12 col-md-8" },
                        React.createElement(SelectDropdown, {
                            multi: true,
                            options: categoryVisits,
                            onFieldClick: this.modifyCategoryFieldVists
                        })
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(FieldList, {
                    items: this.state.categoryFields[this.state.selectedCategory],
                    category: this.state.selectedCategory,
                    Criteria: this.props.Criteria,
                    onFieldSelect: this.onFieldSelect,
                    FieldsPerPage: "15",
                    selected: this.props.selectedFields[this.state.selectedCategory],
                    Filter: this.state.filter,
                    Visits: this.props.Visits,
                    fieldVisitSelect: this.props.fieldVisitSelect
                })
            )
        );
    }
});
