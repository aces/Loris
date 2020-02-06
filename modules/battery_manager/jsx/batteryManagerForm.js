import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Battery Manager Form
 *
 * Module component rendering Add tab
 *
 * @author Victoria Foing
 *
 */
class BatteryManagerForm extends Component {
  /**
   * Render function
   *
   * @return {*}
   */
  render() {
    const {test, options, setTest, add, errors} = this.props;

    // Inform users about duplicate entries
    const renderHelpText = () => {
      if (add) {
        return (
          <span>
            You cannot add an entry if it has a duplicate entry in the test
            battery.<br/>
            If the duplicate entry is inactive, you will be given the option
            to activate it.
          </span>
        );
      } else {
        return (
          <span>
             Editing an entry will deactivate the current entry and create a
             new entry.<br/>
             You cannot edit an entry to have the same values as another active
             entry.<br/>
             If the duplicate entry is inactive, you will be given the option
             to active it.
             <br/>
            <br/>
          </span>
        );
      }
    };

    return (
      <FormElement>
        <StaticElement
          label="Note"
          text={renderHelpText()}
        />
        <SelectElement
          name="testName"
          label="Instrument"
          placeHolder="Search for instrument"
          options={options.instruments}
          onUserInput={setTest}
          required={true}
          value={test.testName}
          errorMessage={errors.testName}
          hasError={errors.testName}
        />
        <NumericElement
          name="ageMinDays"
          label="Minimum age (days)"
          onUserInput={setTest}
          min="0"
          max="99999"
          required={true}
          value={test.ageMinDays}
          errorMessage={errors.ageMinDays}
          hasError={errors.ageMinDays}
        />
        <NumericElement
          name="ageMaxDays"
          label="Maximum age (days)"
          onUserInput={setTest}
          min="0"
          max="99999"
          required={true}
          value={test.ageMaxDays}
          errorMessage={errors.ageMaxDays}
          hasError={errors.ageMaxDays}
        />
        <SelectElement
          name="stage"
          label="Stage"
          options={options.stages}
          onUserInput={setTest}
          required={true}
          value={test.stage}
          errorMessage={errors.stage}
          hasError={errors.stage}
        />
        <SelectElement
          name="subproject"
          label="Subproject"
          options={options.subprojects}
          onUserInput={setTest}
          required={false}
          value={test.subproject}
        />
        <SelectElement
          name="visitLabel"
          label="Visit Label"
          options={options.visits}
          onUserInput={setTest}
          required={false}
          value={test.visitLabel}
        />
        <SelectElement
          name="centerId"
          label="Site"
          placeHolder="Search for site"
          options={options.sites}
          strictSearch={true}
          onUserInput={setTest}
          required={false}
          value={test.centerId}
        />
        <SelectElement
          name="firstVisit"
          label="First Visit"
          options={options.firstVisits}
          onUserInput={setTest}
          required={false}
          value={test.firstVisit}
        />
        <NumericElement
          name="instrumentOrder"
          label="Instrument Order"
          onUserInput={setTest}
          required={false}
          min="0"
          max="127" // max value allowed by default column type of instr_order
          value={test.instrumentOrder}
        />
      </FormElement>
    );
  }
}

BatteryManagerForm.propTypes = {
  test: PropTypes.object.isRequired,
  setTest: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};

export default BatteryManagerForm;
