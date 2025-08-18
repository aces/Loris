import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ButtonElement,
  FormElement,
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
   * Render function
   *
   * @return {*}
   */
  render() {
    const {test, options, setTest, add, errors, handleSubmit, t} = this.props;

    const renderHelpText = () => {
      if (add) {
        return (
          <span>
            {t(
              'You cannot add an entry if it has' +
              'a duplicate entry in the test battery.',
              {ns: 'battery_manager'}
            )}<br/>
            {t(
              'If the duplicate entry is inactive,' +
              ' you will be given the option to activate it.',
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
              'You cannot edit an entry to have the ' +
              'same values as another active entry.',
              {ns: 'battery_manager'}
            )}<br/>
            {t(
              'If the duplicate entry is inactive,' +
              ' you will be given the option to activate it.',
              {ns: 'battery_manager'}
            )}
            <br/>
            <br/>
          </span>
        );
      }
    };

    return (
      <FormElement
        name="battery_manager_form"
        onSubmit={handleSubmit}
      >
        <StaticElement
          label={t('Note', {ns: 'battery_manager'})}
          text={renderHelpText()}
        />
        <SelectElement
          name="testName"
          label={t('Instrument', {ns: 'battery_manager'})}
          placeHolder={t('Search for instrument', {ns: 'battery_manager'})}
          options={options.instruments}
          onUserInput={setTest}
          required={true}
          value={test.testName ?? ''}
          errorMessage={errors.testName}
        />
        <NumericElement
          name="ageMinDays"
          label={t('Minimum Age', {ns: 'battery_manager'}) +
          ' (' + t('days', {ns: 'battery_manager'}) + ')'}
          onUserInput={setTest}
          min={0}
          max={99999}
          required={true}
          value={test.ageMinDays != null ? String(test.ageMinDays) : ''}
          errorMessage={errors.ageMinDays}
        />
        <NumericElement
          name="ageMaxDays"
          label={t('Maximum Age', {ns: 'battery_manager'}) +
           ' (' + t('days', {ns: 'battery_manager'}) + ')'}
          onUserInput={setTest}
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
          onUserInput={setTest}
          required={true}
          value={test.stage ?? ''}
          errorMessage={errors.stage}
        />
        <SelectElement
          name="cohort"
          label={t('Cohort', {ns: 'loris'})}
          options={options.cohorts}
          onUserInput={setTest}
          required={false}
          value={test.cohort ?? ''}
        />
        <SelectElement
          name="visitLabel"
          label={t('Visit Label', {ns: 'loris'})}
          options={options.visits}
          onUserInput={setTest}
          required={false}
          value={test.visitLabel ?? ''}
        />
        <SelectElement
          name="centerId"
          label={t('Site', {ns: 'loris'})}
          placeHolder={t('Search for site', {ns: 'battery_manager'})}
          options={options.sites}
          strictSearch={true}
          onUserInput={setTest}
          required={false}
          value={test.centerId ?? ''}
        />
        <SelectElement
          name="firstVisit"
          label={t('First Visit', {ns: 'battery_manager'})}
          options={options.firstVisit}
          onUserInput={setTest}
          required={false}
          value={test.firstVisit ?? ''}
        />
        <NumericElement
          name="instrumentOrder"
          label={t('Instrument Order', {ns: 'battery_manager'})}
          onUserInput={setTest}
          required={false}
          min={0}
          max={127}
          value={test.instrumentOrder != null ?
            String(test.instrumentOrder) : ''}
        />
        <SelectElement
          name="DoubleDataEntryEnabled"
          label={t('Enable Double Data Entry', {ns: 'battery_manager'})}
          options={options.DoubleDataEntryEnabled}
          onUserInput={setTest}
          required={true}
          value={test.DoubleDataEntryEnabled ?? ''}
          emptyOption={false}
        />
        <ButtonElement
          label={t('Submit', {ns: 'battery_manager'})}
        />
      </FormElement>
    );
  }
}

BatteryManagerForm.propTypes = {
  test: PropTypes.object.isRequired,
  setTest: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  add: PropTypes.bool,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default withTranslation(
  ['battery_manager', 'loris'])(BatteryManagerForm);
