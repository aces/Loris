/* exported RCohortRelations */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';

/**
 * Cohort Relations React Component
 */
class CohortRelations extends Component {
  /**
   * Get the default React properties.
   * Invoked once and cached when the class is created.
   * Values in the mapping will be set if not specified by the parent component.
   *
   * @return {object} props - React Component properties
   */
  getDefaultProps() {
    return {
      Relations: { },
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let cohortIDs = Object.keys(this.props.Relations);
    let that = this;
    let cohortList = cohortIDs.map(function(key) {
      return <li>{that.props.Relations[key]}</li>;
    });

    return (
      <div>
        <h2>{t('Related Cohorts', {ns: 'configuration'})}</h2>
        <ul>
          {cohortList}
        </ul>
      </div>
    );
  }
}

CohortRelations.propTypes = {
  Relations: PropTypes.array,
  t: PropTypes.func.isRequired,
};

let RCohortRelations = React.createFactory(CohortRelations);

window.CohortRelations = CohortRelations;
window.RCohortRelations = RCohortRelations;

export default withTranslation('configuration')(CohortRelations);
