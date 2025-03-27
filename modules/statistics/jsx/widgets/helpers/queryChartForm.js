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
  // const setFormData = (formElement, value) => {
  //   setFormDataObj((prevState) => {
  //     const newFormData = {
  //       ...prevState,
  //       [formElement]: value,
  //     };
  
  //     // Trigger dynamic update
  //     props.callback(newFormData);
  
  //     return newFormData;
  //   });
  // };

  const setFormData = (formElement, value) => {
    // Normalize single selection into array (in case)
    const normalizedValue = Array.isArray(value) ? value : [value];
  
    setFormDataObj((prevState) => {
      const newFormData = {
        ...prevState,
        [formElement]: normalizedValue.length > 0 ? normalizedValue : undefined,
      };
  
      props.callback(newFormData);
      return newFormData;
    });
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
      <div className="filter-grid">
        {/* Project Section */}
        {Object.keys(props.data['options']['projects']).length > 0 && (
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Project</label>
            <SelectElement
              name='selectedProjects'
              options={{ __clear__: '-- Clear Selection --', ...optionsProjects }}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedProjects']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        )}
    
        {/* Cohort Section */}
        {Object.keys(props.data['options']['cohorts']).length > 0 && (
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Cohort</label>
            <SelectElement
              name='selectedCohorts'
              options={{ __clear__: '-- Clear Selection --', ...optionsCohorts }}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedCohorts']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        )}
    
        {/* Site Section */}
        {Object.keys(props.data['options']['sites']).length > 0 && (
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Site</label>
            <SelectElement
              name='selectedSites'
              options={{ __clear__: '-- Clear Selection --', ...optionsSites }}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedSites']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        )}
    
        {/* Visit Section */}
        {Object.keys(props.data['options']['visits']).length > 0 && (
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Visit</label>
            <SelectElement
              name='selectedVisits'
              options={{ __clear__: '-- Clear Selection --', ...optionsVisits }}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedVisits']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        )}
    
        {/* Status Section */}
        {Object.keys(props.data['options']['participantStatus']).length > 0 && (
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Status</label>
            <SelectElement
              name='selectedParticipantStatus'
              options={{ __clear__: '-- Clear Selection --', ...optionsStatus }}
              multiple={true}
              emptyOption={false}
              value={formDataObj['selectedParticipantStatus']}
              onUserInput={(name, value) => {
                if (value.includes('__clear__')) {
                  setFormData(name, []);
                } else {
                  setFormData(name, value);
                }
              }}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        )}
      </div>
      
      {/* Buttons Section */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
