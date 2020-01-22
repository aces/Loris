import {Api} from './Api';

export class EditForm extends React.Component {
    constructor(props) {
        super();
        if (props.appointment == undefined) {
            throw new Error(`Expected an appointment object`);
        }
        console.log('ctor', props.appointment);
        const startsAt = props.appointment.StartsAt.split(' ');
        this.state = {
            appointmentTypeId: props.appointment.AppointmentTypeID,
            startDate: startsAt[0],
            startTime: startsAt[1].substr(0, startsAt[1].length-3),
            appointmentTypes: [],
            sessionsOfCandidate: [],
            fetchSessionsOfCandidateError: undefined,
        };
    }

    componentDidMount() {
        Api.getOrFetchAppointmentTypes()
            .then((data) => {
                this.setState({
                    appointmentTypes: data,
                });
            });
        Api.fetchSessionsOfCandidate(this.props.appointment.CandID, this.props.appointment.PSCID)
            .then((result) => {
                if (result.status != 200) {
                    this.setState({
                        fetchSessionsOfCandidateError: (typeof result.json.error == 'string') ?
                            result.json.error :
                            'An unknown error occurred',
                    });
                    return;
                }
                this.setState({
                    sessionsOfCandidate: result.json,
                });
            })
            .catch((err) => {
                this.setState({
                    fetchSessionsOfCandidateError: err.message,
                });
            });
    }

    editAppointment() {
        const body = [
            'AppointmentTypeID=' + encodeURIComponent(this.state.appointmentTypeId),
            'StartsAt=' + encodeURIComponent(this.state.startDate + ' ' + this.state.startTime + ':00'),
        ].join('&');
        fetch(
            '/schedule_module/ajax/edit_appointment.php?AppointmentID='+this.props.appointment.AppointmentID,
            {
                credentials: 'include',
                method: 'PUT',
                body: body,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
        ).then((res) => {
            if (res.status == 304) {
                throw new Error('No changes were made');
            } else {
                return res.json()
                    .then((data) => {
                        return {
                            status: res.status,
                            data: data,
                        };
                    });
            }
        }).then((result) => {
            if (result.status == 200) {
                if (this.props.onEdit != undefined) {
                    this.props.onEdit(result.data);
                }
            } else {
                throw new Error(result.data.error);
            }
        }).catch((err) => {
            if (this.props.onError != undefined) {
                this.props.onError(err);
            }
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label> DCCID: </label>
                            <br/>
                            <input className="form-control" value={this.props.appointment.CandID} disabled/>
                        </div>
                        <div className="form-group">
                            <label> PSCID: </label>
                            <br/>
                            <input className="form-control" value={this.props.appointment.PSCID} disabled/>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label> Appointment Date: </label>
                            <br/>
                            <input className="form-control" type="date" value={this.state.startDate} onChange={(e) => {
                                this.setState({
                                    startDate: e.target.value,
                                });
                            }}/>
                        </div>
                        <div className="form-group">
                            <label> Appointment Time: </label>
                            <br/>
                            <input className="form-control" type="time" value={this.state.startTime} onChange={(e) => {
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
                            <select className="form-control" value={this.props.appointment.SessionID} disabled>
                                {
                                    this.state.sessionsOfCandidate.map((s) => {
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
                            <select className="form-control" value={this.state.appointmentTypeId} onChange={(e) => {
                                this.setState({
                                    appointmentTypeId: e.target.value,
                                });
                            }}>
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
                        this.editAppointment();
                    }}>
                        Save
                    </button>
                    &nbsp;
                    <button className="btn btn-default" onClick={() => {
                        if (this.props.onCancel != undefined) {
                            this.props.onCancel();
                        }
                    }}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}
