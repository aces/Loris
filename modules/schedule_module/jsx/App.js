import Modal from './Modal';
import {Api} from './Api';
import {FilterForm} from './FilterForm';
import {EditForm} from './EditForm';
import {debounce} from 'lodash';

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function deriveDataEntryLabelColor(a) {
    switch (a.dataEntryStatus) {
        case 'Upcoming': {
            return 'default';
        }
        case 'In Progress': {
            return 'warning';
        }
        case 'Complete': {
            return 'success';
        }
        case 'Not Started': {
            return 'warning';
        }
        case 'No Data Found':
        default: {
            return 'danger';
        }
    }
}
function deriveDataEntryStatus(a) {
    return {
        dataEntryStatus: a.dataEntryStatus,
        dataEntryLabelColor: deriveDataEntryLabelColor(a),
    };
}

const today = new Date();
const yesterday = new Date(today.getTime() - 24*60*60*1000);
const next30days = new Date(today.getTime() + 30 * 24*60*60*1000);
function zeroPad(str, length=2) {
    if (str.length >= length) {
        return str;
    }
    return '0'.repeat(length-str.length) + str;
}
function toDateString(date) {
    const y = date.getFullYear();
    const m = zeroPad((date.getMonth()+1).toString());
    const d = zeroPad(date.getDate().toString());
    return `${y}-${m}-${d}`;
}
const tabs = [
    {
        label: 'All',
        filters: {},
    },
    {
        label: 'Past',
        filters: {
            StartDateMax: toDateString(yesterday),
        },
    },
    {
        label: 'Next 30 Days',
        filters: {
            StartDateMin: toDateString(today),
            StartDateMax: toDateString(next30days),
        },
    },
];

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            candId: '',
            pscId: '',
            centerId: '',
            appointmentTypeId: '',
            startsAt: '',
            seen: '0',
            visitLabel: '',
            sites: [],
            visitLabels: [],
            appointmentTypes: [],
            open: {
                createAppointmentForm: false,
                editAppointmentForm: false,
            },
            tabIndex: 0,
            lockTabs: false,
            sessionId: -1,
            sessionsOfCandidate: {
                candId: '',
                pscId: '',
                sessions: [],
            },
            fetchSessionsOfCandidateError: undefined,
            desiredItemsPerPage: '20',
            desiredPage: '0',
            page: {
                data: [],
                meta: {
                    page: -1,
                    itemsPerPage: -1,
                    itemsFound: -1,
                    pagesFound: -1,
                },
            },
            sortOrder: 'ASC',
            sortColumn: 'PSCID',
        };

        this.openAppointmentForm = () => {
            this.setState({
                open: Object.assign(
                    {},
                    this.state.open,
                    {
                        createAppointmentForm: true,
                    }
                ),
            });
        };
        this.closeAppointmentForm = () => {
            this.setState({
                open: Object.assign(
                    {},
                    this.state.open,
                    {
                        createAppointmentForm: false,
                    }
                ),
            });
            this.clearForm();
        };
        this.closeEditForm = () => {
            this.setState({
                open: Object.assign(
                    {},
                    this.state.open,
                    {
                        editAppointmentForm: false,
                    }
                ),
            });
        };
        this.downloadAsCSV = () => {
            Api.fetchAppointments(Object.assign(
                {
                    itemsPerPage: Number.MAX_SAFE_INTEGER,
                    page: 0,
                },
                (
                    (this.state.lockTabs && this.state.searchFilters != undefined) ?
                        this.state.searchFilters :
                        tabs[this.state.tabIndex].filters
                )
            )).then((page) => {
                this.convertToCSV(page);
            });
        };

        this.convertToCSV = (page) => {
            const quote = (str) => {
                if (str.indexOf(`"`) > 0 || str.indexOf(',') > 0) {
                    str = str.replace(/\"/g, `""`);
                    return `"${str}"`;
                } else {
                    return str;
                }
            };
            const csv = [];
            const line = [
                'DCCID',
                'PSCID',
                'Site',
                'Visit Label',
                'Subproject',
                'Starts At',
                'Appointment Type',
                'Data Entry Status',
            ];
            csv.push(line.map(quote).join(','));

            for (const row of page.data) {
                const site = this.state.sites.find((item) => item.CenterID == row.CenterID);
                const appointmentType = this.state.appointmentTypes
                    .find((item) => item.AppointmentTypeID == row.AppointmentTypeID);

                const {
                    dataEntryStatus,
                } = deriveDataEntryStatus(row);
                const line = [
                    row.CandID,
                    row.PSCID,
                    site.Name,
                    row.Visit_label,
                    row.title,
                    row.StartsAt,
                    appointmentType.Name,
                    dataEntryStatus,
                ];
                csv.push(line.map(quote).join(','));
            }

            const today = new Date();
            const date = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + today.getDate();
            const time = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();
            const datetime = date + '-' + time;

            download('appointments-' + datetime + '.csv', csv.join('\n'));
        };

        this.fetchSessionsOfCandidate = debounce(() => {
            const candId = this.state.candId;
            const pscId = this.state.pscId;

            // Clear the error state
            this.setState({
                fetchSessionsOfCandidateError: undefined,
            });

            // If we're fetching the sessions of a different candidate,
            // discard the fetched sessions
            if (
                this.state.sessionsOfCandidate.candId != candId ||
                this.state.sessionsOfCandidate.pscId != pscId
            ) {
                this.setState({
                    sessionId: -1,
                    sessionsOfCandidate: {
                        candId: candId,
                        pscId: pscId,
                        sessions: [],
                    },
                });
            }
            if (candId == '' || pscId == '') {
                // No input yet
                return;
            }

            // Fetch the sessions
            Api.fetchSessionsOfCandidate(candId, pscId)
                .then((result) => {
                    console.log(result);
                    if (result.status != 200) {
                        this.setState({
                            fetchSessionsOfCandidateError: (typeof result.json.error == 'string') ?
                                result.json.error :
                                'An unknown error occurred',
                        });
                        return;
                    }
                    if (this.state.candId != candId || this.state.pscId != pscId) {
                        // The user typed in something else,
                        // and we just fetched the sessions of the previously entered candId.
                        // So, ignore this result.
                        return;
                    }
                    this.setState({
                        sessionId: -1,
                        sessionsOfCandidate: {
                            candId: candId,
                            pscId: pscId,
                            sessions: result.json,
                        },
                    });
                })
                .catch((err) => {
                    this.setState({
                        fetchSessionsOfCandidateError: err.message,
                    });
                });
        }, 500);

        this.refreshTab = debounce(() => {
            this.fetchTab(this.state.tabIndex);
        }, 500);
    }

    openEditForm() {
            let open = this.state.open;
            open.editAppointmentForm = true;
            this.setState({
                open: open,
            });
    }

    setCurrAppointment(a) {
            let currAppointment = this.state.currAppointment;
            currAppointment = a;
            this.setState({currAppointment});
    }

    clearForm() {
        this.setState({
            candId: '',
            pscId: '',
            centerId: '',
            appointmentTypeId: '',
            startDate: '',
            startTime: '',
            seen: '0',
            visitLabel: '',
            sessionId: -1,
            sessionsOfCandidate: {
                candId: '',
                pscId: '',
                sessions: [],
            },
            fetchSessionsOfCandidateError: undefined,
        });
    }

    createAppointment() {
        const body = [
            'CandID=' + encodeURIComponent(this.state.candId),
            'PSCID=' + encodeURIComponent(this.state.pscId),
            'SessionID=' + (
                this.state.sessionId > 0 ?
                    encodeURIComponent(this.state.sessionId) :
                    ''
            ),
            'AppointmentTypeID=' + encodeURIComponent(this.state.appointmentTypeId),
            'StartsAt=' + (
                (
                    /^\d{4,6}\-\d{2}\-\d{2}$/.test(this.state.startDate) &&
                    /^\d{2}\:\d{2}$/.test(this.state.startTime)
                ) ?
                    encodeURIComponent(
                        this.state.startDate +
                        ' ' +
                        this.state.startTime +
                        ':00'
                    ) :
                    ''
            ),
        ].join('&');
        return fetch(
            '/schedule_module/ajax/create_appointment.php',
            {
                credentials: 'include',
                method: 'POST',
                body: body,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
        ).then((res) => {
            return res.json()
                .then((data) => {
                    return {
                        status: res.status,
                        data: data,
                    };
                });
        }).then((result) => {
            if (result.status == 200) {
                this.setState({
                    page: Object.assign(
                        {},
                        this.state.page,
                        {
                            data: this.state.page.data.concat(result.data),
                            meta: Object.assign(
                                {},
                                this.state.page.meta,
                                {
                                    itemsFound: Number(this.state.page.meta.itemsFound)+1,
                                }
                            ),
                        }
                    ),
                });
            } else {
                throw new Error(result.data.error);
            }
        });
    }

    fetchPage() {
        Api.getOrFetchSites()
            .then((data) => {
                this.setState({
                    sites: data,
                });
            });
        Api.getOrFetchVisitLabels()
            .then((data) => {
                this.setState({
                    visitLabels: data,
                });
            });
        Api.getOrFetchAppointmentTypes()
            .then((data) => {
                this.setState({
                    appointmentTypes: data,
                });
            });
    }

    fetchTab(tabIndex) {
        if (tabIndex == undefined) {
            tabIndex = this.state.tabIndex;
        }
        if (this.state.lockTabs && this.state.searchFilters != undefined) {
            Api.fetchAppointments(Object.assign(
                {
                    itemsPerPage: parseInt(this.state.desiredItemsPerPage),
                    page: parseInt(this.state.desiredPage),
                    sortColumn: this.state.sortColumn,
                    sortOrder: this.state.sortOrder,
                },
                this.state.searchFilters
            ))
                .then((page) => {
                    this.setState({
                        page: page,
                    });
                });
            return;
        }
        Api.fetchAppointments(Object.assign(
            {
                itemsPerPage: parseInt(this.state.desiredItemsPerPage),
                page: parseInt(this.state.desiredPage),
                sortColumn: this.state.sortColumn,
                sortOrder: this.state.sortOrder,
            },
            tabs[tabIndex].filters
        ))
            .then((page) => {
                this.setState({
                    page: page,
                });
            });
    }

    componentDidMount() {
        this.fetchPage();
        this.fetchTab();
    }

    render() {
        let createAppointmentButton;
        let editAppointmentButton;

        createAppointmentButton = (
            <div className='Create Appointment Button'>
            <button className="btn btn-default" onClick={this.openAppointmentForm}>
                <span className='glyphicon glyphicon-calendar'/> Create Appointment
            </button>
            <Modal
                title='Create Appointment'
                show={this.state.open.createAppointmentForm}
                closeModal={this.closeAppointmentForm}
                throwWarning={true}
            >
            <div className="container-fluid">
                <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                        <label> DCCID: </label>
                        <br/>
                        <input className="form-control" type="text" name="candId" defaultValue={this.state.candId} onChange={(e) => {
                            this.setState({
                                candId: e.target.value,
                            });
                            this.fetchSessionsOfCandidate();
                        }}/>
                    </div>
                    <div className="form-group">
                        <label> PSCID: </label>
                        <br/>
                        <input className="form-control" type="text" name="pscId" defaultValue={this.state.pscId} onChange={(e) => {
                            this.setState({
                                pscId: e.target.value,
                            });
                            this.fetchSessionsOfCandidate();
                        }}/>
                    </div>
                    {
                        this.state.fetchSessionsOfCandidateError == undefined ?
                            undefined :
                            <div className="alert alert-danger">
                                <span className="glyphicon glyphicon-exclamation-sign"></span>
                                {this.state.fetchSessionsOfCandidateError}
                            </div>
                    }
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                        <label> Appointment Date: </label>
                        <br/>
                        <input className="form-control" type="date" defaultValue={this.state.startDate} onChange={(e) => {
                        this.setState({
                            startDate: e.target.value,
                        });
                        }}/>
                    </div>
                    <div className="form-group">
                        <label> Appointment Time: </label>
                        <br/>
                        <input className="form-control" type="time" defaultValue={this.state.startTime} onChange={(e) => {
                        this.setState({
                            startTime: e.target.value,
                        });
                        }}/>
                    </div>
                </div>
                </div>
                <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                        <label> Session: </label>
                        <br/>
                        <select className="form-control" defaultValue={this.state.sessionId} onChange={(e) => {
                            this.setState({
                                sessionId: e.target.value,
                            });
                        }}>
                        <option value="">- Select a Session -</option>
                        {
                            this.state.sessionsOfCandidate.sessions.map((s) => {
                                return <option key={s.SessionID} value={s.SessionID}>{s.SiteName} - {s.Visit_Label}</option>;
                            })
                        }
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="form-group">
                        <label> Type of Appointment: </label>
                        <br/>
                        <select className="form-control" defaultValue={this.state.appointmentTypeId} onChange={(e) => {
                        this.setState({
                            appointmentTypeId: e.target.value,
                        });
                        }}>
                        <option value="">- Select an Appointment Type -</option>
                        {
                            this.state.appointmentTypes.map((s) => {
                                return <option key={s.AppointmentTypeID} value={s.AppointmentTypeID}>{s.Name}</option>;
                            })
                        }
                        </select>
                    </div>
                </div>
                <br/>
                </div>
                <br/>
                <div className="buttoncent">
                    <button className="btn btn-primary" onClick={() => {
                        this.createAppointment()
                            .then(() => {
                                swal('Success!', 'Appointment created!', 'success');
                                this.closeAppointmentForm();
                            })
                            .catch((err) => {
                                swal('Unable to create appointment', err.message, 'error');
                            });
                    }}>
                        Create
                    </button>
                </div>
            </div>
            </Modal>
        </div>
        );

        editAppointmentButton = (
            <div className='Edit Appointment'>
                <Modal
                    title='Edit Appointment'
                    show={this.state.open.editAppointmentForm}
                    closeModal={this.closeEditForm}
                    throwWarning={false}
                >
                    <EditForm
                        appointment={this.state.currAppointment}
                        onEdit={(edited) => {
                            const appointments = this.state.page.data.slice();
                            const index = appointments.findIndex((item) => item.AppointmentID == edited.AppointmentID);
                            appointments[index] = edited;
                            this.setState({
                                page: Object.assign(
                                    {},
                                    this.state.page,
                                    {
                                        data: appointments,
                                    }
                                ),
                                toEdit: undefined,
                            });
                            swal('Success!', 'Appointment updated!', 'success');
                            this.closeEditForm();
                        }}
                        onError={(err) => {
                            swal('Unable to edit appointment', err.message, 'error');
                        }}
                        onCancel={() => {
                            this.setState({
                                toEdit: undefined,
                            });
                            this.closeEditForm();
                        }}
                    />
                </Modal>
            </div>
        );

        return (
            <div>
                <FilterForm
                    onApply={(filters) => {
                        this.setState({
                            tabIndex: 0,
                            lockTabs: true,
                            searchFilters: filters,
                        });
                        Api.fetchAppointments(Object.assign(
                            {
                                itemsPerPage: parseInt(this.state.desiredItemsPerPage),
                                page: parseInt(this.state.desiredPage),
                                sortColumn: this.state.sortColumn,
                                sortOrder: this.state.sortOrder,
                            },
                            filters
                        )).then((page) => {
                            this.setState({
                                page: page,
                            });
                        });
                    }}
                    onClear={() => {
                        this.setState({
                            lockTabs: false,
                            searchFilters: undefined,
                        });
                        setTimeout(() => {
                            this.fetchTab();
                        }, 1);
                    }}
                />
                <h style={{margin: '10px'}}>
                {createAppointmentButton}
                </h>
                <br/>
                <ul className="nav nav-tabs" style={{marginTop: '10px', marginBottom: '10px', marginLeft: '0px'}}>
                    {
                        /* Map the tabs array to jsx element (makes new array; old array + new info) */
                        tabs.map((tab, index) => (
                            /* Set tab label to element key + if current tab is selected tab, set to active (this gives the appearance of being on a certain tab on the front end*/
                            <li key={tab.label} className={[
                                    (!this.state.lockTabs && this.state.tabIndex == index) ? 'active' : '',
                                    (this.state.lockTabs) ? 'disabled' : '',
                            ].join(' ')}>
                                {/* preventDefault prevents nagivation to a new page */}
                                <a href="#/" onClick={(e) => {
                                    e.preventDefault();
                                    if (this.state.lockTabs) {
                                        return;
                                    }
                                    /* (Don't do this when disabling) Change current tab to tab that was clicked, fetch corresponding data */
                                    this.setState({
                                        tabIndex: index,
                                    });
                                    this.fetchTab(index);
                                }}>
                                    {/* Renders the tab name */}
                                    {tab.label} &nbsp;

{
(!this.state.lockTabs && this.state.tabIndex == index) ?
<span className="badge">
{this.state.page.meta.itemsFound}
                    </span> :
undefined
}
                                </a>
                            </li>
                        ))
                    }
                    {
                        this.state.lockTabs ?
                        <li className="active">
                            <a href="#/" onClick={(e) => {
                                e.preventDefault();
                            }}>
                                Search Results &nbsp;
                                <span className="badge">
{this.state.page.meta.itemsFound}
                                </span>
                            </a>
                        </li> :
                        undefined
                    }
                </ul>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead style={{backgroundColor: '#064785'}}>
                            <tr>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'CandID',
                                            sortOrder: (
                                                this.state.sortColumn == 'CandID' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        DCCID
                                        {
                                            (this.state.sortColumn == 'CandID') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'PSCID',
                                            sortOrder: (
                                                this.state.sortColumn == 'PSCID' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        PSCID
                                        {
                                            (this.state.sortColumn == 'PSCID') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'Name',
                                            sortOrder: (
                                                this.state.sortColumn == 'Name' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        Site
                                        {
                                            (this.state.sortColumn == 'Name') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'Visit_label',
                                            sortOrder: (
                                                this.state.sortColumn == 'Visit_label' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        Visit Label
                                        {
                                            (this.state.sortColumn == 'Visit_label') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'title',
                                            sortOrder: (
                                                this.state.sortColumn == 'title' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        Subproject
                                        {
                                            (this.state.sortColumn == 'title') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'StartsAt',
                                            sortOrder: (
                                                this.state.sortColumn == 'StartsAt' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        Starts At
                                        {
                                            (this.state.sortColumn == 'StartsAt') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'AppointmentTypeName',
                                            sortOrder: (
                                                this.state.sortColumn == 'AppointmentTypeName' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        Appointment Type
                                        {
                                            (this.state.sortColumn == 'AppointmentTypeName') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    <button className="column-header" onClick={() => {
                                        this.setState({
                                            sortColumn: 'dataEntryStatus',
                                            sortOrder: (
                                                this.state.sortColumn == 'dataEntryStatus' &&
                                                this.state.sortOrder == 'ASC'
                                            ) ?
                                                'DESC' :
                                                'ASC',
                                        });
                                        setTimeout(() => {
                                            this.fetchTab();
                                        }, 1);
                                    }}>
                                        Data Entry Status
                                        {
                                            (this.state.sortColumn == 'dataEntryStatus') ?
                                            <span className={
                                                this.state.sortOrder == 'DESC' ?
                                                'glyphicon glyphicon-triangle-bottom' :
                                                'glyphicon glyphicon-triangle-top'
                                            }/> :
                                            undefined
                                        }
                                    </button>
                                </th>
                                <th>
                                    Edit
                                </th>
                                <th>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.page.data.map((a, index) => {
                                    const site = this.state.sites.find((s) => s.CenterID == a.CenterID);
                                    const appointmentType = this.state.appointmentTypes
                                        .find((at) => at.AppointmentTypeID == a.AppointmentTypeID);

                                    const {
                                        dataEntryStatus,
                                        dataEntryLabelColor,
                                    } = deriveDataEntryStatus(a);

                                    return (
                                        <tr key={a.AppointmentID}>
                                            <td>
                                                {a.CandID}
                                            </td>
                                            <td>
                                                <a href={'/' + a.CandID + '/'}>{a.PSCID}</a>
                                            </td>
                                            <td>
                                                {
                                                    (site == undefined) ?
                                                        'Site #'+a.CenterID :
                                                        site.Name
                                                }
                                            </td>
                                            <td>
                                                <a href={'/instrument_list/?candID=' + a.CandID + '&sessionID=' + a.SessionID}>{a.Visit_label}</a>
                                            </td>
                                            <td>
                                                {a.title}
                                            </td>
                                            <td>
                                                {a.StartsAt}
                                            </td>
                                            <td>
                                                {
                                                    (appointmentType == undefined) ?
                                                        'Appointment Type #'+a.AppointmentTypeID :
                                                        appointmentType.Name
                                                }
                                            </td>
                                            <td>
                                                <span className={'label label-'+dataEntryLabelColor}>{dataEntryStatus}</span>
                                            </td>
                                            <td>
                                                <button className="btn btn-default" onClick={() => {
this.openEditForm(); this.setCurrAppointment(a);
}}>
                                                    <span className='glyphicon glyphicon-edit'/> Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-default" onClick={() => {
                                                swal({
                                                    title: 'Are you sure you want to delete?',
                                                    text: 'Appointments cannot be recovered',
                                                    type: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonClass: 'btn-danger',
                                                    confirmButtonText: 'Yes, delete it!',
                                                    cancelButtonText: 'No, keep appointment!',
                                                    closeOnConfirm: false,
                                                    closeOnCancel: false,
                                                    },
                                                    (isConfirm) => {
                                                    if (isConfirm) {
                                                        fetch(
                                                                '/schedule_module/ajax/delete_appointment.php?AppointmentID='+a.AppointmentID,
                                                                {
                                                                    credentials: 'include',
                                                                    method: 'DELETE',
                                                                }
                                                            ).then(() => {
                                                                const index = this.state.page.data.findIndex((item) => item.AppointmentID == a.AppointmentID);
                                                                if (index < 0) {
                                                                    return;
                                                                }
                                                                const appointments = this.state.page.data.slice();
                                                                appointments.splice(index, 1);
                                                                this.setState({
                                                                    page: Object.assign(
                                                                        {},
                                                                        this.state.page,
                                                                        {
                                                                            data: appointments,
                                                                            meta: Object.assign(
                                                                                {},
                                                                                this.state.page.meta,
                                                                                {
                                                                                    itemsFound: (Number(this.state.page.meta.itemsFound)-1),
                                                                                }
                                                                            ),
                                                                        }
                                                                    ),
                                                                });
                                                        });
                                                        swal.close();
                                                    } else {
                                                        // swal("Canceled", "The appointment has not been deleted", "error");
                                                        swal.close();
                                                    }
                                                    });
                                                }}>
                                                    <span className='glyphicon glyphicon-trash'/> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        Items Per Page: <input className="form-control" type="number" value={this.state.desiredItemsPerPage} onChange={(e) => {
                            this.setState({
                                desiredItemsPerPage: e.target.value,
                            });
                            this.refreshTab();
                        }}/>
                    </div>
                    <div className="form-group col-md-2">
                        Page: <input className="form-control" type="number" value={this.state.desiredPage} onChange={(e) => {
                            this.setState({
                                desiredPage: e.target.value,
                            });
                            this.refreshTab();
                        }}/>
                    </div>
                    <div className="form-group col-md-6">
                        {
                            this.state.page.meta.pagesFound < 0 ?
                            '' :
                            `${this.state.page.meta.pagesFound} page(s) found, `
                        }
                        {
                            this.state.page.meta.itemsFound < 0 ?
                            '' :
                            `${this.state.page.meta.itemsFound} items found`
                        }
                    </div>
                    <button className="btn btn-primary" onClick={this.downloadAsCSV}>
                        Download Table as CSV
                    </button>
                </div>
                {editAppointmentButton}
            </div>
        );
    }
}
