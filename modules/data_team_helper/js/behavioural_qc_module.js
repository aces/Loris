var PagedRowHeader = React.createClass({
    displayName: 'PagedRowHeader',

    propType: {
        'header_row': React.PropTypes.array.isRequired
    },
    render: function () {
        return React.createElement(
            'thead',
            null,
            React.createElement(
                'tr',
                { className: 'info' },
                this.props.header_row.map(function (header_column) {
                    return React.createElement(
                        'th',
                        null,
                        header_column
                    );
                })
            )
        );
    }
});

var PagedTable = React.createClass({
    displayName: 'PagedTable',

    propTypes: {
        'table_headers': React.PropTypes.array,
        'table_rows': React.PropTypes.array
    },
    getInitialState: function () {
        return {
            pageSize: 10,
            currentPage: 1
        };
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            currentPage: 1
        });
    },
    getPage: function () {
        var start = this.state.pageSize * (this.state.currentPage - 1);
        var end = start + this.state.pageSize;

        return {
            currentPage: this.state.currentPage,
            table_rows: this.props.table_rows.slice(start, end),
            numPages: this.getNumPages(),
            handleClick: function (pageNum) {
                return function () {
                    this.handlePageChange(pageNum);
                }.bind(this);
            }.bind(this)
        };
    },
    getNumPages: function () {
        var numPages = Math.floor(this.props.table_rows.length / this.state.pageSize);
        if (this.props.table_rows.length % this.state.pageSize > 0) {
            numPages++;
        }
        return numPages;
    },
    handlePageChange: function (pageNum) {
        this.setState({ currentPage: pageNum });
    },
    render: function () {
        var page = this.getPage();
        var rows_to_map = page.table_rows;
        var children_to_map = this.props.children;
        var rows_for_current_page = rows_to_map.map(function (row) {
            var mapped = React.Children.map(children_to_map, function (child) {
                return React.cloneElement(child, {
                    row: row
                });
            });
            return mapped;
        });
        if (rows_for_current_page.length) {
            var table_contents = React.createElement(
                'table',
                { className: 'table table-hover table-primary table-bordered colm-freeze' },
                React.createElement(PagedRowHeader, { header_row: this.props.table_headers }),
                React.createElement(
                    'tbody',
                    null,
                    rows_for_current_page
                )
            );
        } else {
            var table_contents = "There is no data to display";
        }
        return React.createElement(
            'div',
            null,
            table_contents,
            React.createElement(
                'nav',
                null,
                React.createElement(BVLPager, { page: page })
            )
        );
    }
});

var IncompleteCandidatesRow = React.createClass({
    displayName: 'IncompleteCandidatesRow',

    handleClick: function (event) {
        event.preventDefault();
        var link = React.findDOMNode(this.refs.incomplete);
        window.open(link, "Incomplete Candidate");
    },
    propTypes: {
        'row': React.PropTypes.object.isRequired,
        'BaseURL': React.PropTypes.string.isRequired

    },
    render: function () {
        var row = this.props.row;
        return React.createElement(
            'tr',
            { key: row.id, onClick: this.handleClick },
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: this.props.BaseURL + "/" + row.candid + "/" + row.SessionID + "/" },
                    ' ',
                    row.visit_label,
                    ' '
                )
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: this.props.BaseURL + "/" + row.candid + "/" },
                    row.candid
                )
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: this.props.BaseURL + "/" + row.candid + "/" + row.SessionID + "/" + row.test_name + "/?commentID=" + row.commentid, ref: 'incomplete' },
                    row.Full_name
                )
            )
        );
    }
});

var InstrumentConflictsRow = React.createClass({
    displayName: 'InstrumentConflictsRow',
    proptypes: {
        'row': React.PropTypes.object.isRequired,
        'BaseURL': React.PropTypes.string.isRequired
    },
    render: function () {
        var row = this.props.row;
        return React.createElement(
            'tr',
            { key: row.CandID + row.visit_label + row.test_name_display + row.FieldName, onClick: this.handleClick },
            React.createElement(
                'td',
                null,
                row.visit_label
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: this.props.BaseURL + "/" + row.CandID + "/" },
                    row.CandID
                )
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: 'conflict', href: this.props.BaseURL + "/conflict_resolver/?CandID=" + row.CandID, className: 'conflict_resolver_link', 'data-pscid': row.PSCID, 'data-question': row.FieldName, 'data-instrument': row.TableName, 'data-visits': row.visit_label },
                    row.test_name_display
                )
            ),
            React.createElement(
                'td',
                null,
                row.FieldName
            )
        );
    }
});

var BehaviouralFeedbackRow = React.createClass({
    displayName: 'BehaviouralFeedbackRow',

    handleClick: function (event) {
        event.preventDefault();
        var link = React.findDOMNode(this.refs.feedback).href;
        var feedbackwindow = window.open(link, "Behavioural Feedback");
    },
    propTypes: {
        'row': React.PropTypes.object.isRequired,
        'BaseURL': React.PropTypes.string.isRequired
    },
    render: function () {
        var row = this.props.row;
        var bvl_link;
        var bvl_level;

        if (row.Feedback_level == 'visit') {
            bvl_link = this.props.BaseURL + "/" + row.CandID + "/" + row.SessionID + "/";
            bvl_level = "Visit : " + row.Visit_label;
        }

        if (row.Feedback_level == 'instrument') {
            bvl_link = this.props.BaseURL + "/" + row.CandID + "/" + row.SessionID + "/" + row.Test_name + "/?commentID=" + row.CommentID;
            bvl_level = "Instrument : " + row.Full_name;
        }

        if (row.Feedback_level == 'profile') {
            bvl_link = this.props.BaseURl + "/" + row.CandID + "/";
            bvl_level = "Profile";
        }

        return React.createElement(
            'tr',
            { key: row.FeedbackID, onClick: this.handleClick },
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: this.props.BaseURL + "/" + row.CandID + "/" },
                    row.CandID
                )
            ),
            React.createElement(
                'td',
                null,
                React.createElement(
                    'a',
                    { href: bvl_link, onClick: this.handleClick, ref: 'feedback' },
                    bvl_level
                )
            ),
            React.createElement(
                'td',
                null,
                row.FieldName
            )
        );
    }
});

var DefaultPanel = React.createClass({ displayName: 'CandidatesPanelTable',
    propTypes: {
        'title': React.PropTypes.string
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'panel panel-primary' },
            React.createElement(
                'div',
                { className: 'panel-heading' },
                this.props.title
            ),
            React.createElement(
                'div',
                { className: 'panel-body' },
                this.props.children
            )
        );
    }
});

var IncompleteCandidates = React.createClass({
    displayName: 'IncompleteCandidates',

    render: function () {
        return React.createElement(
            DefaultPanel,
            { title: this.props.title },
            React.createElement(
                PagedTable,
                { table_rows: this.props.incomplete_candidates, table_headers: this.props.header },
                React.createElement(IncompleteCandidatesRow, { BaseURL: this.props.BaseURL })
            )
        );
    }
});

var InstrumentConflicts = React.createClass({
    displayName: 'InstrumentConflicts',

    render: function () {
        return React.createElement(
            DefaultPanel,
            { title: this.props.title },
            React.createElement(
                PagedTable,
                { table_rows: this.props.conflicts, table_headers: this.props.header },
                React.createElement(InstrumentConflictsRow, { BaseURL: this.props.BaseURL })
            )
        );
    }
});

var BehaviouralFeedback = React.createClass({
    displayName: 'BehaviouralFeedback',

    render: function () {
        return React.createElement(
            DefaultPanel,
            { title: this.props.title },
            React.createElement(
                PagedTable,
                { table_rows: this.props.feedback, table_headers: this.props.header },
                React.createElement(BehaviouralFeedbackRow, { BaseURL: this.props.BaseURL })
            )
        );
    }
});

var BVLPager = React.createClass({
    displayName: 'BVLPager',

    render: function () {
        var page = this.props.page;
        var pageLinks = [];
        if (page.currentPage > 1) {
            pageLinks.push(React.createElement(
                'li',
                { onClick: page.handleClick(page.currentPage - 1) },
                React.createElement(
                    'span',
                    null,
                    '‹'
                )
            ));
            if (page.currentPage > 2) {
                pageLinks.push(React.createElement(
                    'li',
                    { onClick: page.handleClick(1) },
                    React.createElement(
                        'span',
                        null,
                        '1'
                    )
                ));
                pageLinks.push(React.createElement(
                    'li',
                    null,
                    React.createElement(
                        'span',
                        null,
                        '...'
                    )
                ));
            }
        }
        if (page.numPages > 1) {
            pageLinks.push(React.createElement(
                'li',
                { className: 'active' },
                React.createElement(
                    'span',
                    null,
                    page.currentPage
                )
            ));
        }
        if (page.currentPage < page.numPages) {
            pageLinks.push(React.createElement(
                'li',
                { onClick: page.handleClick(page.currentPage + 1) },
                React.createElement(
                    'span',
                    null,
                    page.currentPage + 1
                )
            ));
            if (page.currentPage < page.numPages - 1) {
                pageLinks.push(React.createElement(
                    'li',
                    { onClick: page.handleClick(page.currentPage + 2) },
                    React.createElement(
                        'span',
                        null,
                        page.currentPage + 2
                    )
                ));
            }
            if (page.currentPage < page.numPages - 2) {
                pageLinks.push(React.createElement(
                    'li',
                    { onClick: page.handleClick(page.currentPage + 3) },
                    React.createElement(
                        'span',
                        null,
                        page.currentPage + 3
                    )
                ));
            }
            if (page.currentPage < page.numPages - 3) {
                pageLinks.push(React.createElement(
                    'li',
                    null,
                    React.createElement(
                        'span',
                        null,
                        '...'
                    )
                ));
                pageLinks.push(React.createElement(
                    'li',
                    { onClick: page.handleClick(page.numPages) },
                    React.createElement(
                        'span',
                        null,
                        page.numPages
                    )
                ));
            }
            pageLinks.push(React.createElement(
                'li',
                { onClick: page.handleClick(page.currentPage + 1) },
                React.createElement(
                    'span',
                    { 'aria-hidden': 'true' },
                    '›'
                )
            ));
        }
        return React.createElement(
            'ul',
            { className: 'pagination pagination-sm' },
            pageLinks
        );
    }
});

var dataTeamGraphics = React.createClass({
    displayName: 'dataTeamGraphics',

    componentDidMount: function () {
        var chart = c3.generate({
            bindto: '#completedChart',
            data: {
                columns: [['data', this.props.percentCompleted]],
                type: 'gauge'
            },
            color: {
                pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                threshold: {
                    //            unit: 'value', // percentage is default
                    //            max: 200, // 100 is default
                    values: [30, 60, 90, 100]
                }
            }
        });
    },
    render: function () {
        if (this.props.pscid) {
            var pscid_status = "Candidate " + this.props.pscid;
        } else {
            var pscid_status = "All Candidates";
        }
        if (this.props.visit) {
            var visit_status = "On " + this.props.visit;
        } else {
            var visit_status = "Across All Visits";
        }
        if (this.props.instrument) {
            var instrument_status = "On Instrument " + this.props.instrument;
        } else {
            var instrument_status = "Across All Instruments";
        }
        return React.createElement(
            'div',
            { className: 'col-sm-12 col-md-5' },
            React.createElement(
                'div',
                { className: 'panel panel-primary' },
                React.createElement(
                    'div',
                    { className: 'panel-heading' },
                    'At A Glance: ',
                    pscid_status,
                    ' - ',
                    visit_status,
                    ' - ',
                    instrument_status
                ),
                React.createElement(
                    'div',
                    { className: 'panel-body' },
                    React.createElement('div', { id: 'completedChart' })
                )
            )
        );
    }
});

GraphicsPanel = React.createFactory(dataTeamGraphics);
BehaviouralFeedbackTab = React.createFactory(BehaviouralFeedback);
IncompleteCandidatesPanel = React.createFactory(IncompleteCandidates);
InstrumentConflictsPanel = React.createFactory(InstrumentConflicts);
