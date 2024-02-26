import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SelectElement, FormElement, ButtonElement} from 'jsx/Form';


/**
 * QueryChartForm - a form used for statistics query to modify graphs/charts.
 *
 * @param {object} props
 * @return {JSX.Element}
 */
const QueryChartForm = (props) => {
  const [optionsProjects, setOptionsProjects] = useState({});
  const [optionsCohorts, setOptionsCohorts] = useState({});
  const [optionsSites, setOptionsSites] = useState({});
  const [optionsVisits, setOptionsVisits] = useState({});
  const [optionsStatus, setOptionsStatus] = useState({});
  const [formDataObj, setFormDataObj] = useState({});

  /**
   * useEffect - modified to run when props.data updates.
   */
  useEffect(() => {
    const json = props.data;
    if (json && Object.keys(json).length !== 0) {
      let projectOptions = {};
      for (const [key, value] of Object.entries(json['options']['projects'])) {
        projectOptions[key] = value;
      }
      setOptionsProjects(projectOptions);
      let cohortOptions = {};
      for (
        const [key, value] of Object.entries(json['options']['cohorts'])
        ) {
        cohortOptions[key] = value;
      }
      setOptionsCohorts(cohortOptions);
      let siteOptions = {};
      for (const [key, value] of Object.entries(json['options']['sites'])) {
        siteOptions[key] = value;
      }
      setOptionsSites(siteOptions);
      let visitOptions = {};
      for (const [key, value] of Object.entries(json['options']['visits'])) {
        visitOptions[key] = value;
      }
      setOptionsVisits(visitOptions);
      let participantStatusOptions = {};
      for (const [key, value] of Object.entries(
          json['options']['participantStatus']
        )) {
        participantStatusOptions[key] = value;
      }
      setOptionsStatus(participantStatusOptions);
    }
  }, [props.data]);

  /**
   * setFormData - Stores the value of the element in formDataObj state.
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  const setFormData = (formElement, value) => {
    setFormDataObj( (prevState) => ({
      ...prevState,
      [formElement]: value,
    }));
  };

  const resetFilters = () => {
    setFormDataObj({});
  };

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <FormElement
      Module={props.Module}
      name={props.name}
      id={props.id}
      onSubmit={() => props.callback(formDataObj)}
      method='GET'
    >
      {Object.keys(props.data['options']['projects']).length > 0
        ? <>
          <p>Project</p>
          <SelectElement
            name='selectedProjects'
            options={optionsProjects}
            multiple={true}
            emptyOption={false}
            value={formDataObj['selectedProjects']}
            onUserInput={setFormData}
          />
          <br/>
        </> : null}
      {Object.keys(props.data['options']['cohorts']).length > 0
        ? <>
          <p>Cohort</p>
          <SelectElement
            name='selectedCohorts'
            options={optionsCohorts}
            multiple={true}
            emptyOption={false}
            value={formDataObj['selectedCohorts']}
            onUserInput={setFormData}
          />
          <br/>
        </>
        : null}
      {Object.keys(props.data['options']['sites']).length > 0
        ? <>
          <p>Site</p>
          <SelectElement
            name='selectedSites'
            options={optionsSites}
            multiple={true}
            emptyOption={false}
            value={formDataObj['selectedSites']}
            onUserInput={setFormData}
          />
          <br/>
        </>
        : null}
      {Object.keys(props.data['options']['visits']).length > 0
        ? <>
          <p>Visit</p>
          <SelectElement
            name='selectedVisits'
            options={optionsVisits}
            multiple={true}
            emptyOption={false}
            value={formDataObj['selectedVisits']}
            onUserInput={setFormData}
          />
          <br/>
        </>
        : null}
      {Object.keys(props.data['options']['participantStatus']).length > 0
        ? <>
          <p>Status</p>
          <SelectElement
            name='selectedParticipantStatus'
            options={optionsStatus}
            multiple={true}
            emptyOption={false}
            value={formDataObj['selectedParticipantStatus']}
            onUserInput={setFormData}
          />
          <br/>
        </>
        : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <ButtonElement
          label='Submit Query'
          type='submit'
          buttonClass='btn btn-sm btn-primary'
        />
        <ButtonElement
          label='Clear Filters'
          onUserInput={resetFilters}
          buttonClass='btn btn-sm btn-primary'
        />
      </div>
    </FormElement>
  );
};
QueryChartForm.propTypes = {
  data: PropTypes.object,
  callback: PropTypes.func,
  Module: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
};
QueryChartForm.defaultProps = {
  data: {},
};

export {
  QueryChartForm,
};
