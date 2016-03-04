CategoryItem = React.createClass({
    render: function() {
        var classList = "list-group-item",
            badge = '';
        if(this.props.selected) {
            classList += " active";
        }
        if(this.props.count >= 0) {
            badge = <span className="badge">{this.props.count}</span>
        }
        return (
            <a href="#" className={classList} onClick={this.props.onClick}>
                {this.props.name}
                {badge}
            </a>
        );
    }
});

CategoryList = React.createClass({
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
            if(this.props.items[i].category == this.state.selectedCategory) {
                selected=true;
            }
            items.push(<CategoryItem
                key={this.props.items[i].category}
                name={this.props.items[i].category}
                count={this.props.items[i].numFields}
                selected={selected}
                onClick={this.selectCategoryHandler(this.props.items[i].category)} />);
        }
        return (
            <div className="list-group col-md-3 col-sm-12">{items}</div>
            );
    }
});

OperatorValue = React.createClass({
    preventDefault: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
    },
    render: function() {
        if(this.props.Type.indexOf('enum') === 0) {
            var optString = this.props.Type.substr(5, this.props.Type.length-6);
            var optArray  = optString.split(",");

            optArray = optArray.map(function (element) {
                var eTrim = element.trim();
                return eTrim.substr(1, eTrim.length-2);
            });
            optArray = optArray.map(function (str) {
                return <option value={str}>{str}</option>;
            });
            return (
                <select
                    className="queryValue"
                    defaultValue={this.props.Value}
                    onClick={this.preventDefault}
                    onChange={this.props.onChange}>
                        <option value=""></option>
                        {optArray}
                </select>
            );
        }
        return (<input
                    type="text"
                    className="queryValue"
                    onClick={this.preventDefault}
                    onChange={this.props.onChange}
                    defaultValue={this.props.Value}
                />);
    }
});
FieldItem = React.createClass({
    changeCriteria: function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var op = this.props.Criteria;
        var state = this.state;
        if(evt.target.classList.contains("queryOperator")) {
            op.operator = evt.target.value;
        }
        if(evt.target.classList.contains("queryValue")) {
            op.value = evt.target.value;
        }

        if(this.props.onCriteriaChange) {
            this.props.onCriteriaChange(this.props.FieldName, op);
        }
    },
    render: function() {
        var classList = "list-group-item row";
        var downloadIcon = "";
        var criteria;
        if(this.props.selected) {
            classList += " active";
        }
        if(this.props.downloadable) {
            downloadIcon = <span className="glyphicon glyphicon-download-alt pull-right" title="Downloadable File"></span>
        }
        // Don't display the category in the field selector
        var displayName = this.props.FieldName.substring(this.props.Category.length + 1);

        if(this.props.type === "Criteria" && this.props.selected) {
            criteria = <span>
                    <select className="queryOperator" onClick={this.changeCriteria} defaultValue={this.props.Criteria.operator}>
                        <option value="="> = </option>
                        <option value="!=">!=</option>
                        <option value="&lt;=">&lt;=</option>
                        <option value="&gt;=">&gt;=</option>
                        <option value="startsWith">startsWith</option>
                        <option value="contains">contains</option>
                    </select>
                    <OperatorValue Type={this.props.ValueType} onChange={this.changeCriteria} Value={this.props.Criteria.value} />
                </span>;
            return (
                <div className={classList} onClick={this.props.onClick}>
                    <h4 className="list-group-item-heading col-sm-12 col-md-2">{displayName}</h4>
                    <span className="col-sm-10 col-md-7">{this.props.Description}</span>
                    <span className="col-sm-2 col-md-3">{criteria}</span>
                </div>
            );
        }

        return (
            <div className={classList} onClick={this.props.onClick}>
                <h4 className="list-group-item-heading col-xs-12">{displayName}{criteria}{downloadIcon}</h4>
                <span className="col-xs-12">{this.props.Description}</span>
            </div>
        );
    }
});

FieldList = React.createClass({
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
            type = items[i].value.Type || "varchar(255)";

            if(fieldName.toLowerCase().indexOf(filter) == -1 && desc.toLowerCase().indexOf(filter) == -1) {
                continue;
            }
            isFile = false;
            if(items[i].value.IsFile) {
                isFile = true;
            }

            selected=false;
            if(this.props.selected && this.props.selected.indexOf(fieldName) > -1) {
                selected=true;
            }

            var crit = undefined;
            if(this.props.Criteria && this.props.Criteria[fieldName]) {
                crit = this.props.Criteria[fieldName];
            }
            fields.push(<FieldItem FieldName={fieldName}
                Category={this.props.category}
                Description={desc}
                ValueType={type}
                type={this.props.type}
                onClick={this.onFieldClick(fieldName)}
                Criteria={crit}
                onCriteriaChange={this.props.onCriteriaChange}
                selected={selected}
                downloadable={isFile}
                />);
            if(fields.length > rowsPerPage) {
                break;
            }
        }

        return (
            <div className="list-group col-md-9 col-sm-12">
                {fields}
                <PaginationLinks Total={items.length} Active={this.state.PageNumber} onChangePage={this.changePage} RowsPerPage={rowsPerPage}/>
            </div>
            );
    }
});

FieldSelector = React.createClass({
    propTypes: {
        selectedFields: React.PropTypes.array
    },
    getInitialState: function() {
        return {
            filter: "",
            selectedCategory: "",
            categoryFields: {
            }
        };
    },
    onFieldSelect: function(fieldName) {
        var fields = this.props.selectedFields;
        var idx = fields.indexOf(fieldName);

        if(idx > -1) {
            //fields.splice(idx, 1);
            if(this.props.onFieldChange) {
                this.props.onFieldChange("remove", fieldName);
            }
        } else {
            //fields.push(fieldName);
            if(this.props.onFieldChange) {
                this.props.onFieldChange("add", fieldName);
            }
        }
    },
    onCategorySelect: function(category) {
        var that=this;

        // Use the cached version if it exists
        if(this.state.categoryFields[category]) {
        } else {
            // Retrieve the data dictionary
            $.get(loris.BaseURL + "/AjaxHelper.php?Module=dataquery&script=datadictionary.php", { category: category}, function(data) {
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
    addAll: function() {
        var i, index, fieldName;
        for(i in this.state.categoryFields[this.state.selectedCategory]) {
            fieldName = this.state.categoryFields[this.state.selectedCategory][i].key.join(',');
            index = this.props.selectedFields.indexOf(fieldName);
            if(index === -1) {
                this.props.onFieldChange("add", fieldName);
            }
        }
    },
    deleteAll: function() {
        var i, index, fieldName;
        for(i in this.state.categoryFields[this.state.selectedCategory]) {
            fieldName = this.state.categoryFields[this.state.selectedCategory][i].key.join(',');
            index = this.props.selectedFields.indexOf(fieldName);
            if(index >= 0) {
                this.props.onFieldChange("remove", fieldName);
            }
        }
    },
    render: function() {
        return (
            <div>
                <div className="row">
                    <h1 className="col-md-8">{this.props.title}</h1>
                    <div className="form-group col-sm-4 search">
                        <label className="col-sm-12 col-md-4">Search within instrument:</label>
                        <div className="col-sm-12 col-md-8">
                            <input type="text" onChange={this.filterChange} className="form-control input-sm"/>
                        </div>
                    </div>
                </div>
                <div className="row form-group">
                    <button type="button" className="btn btn-primary" onClick={this.addAll}>Add All</button>
                    <button type="button" className="btn btn-primary" onClick={this.deleteAll}>Remove All</button>
                </div>
                <div className="row">
                    <CategoryList
                        items={this.props.items}
                        onCategorySelect={this.onCategorySelect}
                    />
                    <FieldList
                        items={this.state.categoryFields[this.state.selectedCategory]}
                        type={this.props.type}
                        category={this.state.selectedCategory}
                        Criteria={this.props.Criteria}
                        onFieldSelect={this.onFieldSelect}
                        onCriteriaChange={this.props.onCriteriaChange}
                        FieldsPerPage="15"
                        selected={this.props.selectedFields || []}
                        Filter={this.state.filter}
                    />
                </div>
            </div>
        );
    }
});
