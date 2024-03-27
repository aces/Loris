import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * CandidateInfo is a React component which is used for the
 * CandidateInfo table providing an overview of the candidate.
 */
export class CandidateInfo extends Component {
    /**
     * Construct the object.
     *
     * @param {array} props - The React props
     */
    constructor(props) {
        super(props);

        this.calcAge = this.calcAge.bind(this);
        this.getCohorts = this.getCohorts.bind(this);
        this.getVisitList = this.getVisitList.bind(this);
    }

    /**
     * Calculate the age (as of today) based on the date of birth
     * passed as an argument. If the age is less than or equal to
     * 3 years old, it will return a string describing the age in
     * months. Otherwise, it will return an age in years.
     *
     * @param {string} dob - The date of birth in format YYYY-MM-DD
     * @return {string} - A human readable string of the age.
     */
    calcAge(dob) {
        const dobdate = new Date(dob);
        const now = new Date();
        const years = now.getFullYear()-dobdate.getFullYear();
        const months = years*12 + now.getMonth() - dobdate.getMonth();

        if (months <= 36) {
            return months + ' months old';
        }
        return years + ' years old';
    }

    /**
     * Return a list of the unique cohorts contained in the
     * visits passed.
     *
     * @param {array} visits - An array of visits in the format of
     *                         the LORIS API
     * @return {array} - The unique list of cohorts as a string.
     */
    getCohorts(visits) {
        let mapped = [...new Set(visits.map( (visit) => {
            return visit.Meta.Battery;
        }))];
        return mapped;
    }

    /**
     * Converts the list of visits passed as a parameter to a React element
     * that can be rendered. The React element is a comma separated list
     * of visits, each of which link to the timepoint.
     *
     * The instrument_list is currently used as the 'timepoint' because
     * that's where you end up when going via Access Profile, but eventually
     * it would be a good idea to have a non-modality specific visit dashboard
     * similar to the candidate dashboard.
     *
     * @param {array} visits - List of visits in the format returned by the LORIS API.
     * @return {object} - A React element containing a comma separated list of links.
     */
    getVisitList(visits) {
        let visitlinks = visits.map( (visit) => {
            const sessionID = this.props.VisitMap[visit.Meta.Visit];
            const candID = this.props.Candidate.Meta.CandID;
            return <a
                href={
                    this.props.BaseURL
                    + '/instrument_list/?candID=' + candID
                    + '&sessionID=' + sessionID}
                key={visit.Meta.Visit}
                >{visit.Meta.Visit}</a>;
        });
        return <div>
            {
                // Equivalent of .join(', ') that doesn't convert the React
                // element into the string [object Object].
                // See https://stackoverflow.com/questions/33577448/is-there-a-way-to-do-array-join-in-react
                visitlinks.reduce(
                    (acc, el) => {
                        if (acc === null) {
                            return [el];
                        }
                        return [acc, ', ', el];
                    },
                    null,
                )
            }
            </div>;
    }

    /**
     * Render the React component
     *
     * @return {object} - The rendered react component
     */
    render() {
        const cohorts = this.getCohorts(this.props.Visits);
        const subprojlabel = cohorts.length == 1 ? 'Cohort'
            : 'Cohorts';

        const data = [
            {
                label: 'PSCID',
                value: this.props.Candidate.Meta.PSCID,
            },
            {
                label: 'DCCID',
                value: this.props.Candidate.Meta.CandID,
            },
            {
                label: 'Date of Birth',
                value: this.props.Candidate.Meta.DoB,
                valueWhitespace: 'nowrap',
            },
            {
                label: 'Age',
                value: this.calcAge(this.props.Candidate.Meta.DoB),
            },
            {
                label: 'Sex',
                value: this.props.Candidate.Meta.Sex,
            },
            {
                label: 'Project',
                value: this.props.Candidate.Meta.Project,
            },
            {
                label: subprojlabel,
                value: cohorts.join(', '),
            },
            {
                label: 'Site',
                value: this.props.Candidate.Meta.Site,
            },
            {
                label: 'Visits',
                value: this.getVisitList(this.props.Visits),
                width: '12em',
            },
        ];

        const renderTerm = (label, value, info) => {
            const cardStyle = {
                width: info.width || '6em',
                padding: '1em',
                marginLeft: '1ex',
                marginRight: '1ex',
            };
            let valueStyle = {};
            if (info.valueWhitespace) {
                valueStyle.whiteSpace = info.valueWhitespace;
            }

            return (
                <div style={cardStyle} key={label}>
                    <dt>{label}</dt>
                    <dd style={valueStyle}>{value}</dd>
                </div>
            );
        };
        const cardInfo = data.map(
            (info) => renderTerm(info.label, info.value, info)
        );

        let extrainfo;
        if (this.props.ExtraCandidateInfo.length > 0) {
            // We give extra width for generic terms that we don't
            // know anything about their size, so we err on the
            // side of caution.
            extrainfo = (
                <div>
                    <hr />
                    <dl style={{display: 'flex', flexFlow: 'wrap', margin: 0}}>
                            {this.props.ExtraCandidateInfo.map(
                                (obj) => renderTerm(
                                    obj.term,
                                    obj.value,
                                    {width: '12em'}
                                )
                            )}
                    </dl>
                </div>
            );
        }
        return (
            <div style={{width: '100%'}}>
                <dl style={{display: 'flex', flexFlow: 'wrap', margin: 0}}>
                    {cardInfo}
                </dl>
                {extrainfo}
            </div>
        );
    }
}


CandidateInfo.propTypes = {
  BaseURL: PropTypes.string.isRequired,
  Candidate: PropTypes.object.isRequired,
  Visits: PropTypes.array.isRequired,
  VisitMap: PropTypes.object.isRequired,
  ExtraCandidateInfo: PropTypes.array,
};
