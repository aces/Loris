PaginationLinks = React.createClass({
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
            return <div />;
        }
        for(var i = 1; i <= Math.ceil(this.props.total / rowsPerPage); i += 1) {
            classList = '';
            if(this.props.Active == i) {
                classList = "active";
            }
            pageLinks.push(<li onClick={this.changePage(i)} className={classList}><a href="#">{i}</a></li>);
        }
        return (
            <ul className="pagination">
                {pageLinks}
            </ul>
        );
    }
});

CategoryItem = React.createClass({
    render: function() {
        var classList = "list-group-item";
        if(this.props.selected) {
            classList += " active";
        }
        return (
            <a href="#" className={classList} onClick={this.props.onClick}>
                {this.props.name}
                <span className="badge">{this.props.count}</span>
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
                    <input className="queryValue" onClick={this.preventDefault} onChange={this.changeCriteria} type="text" defaultValue={this.props.Criteria.value} />
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
                <h4 className="list-group-item-heading col-sm-12 col-md-2">{displayName}{criteria}{downloadIcon}</h4>
                <span className="col-sm-12 col-md-10">{this.props.Description}</span>
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
                <PaginationLinks total={items.length} Active={this.state.PageNumber} onChangePage={this.changePage} RowsPerPage={rowsPerPage}/>
            </div>
            );
    }
});

FieldSelector = React.createClass({
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
    },
    onCategorySelect: function(category) {
        var that=this;

        // Use the cached version if it exists
        if(this.state.categoryFields[category]) {
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
            <div>
                <div className="row">
                    <h1 className="col-md-10">{this.props.title}</h1>
                    <div className="col-md-2 block">
                        <label>Search:</label><input type="text" onChange={this.filterChange}/>
                    </div>
                </div>
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
        );
    }
});
