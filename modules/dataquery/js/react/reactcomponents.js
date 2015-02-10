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
        for(var i = 1; i < this.props.total / rowsPerPage; i += 1) {
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
            if(this.props.items[i] == this.state.selectedCategory) {
                selected=true;
            }
            items.push(<CategoryItem
                name={this.props.items[i]}
                count="2"
                selected={selected}
                onClick={this.selectCategoryHandler(this.props.items[i])} />);
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
    },
    render: function() {
        var classList = "list-group-item";
        var downloadIcon = "";
        var criteria;
        if(this.props.selected) {
            classList += " active";
        }
        if(this.props.downloadable) {
            downloadIcon = <span className="glyphicon glyphicon-download-alt pull-right" title="Downloadable File"></span>
        }
        if(this.props.type === "Criteria" && this.props.selected) {
            criteria = <span>
                    <select onClick={this.changeCriteria}>
                        <option> = </option>
                        <option>!=</option>
                        <option>&lt;=</option>
                        <option>&gt;</option>
                        <option>startsWith</option>
                        <option>contains</option>
                    </select>
                    <input onClick={this.changeCriteria} type="text" />
                </span>;
            return (
                <div className={classList} onClick={this.props.onClick}>
                <h4 className="list-group-item-heading">{this.props.FieldName} {criteria}</h4><p className="list-group-item-text">{this.props.Description}</p>
            </div>
            );
        }
        return (
            <div className={classList} onClick={this.props.onClick}>
                <h4 className="list-group-item-heading">{this.props.FieldName}{criteria}{downloadIcon}</h4><p className="list-group-item-text">{this.props.Description}</p>
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
        var rowsPerPage = this.props.FieldsPerPage || 10;

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
            fields.push(<FieldItem FieldName={fieldName}
                Description={desc}
                type={this.props.type}
                onClick={this.onFieldClick(fieldName)}
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
        } else {
            fields.push(fieldName);
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
            <div>
                <div className="row">
                    <h1 className="col-md-10">{this.props.title}</h1>
                    <div className="col-md-2 block">
                        <label>Search:</label><input type="text" onChange={this.filterChange}/>
                    </div>
                </div>
                <CategoryList items={this.props.items} onCategorySelect={this.onCategorySelect}/>
                <FieldList
                    items={this.state.categoryFields[this.state.selectedCategory]}
                    type={this.props.type}
                    onFieldSelect={this.onFieldSelect}
                    FieldsPerPage="10"
                    selected={this.state.selectedFields}
                    Filter={this.state.filter}
                />
            </div>
        );
    }
});

RFieldSelector = React.createFactory(FieldSelector);
RCategoryList = React.createFactory(CategoryList);
RFieldList = React.createFactory(FieldList);
