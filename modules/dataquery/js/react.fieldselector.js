PaginationLinks = React.createClass({displayName: 'PaginationLinks',
    changePage: function(i) {
        var that = this;
        return function(evt) {
            if(that.props.onChangePage) {
                that.props.onChangePage(i);
            }
        };
    },
    render: function() {
        var rowsPerPage = this.props.RowsPerPage || 10;
        var pageLinks = [];
        var classList;
        if(this.props.total === 0) {
            return React.createElement("div", null);
        }
        for(var i = 1; i < this.props.total / rowsPerPage; i += 1) {
            classList = '';
            if(this.props.Active == i) {
                classList = "active";
            }
            pageLinks.push(React.createElement("li", {onClick: this.changePage(i), className: classList}, React.createElement("a", {href: "#"}, i)));
        }
        return (
            React.createElement("ul", {className: "pagination"}, 
                pageLinks
            )
        );
    }
});

CategoryItem = React.createClass({displayName: 'CategoryItem',
    render: function() {
        var classList = "list-group-item";
        if(this.props.selected) {
            classList += " active";
        }
        return (
            React.createElement("a", {href: "#", className: classList, onClick: this.props.onClick}, 
                this.props.name, 
                React.createElement("span", {className: "badge"}, this.props.count)
            )
        );
    }
});

CategoryList = React.createClass({displayName: 'CategoryList',
    getInitialState: function () {
        return {
            selectedCategory: ""
        };
    },

    selectCategoryHandler: function(category) {
        var that = this;
        return function(evt) {
            if(that.props.onCategorySelect) {
                that.props.onCategorySelect(category);
            }
            that.setState({
                selectedCategory: category
            });
        };
    },
    render: function() {
        var items = [],
             selectClosure = function(name) {
                 return this.selectCategory(name);
             };
        for(i = 0; i < this.props.items.length; i += 1) {
            selected = false;
            if(this.props.items[i] == this.state.selectedCategory) {
                selected=true;
            }
            items.push(React.createElement(CategoryItem, {
                key: this.props.items[i], 
                name: this.props.items[i], 
                count: "2", 
                selected: selected, 
                onClick: this.selectCategoryHandler(this.props.items[i])}));
        }
        return (
            React.createElement("div", {className: "list-group col-md-3 col-sm-12"}, items)
            );
    }
});

FieldItem = React.createClass({displayName: 'FieldItem',
    getInitialState: function() {
        return {
            "operator" : '=',
            "value"    : ''
        };
    },
    changeCriteria: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var state = this.state;
        if(evt.target.classList.contains("queryOperator")) {
            state.operator = evt.target.value;
        }
        if(evt.target.classList.contains("queryValue")) {
            state.value = evt.target.value;
        }
        this.setState(state);

        if(this.props.onCriteriaChange) {
            this.props.onCriteriaChange(this.props.FieldName, this);
        }
    },
    preventDefault: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    },
    render: function() {
        var classList = "list-group-item row";
        var downloadIcon = "";
        var criteria;
        if(this.props.selected) {
            classList += " active";
        }
        if(this.props.downloadable) {
            downloadIcon = React.createElement("span", {className: "glyphicon glyphicon-download-alt pull-right", title: "Downloadable File"})
        }
        // Don't display the category in the field selector
        var displayName = this.props.FieldName.substring(this.props.Category.length + 1);

        if(this.props.type === "Criteria" && this.props.selected) {
            criteria = React.createElement("span", null, 
                    React.createElement("select", {className: "queryOperator", onClick: this.changeCriteria, defaultValue: this.state.operator}, 
                        React.createElement("option", {value: "="}, " = "), 
                        React.createElement("option", {value: "!="}, "!="), 
                        React.createElement("option", {value: "<="}, "<="), 
                        React.createElement("option", {value: ">="}, ">"), 
                        React.createElement("option", {value: "startsWith"}, "startsWith"), 
                        React.createElement("option", {value: "contains"}, "contains")
                    ), 
                    React.createElement("input", {className: "queryValue", onClick: this.preventDefault, onChange: this.changeCriteria, type: "text", defaultValue: this.state.value})
                );
            return (
                React.createElement("div", {className: classList, onClick: this.props.onClick}, 
                    React.createElement("h4", {className: "list-group-item-heading col-sm-12 col-md-2"}, displayName), 
                    React.createElement("span", {className: "col-sm-10 col-md-7"}, this.props.Description), 
                    React.createElement("span", {className: "col-sm-2 col-md-3"}, criteria)
            )
            );
        }

        return (
            React.createElement("div", {className: classList, onClick: this.props.onClick}, 
                React.createElement("h4", {className: "list-group-item-heading col-sm-12 col-md-2"}, displayName, criteria, downloadIcon), 
                React.createElement("span", {className: "col-sm-12 col-md-10"}, this.props.Description)
            )
        );
    }
});
FieldList = React.createClass({displayName: 'FieldList',
    getInitialState: function() {
        return {
            PageNumber: 1
        };
    },
    onFieldClick: function(fieldName) {
        var that = this;
        return function(evt) {
            if(that.props.onFieldSelect) {
                that.props.onFieldSelect(fieldName);
            }
        }
    },
    changePage: function(i) {
        this.setState({
            PageNumber: i
        });
    },
    render: function() {
        var fields = [];
        var items = this.props.items || [];
        var fieldName, desc, isFile;
        var rowsPerPage = this.props.FieldsPerPage || 20;

        var start = (this.state.PageNumber - 1) * rowsPerPage;
        var filter = this.props.Filter.toLowerCase();
        if(filter > 0) {
            start = 0;
        }

        for(var i = start; i < items.length; i += 1) {
            fieldName = items[i].key;
            fieldName = fieldName.join(",");
            desc = items[i].value.Description;

            if(fieldName.toLowerCase().indexOf(filter) == -1 && desc.toLowerCase().indexOf(filter) == -1) {
                continue;
            }
            isFile = false;
            if(items[i].value.IsFile) {
                isFile = true;
            }

            selected=false;
            if(this.props.selected.indexOf(fieldName) > -1) {
                selected=true;
            }
            fields.push(React.createElement(FieldItem, {FieldName: fieldName, 
                Category: this.props.category, 
                Description: desc, 
                type: this.props.type, 
                onClick: this.onFieldClick(fieldName), 
                onCriteriaChange: this.props.onCriteriaChange, 
                selected: selected, 
                downloadable: isFile}
                ));
            if(fields.length > rowsPerPage) {
                break;
            }
        }

        return (
            React.createElement("div", {className: "list-group col-md-9 col-sm-12"}, 
                fields, 
                React.createElement(PaginationLinks, {total: items.length, Active: this.state.PageNumber, onChangePage: this.changePage, RowsPerPage: rowsPerPage})
            )
            );
    }
});

FieldSelector = React.createClass({displayName: 'FieldSelector',
    getInitialState: function() {
        return {
            filter: "",
            selectedCategory: "",
            selectedFields: [],
            categoryFields: {
            }
        };
    },
    onFieldSelect: function(fieldName) {
        var fields = this.state.selectedFields;
        var idx = fields.indexOf(fieldName);

        if(idx > -1) {
            fields.splice(idx, 1);
            if(this.props.onFieldChange) {
                this.props.onFieldChange("remove", fieldName);
            }
        } else {
            fields.push(fieldName);
            if(this.props.onFieldChange) {
                this.props.onFieldChange("add", fieldName);
            }
        }
        this.setState({
            selectedFields: fields
        });
    },
    onCategorySelect: function(category) {
        var that=this;

        // Use the cached version
        if(this.state.categoryFields[category]) {
            /*
            this.setState({
                categoryFields: categoryFields
            });
            */
        } else {
            // Retrieve the data dictionary
            $.get("AjaxHelper.php?Module=dataquery&script=datadictionary.php", { category: category}, function(data) {
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
    filterChange: function(evt) {
        this.setState({
            filter: evt.currentTarget.value
        });
    },
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("h1", {className: "col-md-10"}, this.props.title), 
                    React.createElement("div", {className: "col-md-2 block"}, 
                        React.createElement("label", null, "Search:"), React.createElement("input", {type: "text", onChange: this.filterChange})
                    )
                ), 
                React.createElement(CategoryList, {items: this.props.items, onCategorySelect: this.onCategorySelect}), 
                React.createElement(FieldList, {
                    items: this.state.categoryFields[this.state.selectedCategory], 
                    type: this.props.type, 
                    category: this.state.selectedCategory, 
                    onFieldSelect: this.onFieldSelect, 
                    onCriteriaChange: this.props.onCriteriaChange, 
                    FieldsPerPage: "15", 
                    selected: this.state.selectedFields, 
                    Filter: this.state.filter}
                )
            )
        );
    }
});

RFieldSelector = React.createFactory(FieldSelector);
