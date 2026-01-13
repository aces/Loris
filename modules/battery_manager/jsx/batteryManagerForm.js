import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StaticElement,
  SelectElement,
  NumericElement,
} from 'jsx/Form';
import {withTranslation} from 'react-i18next';

/**
 * Battery Manager Form
 *
 * Module component rendering Add tab
 *
 * @author Victoria Foing
 */
class BatteryManagerForm extends Component {

  /**
   * Constructor
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      test: props.test || {},
    };

    this.setTest = this.setTest.bind(this);
  }

  /**                                                                           
   * Set the form data based on state values of child elements/components       
   *                                                                            
   * @param {string} name - name of the selected element                        
   * @param {string} value - selected value for corresponding form element      
   */                                                                           
  setTest(name, value) {                                                        
    const test = {...this.state.test};                                          
    // Convert numeric fields to number, keep 0                                 
    if (['ageMinDays', 'ageMaxDays', 'instrumentOrder'].includes(name)) {       
      test[name] = value !== '' ? Number(value) : null;                         
    } else {                                                                    
      test[name] = value;                                                       
    }                                                                           
    this.setState({test});                                                      
  }      

  /**
   * Render function
   *
   * @return {*}
   */
  render() {
    const {test} = this.state;
    const {options, add, errors, t} = this.props;

    // Inform users about duplicate entries
    const renderHelpText = () => {
      if (add) {
        return (
          <span>
            {t(
              'You cannot add an entry if it has a duplicate entry in the ' +
              'test battery.',
              {ns: 'battery_manager'}
            )}<br/>
            {t(
              'If the duplicate entry is inactive, you will be given the ' +
              'option to activate it.',
              {ns: 'battery_manager'}
            )}
          </span>
        );
      } else {
        return (
          <span>
            {t(
              'Editing an entry will alter the current entry.',
              {ns: 'battery_manager'}
            )}<br/>
            {t(
              'You cannot edit an entry to have the same values as another ' +
              'active entry.',
              {ns: 'battery_manager'}
            )}<br/>
            {t(
              'If the duplicate entry is inactive, you will be given the ' +
              'option to activate it.',
              {ns: 'battery_manager'}
            )}
            <br/>
            <br/>
          </span>
        );
      }
    };

    return (
      <>
        <StaticElement
          label={t('Note', {ns: 'loris'})}
          text={renderHelpText()}
        />
        <SelectElement
          name="testName"
          label={t('Instrument', {ns: 'battery_manager'})}
          placeHolder={t('Search for instrument', {ns: 'battery_manager'})}
          options={options.instruments}
          onUserInput={this.setTest}
          required={false}
          value={test.testName}
          errorMessage={errors.testName}
        />
        <NumericElement
          name="ageMinDays"
          label={t('Minimum Age (days)', {ns: 'battery_manager'})}
          onUserInput={this.setTest}
          min={0}
          max={99999}
          required={true}
          value={test.ageMinDays != null ? String(test.ageMinDays) : ''}
          errorMessage={errors.ageMinDays}
        />
        <NumericElement
          name="ageMaxDays"
          label={t('Maximum Age (days)', {ns: 'battery_manager'})}
          onUserInput={this.setTest}
          min={0}
          max={99999}
          required={true}
          value={test.ageMaxDays != null ? String(test.ageMaxDays) : ''}
          errorMessage={errors.ageMaxDays}
        />
        <SelectElement
          name="stage"
          label={t('Stage', {ns: 'battery_manager'})}
          options={options.stages}
          onUserInput={this.setTest}
          required={true}
          value={test.stage}
          errorMessage={errors.stage}
        />
        <SelectElement
          name="cohort"
          label={t('Cohort', {ns: 'loris', count: 1})}
          options={options.cohorts}
          onUserInput={this.setTest}
          required={false}
          value={test.cohort}
        />
        <SelectElement
          name="visitLabel"
          label={t('Visit Label', {ns: 'loris'})}
          options={options.visits}
          onUserInput={this.setTest}
          required={false}
          value={test.visitLabel}
        />
        <SelectElement
          name="centerId"
          label={t('Site', {ns: 'loris', count: 1})}
          placeHolder={t('Search for site', {ns: 'battery_manager'})}
          options={options.sites}
          strictSearch={true}
          onUserInput={this.setTest}
          required={false}
          value={test.centerId}
        />
        <SelectElement
          name="firstVisit"
          label={t('First Visit', {ns: 'battery_manager'})}
          options={{
            'Y': t('Yes', {ns: 'loris'}),
            'N': t('No', {ns: 'loris'}),
          }}
          onUserInput={this.setTest}
          required={false}
          value={test.firstVisit}
        />
        <NumericElement
          name="instrumentOrder"
          label={t('Instrument Order', {ns: 'battery_manager'})}
          onUserInput={this.setTest}
          required={false}
          min={0}
          max={127} // max value allowed by default column type of instr_order
          value={test.instrumentOrder}
        />
        <SelectElement
          name="DoubleDataEntryEnabled"
          label={t('Enable Double Data Entry', {ns: 'battery_manager'})}
          options={{
            'Y': t('Yes', {ns: 'loris'}),
            'N': t('No', {ns: 'loris'}),
          }}
          onUserInput={this.setTest}
          required={true}
          value={test.DoubleDataEntryEnabled}
          errorMessage={errors.DoubleDataEntryEnabled}
          emptyOption={false}
        />
      </>
    );
  }
}

BatteryManagerForm.propTypes = {
  test: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  add: PropTypes.bool,
  errors: PropTypes.object,
  t: PropTypes.func,
};

export default withTranslation(
  ['battery_manager', 'loris'])(BatteryManagerForm);
