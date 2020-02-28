import React, {Component} from 'react';

/**
 * A VisitInstrumentList is a type of React component which displays
 * a visit. Clicking on the visit expands to display or hide all instruments
 * in that visit and their data entry status.
 *
 * The instruments themselves link to the data entry, and the visit goes
 * to the timepoint_list page.
 */
class VisitInstrumentList extends Component {
    /**
     * Construct the VisitInstrumentList
     *
     * @param {object} props - React props
     */
     constructor(props) {
         super(props);
         this.state = {
             expanded: false,
         };
         this.toggleExpanded = this.toggleExpanded.bind(this);
         this.getInstruments = this.getInstruments.bind(this);
         this.calcAge= this.calcAge.bind(this);
     }

    /**
     * Calculate the age at a visit.
     *
     * @param {string} dob - The date of birth as a string
     * @param {string} visit - The visit date as a string
     *
     * @return {string} - A human readable description of the age
     */
     calcAge(dob, visit) {
        let dobdate = new Date(dob);
        let vdate = new Date(visit);
        let years = vdate.getFullYear()-dobdate.getFullYear();
        let months = years*12 + vdate.getMonth() - dobdate.getMonth();
        if (months <= 36) {
            return months + ' months old';
        }
        return years + ' years old';
    }

    /**
     * Toggle whether instruments are displayed.
     */
    toggleExpanded() {
        // Only get the instruments the first time, otherwise just reuse
        // what the data from state.
        if (!this.state.expanded === true && !this.state.instruments) {
            this.getInstruments();
        }
        this.setState({expanded: !this.state.expanded});
    }

    /**
     * Get a list of instruments and their data entry completion percentage.
     *
     * The list of instruments will be stored in the component's state.
     */
    getInstruments() {
        fetch(this.props.BaseURL + '/instruments/visitsummary?CandID='
            + this.props.Candidate.Meta.CandID
            + '&VisitLabel=' + this.props.Visit.Meta.Visit)
        .then((response) => response.json())
        .then((json) => {
            this.setState({instruments: json});
        });
    }

    /**
     * React lifecycle method. Render the component
     *
     * @return {object} - The rendered JSX
     */
    render() {
        let style = {
            marginBottom: '0.5%',
            marginRight: '0.5%',
            textAlign: 'center',
            boxSizing: 'border-box',
            transition: 'flex 0.3s, width 0.3s ease-out, height 0.3s ease-out',
            width: '98%',
            marginBottom: '1ex',
        };

        let vstatus = 'Not Started';
        let bg = '#ea9999';
        if (this.props.Visit.Stages.Approval) {
            vstatus = 'Approval - ' + this.props.Visit.Stages.Approval.Status;
            bg = '#b6d7a8';
        } else if (this.props.Visit.Stages.Visit) {
            vstatus = 'Visit - ' + this.props.Visit.Stages.Visit.Status;
            bg = '#ffe599';
        } else if (this.props.Visit.Stages.Screening) {
            vstatus = 'Screening - ' + this.props.Visit.Stages.Screening.Status;
            bg = '#f9cb9c';
        }

        let flexcontainer = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: '100%',
            height: '100%',
            alignItems: 'flex-start',
            border: '1px solid #E4EBF2',
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
            alignItems: 'center',
        };
        flexcontainer.justifyContent = 'flex-start';

        let center = {
            display: 'flex',
            width: '12%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        };

        const termstyle = {paddingLeft: '2em', paddingRight: '2em'};

        let instruments = null;
        if (!this.state.instruments) {
            instruments = 'Loading...';
        } else {
            instruments = this.state.instruments.map((instrument) => {
                let conflicterror = null;
                if (instrument.NumOfConflict != 0) {
                    conflicterror = (<a href={
                        this.props.BaseURL
                        + '/conflict_resolver/?candidateID='
                        + this.props.Candidate.Meta.CandID
                        + '&instrument=' + instrument.Test_name
                        + '&visitLabel=' + this.props.Visit.Meta.Visit}>
                        <i style={{color: 'red'}}
                           className="fas fa-exclamation-triangle"></i>
                    </a>);
                }
                return (<tr key={instrument.Test_name}>
                    <td style={{textAlign: 'left'}}>
                        <a href={this.props.BaseURL
                            + '/instruments/' + instrument.Test_name
                            + '?commentID='
                            + instrument.CommentID}>
                            {instrument.Test_name}
                        </a>
                    </td>
                    <td>
                        <progress
                            value={instrument.Completion}
                            max='100'>
                            {instrument.Completion + '%'}
                        </progress>
                    </td>
                    <td>{conflicterror}</td>
                    </tr>);
            });

            instruments = <div>
                <h5>Instruments</h5>
                <table style={{width: '95%'}}>
                    <tr>
                        <th>Instrument</th>
                        <th>Completion</th>
                        <th>Conflicts?</th>
                    </tr>
                    {instruments}
                </table>
                </div>;
        }
        if (!this.state.expanded || vstatus === 'Not Started') {
            instruments = null;
        }

        // We don't show the visit date of age if it's not possible because
        // the visit wasn't started.
        let vdate = null;
        let vage = null;
        if (this.props.Visit.Stages.Visit) {
          vdate = (<div style={termstyle}>
                <dt>Date Of Visit</dt>
                <dd>{this.props.Visit.Stages.Visit.Date}</dd>
            </div>);
          vage = (<div style={termstyle}>
                      <dt>Age</dt>
                      <dd>{this.calcAge(
                              this.props.Candidate.Meta.DoB,
                              this.props.Visit.Stages.Visit.Date
                      )}</dd>
                </div>);
        }
        const defliststyle = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'space-between',
            margin: 0,
            padding: '1ex',
        };

        return (<div style={style} onClick={this.toggleExpanded}>
            <div style={flexcontainer}>
                <div style={{background: bg, width: '1%', height: '100%'}}>
                </div>
                <div style={center}>
                    <h4 style={{width: '100%', padding: 0, margin: 0}}>
                        <a href={this.props.BaseURL
                            + '/instrument_list/?candID='
                            + this.props.Candidate.Meta.CandID
                            + '&sessionID='
                            + this.props.VisitMap[this.props.Visit.Meta.Visit]}>
                            {this.props.Visit.Meta.Visit}
                        </a>
                    </h4>
                </div>
                <div>
                <dl style={defliststyle}>
                    <div style={termstyle}>
                        <dt>Subproject</dt>
                        <dd>{this.props.Visit.Meta.Battery}</dd>
                    </div>
                    <div style={termstyle}>
                        <dt>Site</dt>
                        <dd>{this.props.Visit.Meta.Site}</dd>
                    </div>
                    {vdate}
                    {vage}
                    <div style={termstyle}>
                        <dt>Status</dt>
                        <dd>{vstatus}</dd>
                    </div>
                </dl>
                {instruments}
                </div>
            </div>
            </div>
        );
    }
}

export default VisitInstrumentList;
