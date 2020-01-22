import Panel from 'Panel';
import {Api} from './Api';

export class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: [],
            visitLabels: [],
            projects: [],
            subprojects: [],
            appointmentTypes: [],

            candId: '',
            pscId: '',
            centerId: '',
            visitLabel: '',
            projectId: '',
            /** @type {string[]} */
            subprojectId: [],
            appointmentTypeId: '',

            startDate: '',
            startTime: '',

            startDateMin: '',
            startDateMax: '',
        };
    }
    componentDidMount() {
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
        Api.getOrFetchProjects()
            .then((data) => {
                this.setState({
                    projects: data,
                });
            });
        Api.getOrFetchSubprojects()
            .then((data) => {
                this.setState({
                    subprojects: data,
                });
            });
        Api.getOrFetchAppointmentTypes()
            .then((data) => {
                this.setState({
                    appointmentTypes: data,
                });
            });
    }
    render() {
        return (
            <Panel
                id={this.props.id}
                height={this.props.height}
                title={this.props.title}
            >
                <div className="panel-body">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="form-group">
                                    <label>DCCID</label>
                                    <input type="text" value={this.state.candId} name="dccId" className="form-control" onChange={(e) => {
                                        this.setState({
                                            candId: e.target.value,
                                        });
                                    }}/>
                                </div>
                                <div className="form-group">
                                    <label>Site</label>
                                    <select className="form-control" value={this.state.centerId} onChange={(e) => {
                                        this.setState({
                                            centerId: e.target.value,
                                        });
                                    }}>
                                        <option value="">-Select a Site-</option>
                                        {
                                            this.state.sites.map((s) => {
                                                return <option key={s.CenterID} value={s.CenterID}>{s.Name}</option>;
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Project</label>
                                    <select className="form-control" multiple value={this.state.projectId} onChange={(e) => {
                                        this.setState({
                                            projectId: [...e.target.options]
                                            .filter((o) => o.selected)
                                            .map((o) => o.value),
                                        });
                                    }}>
                                        {
                                            this.state.projects.map((s) => {
                                                return <option key={s.ProjectID} value={s.ProjectID}>{s.Name}</option>;
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Appointment Type</label>
                                    <select className="form-control" value={this.state.appointmentTypeId} onChange={(e) => {
                                        this.setState({
                                            appointmentTypeId: e.target.value,
                                        });
                                    }}>
                                        <option value="">-Select an Appointment Type-</option>
                                        {
                                            this.state.appointmentTypes.map((s) => {
                                                return <option key={s.AppointmentTypeID} value={s.AppointmentTypeID}>{s.Name}</option>;
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="form-group">
                                    <label>PSCID</label>
                                    <input type="text" value={this.state.pscId} name="pscId" className="form-control" onChange={(e) => {
                                        this.setState({
                                            pscId: e.target.value,
                                        });
                                    }}/>
                                </div>
                                <div className="form-group">
                                    <label>Visit Label</label>
                                    <select className="form-control" value={this.state.visitLabel} onChange={(e) => {
                                        this.setState({
                                            visitLabel: e.target.value,
                                        });
                                    }}>
                                        <option value="">-Select a Visit Label-</option>
                                        {
                                            this.state.visitLabels.map((s) => {
                                                return <option key={s.Visit_label} value={s.Visit_label}>{s.Visit_label}</option>;
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Subproject</label>
                                    <select className="form-control" multiple value={this.state.subprojectId} onChange={(e) => {
                                        this.setState({
                                            subprojectId: [...e.target.options]
                                                .filter((o) => o.selected)
                                                .map((o) => o.value),
                                        });
                                    }}>
                                        {
                                            this.state.subprojects.map((s) => {
                                                return <option key={s.SubprojectID} value={s.SubprojectID}>{s.title}</option>;
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={this.state.startDate} className="form-control" onChange={(e) => {
                                        this.setState({
                                            startDate: e.target.value,
                                        });
                                    }}/>
                                </div>
                                <div className="form-group">
                                    <label>Earliest Date</label>
                                    <input type="date" value={this.state.startDateMin} className="form-control" onChange={(e) => {
                                        this.setState({
                                            startDateMin: e.target.value,
                                        });
                                    }}/>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="time" value={this.state.startTime} className="form-control" onChange={(e) => {
                                        console.log(e.target.value);
                                        this.setState({
                                            startTime: e.target.value,
                                        });
                                    }}/>
                                </div>
                                <div className="form-group">
                                    <label>Latest Date</label>
                                    <input type="date" value={this.state.startDateMax} className="form-control" onChange={(e) => {
                                        this.setState({
                                            startDateMax: e.target.value,
                                        });
                                    }}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={() => {
                                if (this.props.onApply != undefined) {
                                    const filters = {};
                                    if (this.state.candId != '') {
                                        filters.CandID = this.state.candId;
                                    }
                                    if (this.state.pscId != '') {
                                        filters.PSCID = this.state.pscId;
                                    }
                                    if (this.state.centerId != '') {
                                        filters.CenterID = this.state.centerId;
                                    }
                                    if (this.state.visitLabel != '') {
                                        filters.VisitLabel = this.state.visitLabel;
                                    }
                                    if (this.state.projectId != '') {
                                        filters.ProjectID = this.state.projectId;
                                    }
                                    if (this.state.subprojectId != '') {
                                        filters.SubprojectID = this.state.subprojectId;
                                    }
                                    if (this.state.appointmentTypeId != '') {
                                        filters.AppointmentTypeID = this.state.appointmentTypeId;
                                    }
                                    if (this.state.startDate != '') {
                                        filters.StartDate = this.state.startDate;
                                    }
                                    if (this.state.startTime != '') {
                                        filters.StartTime = this.state.startTime;
                                    }
                                    if (this.state.startDateMin != '') {
                                        filters.StartDateMin = this.state.startDateMin;
                                    }
                                    if (this.state.startDateMax != '') {
                                        filters.StartDateMax = this.state.startDateMax;
                                    }
                                    this.props.onApply(filters);
                                }
                            }}>Apply</button>
                            &nbsp;
                            <button className="btn btn-default" onClick={() => {
                                this.setState({
                                    candId: '',
                                    pscId: '',
                                    centerId: '',
                                    visitLabel: '',
                                    projectId: '',
                                    subprojectId: '',
                                    appointmentTypeId: '',

                                    startDate: '',
                                    startTime: '',

                                    startDateMin: '',
                                    startDateMax: '',
                                });
                                if (this.props.onClear != undefined) {
                                    this.props.onClear();
                                }
                            }}>Clear</button>
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
}

FilterForm.defaultProps = {
  id: 'selection-filter',
  height: '100%',
  title: 'Selection Filter',
  onUpdate: function() {
    console.warn('onUpdate() callback is not set!');
  },
};
