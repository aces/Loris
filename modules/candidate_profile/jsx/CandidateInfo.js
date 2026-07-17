import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import 'I18nSetup';

/**
 * CandidateInfo is a React component which is used for the
 * CandidateInfo table providing an overview of the candidate.
 */
class CandidateInfo extends Component {
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
      return this.props.t(
        '{{months}} months old',
        {ns: 'loris', months: months}
      );
    }
    return this.props.t(
      '{{years}} years old',
      {ns: 'loris', years: years}
    );
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
    const dateFormatter = new Intl.DateTimeFormat(
      loris.user.langpref.replace('_', '-'),
      {
        style: 'short',
        timeZone: 'UTC',

      }
    );

    const data = [
      {
        label: this.props.t('PSCID', {ns: 'loris'}),
        value: this.props.Candidate.Meta.PSCID,
      },
      {
        label: this.props.t('DCCID', {ns: 'loris'}),
        value: this.props.Candidate.Meta.CandID,
      },
      {
        label: this.props.t('Date of Birth', {ns: 'loris'}),
        value: dateFormatter.format(new Date(this.props.Candidate.Meta.DoB)),
        valueWhitespace: 'nowrap',
      },
      {
        label: this.props.t('Age', {ns: 'loris'}),
        value: this.calcAge(this.props.Candidate.Meta.DoB),
      },
      {
        label: this.props.t('Sex', {ns: 'loris'}),
        value: this.props.Candidate.Meta.Sex,
      },
      {
        label: this.props.t('Project', {ns: 'loris', count: 1}),
        value: this.props.Candidate.Meta.Project,
      },
      {
        label: this.props.t('Cohort', {ns: 'loris', count: cohorts.length}),
        value: cohorts.join(', '),
      },
      {
        label: this.props.t('Site', {ns: 'loris', count: 1}),
        value: this.props.Candidate.Meta.Site,
      },
      {
        label: this.props.t('Visits', {ns: 'loris'}),
        value: this.getVisitList(this.props.Visits),
        width: '12em',
      },
    ];

    const renderTerm = (label, value, info) => {
      const cardStyle = {
        width: info.width || 'unset',
        padding: '1rem 0',
        marginLeft: '0.5rem',
        marginRight: '0.5rem',
        wordBreak: 'break-word',
        flexGrow: 1,
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

  // Provided by withTranslation HOC
  t: PropTypes.func,
};

export default {
  CandidateInfo: withTranslation(['candidate_profile', 'loris'])(CandidateInfo),
};
