import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SelectElement, FormElement, ButtonElement, DateElement} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

/**
 * QueryChartForm - a form used for statistics query to modify graphs/charts.
 *
 * @param  {object} props
 * @return {JSX.Element}
 */
const QueryChartForm = (props) => {
  const [formDataObj, setFormDataObj] = useState({});
  const {t} = useTranslation();
  const [options, setOptions] = useState({
    projects: {},
    cohorts: {},
    sites: {},
    visits: {},
    participantStatus: {},
  });

  // Load options from props.data when rendered
  useEffect(
    () => {
      const json = props.data;
      if (json && Object.keys(json).length !== 0) {
        setOptions({
          projects: json['options']['projects'] || {},
          cohorts: json['options']['cohorts'] || {},
          sites: json['options']['sites'] || {},
          visits: json['options']['visits'] || {},
          participantStatus: json['options']['participantStatus'] || {},
        });
      }
    },
    [props.data]
  );

  /**
   * setFormData - Stores the value of the element in formDataObj state.
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */

  const setFormData = (formElement, value) => {
    let normalizedValue = value;
    if (!formElement.includes('date')) {
      normalizedValue = Array.isArray(value) ? value : [value];
      // Handle clear selection
      if (normalizedValue.includes('__clear__')) {
        normalizedValue = undefined;
      }
    }

    const newFormData = {
      ...formDataObj,
      [formElement]: normalizedValue,
    };
    if (
      (normalizedValue !== undefined
      || formDataObj[formElement] !== undefined)
      && !(formElement.includes('date') && value < '1900-01-01')
    ) {
      props.callback(newFormData);
      setFormDataObj(newFormData);
    }
  };

  const resetFilters = () => {
    setFormDataObj({});
  };

  const clearSelection = t('-- Clear Selection --', {ns: 'statistics'});
  return (
    <FormElement
      Module ={props.Module}
      name ={props.name}
      id ={props.id}
      onSubmit ={() => props.callback(formDataObj)}
      method ='GET'
    >
      <div className ="filter-grid">
        {/* Project Section */}
        {Object.keys(props.data['options']['projects']).length > 0 && (
          <div>
            <label style ={{fontWeight: 'bold',
              marginBottom: '5px', display: 'block'}}>
              {t('Project', {ns: 'loris'})}</label>
            <SelectElement
              name ='selectedProjects'
              options ={{__clear__: clearSelection,
                ...options.projects}}
              multiple ={true}
              emptyOption ={false}
              value ={formDataObj['selectedProjects'] || []}
              onUserInput ={(name, value) => {
                setFormData(name, value);
              }}
              style ={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Cohort Section */}
        {Object.keys(props.data['options']['cohorts']).length > 0 && (
          <div>
            <label style ={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>{t('Cohort', {ns: 'loris', count: 1})}</label>
            <SelectElement
              name ='selectedCohorts'
              options ={{__clear__: clearSelection,
                ...options.cohorts}}
              multiple ={true}
              emptyOption ={false}
              value ={formDataObj['selectedCohorts'] || []}
              onUserInput ={(name, value) => {
                setFormData(name, value);
              }}
              style ={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Site Section */}
        {Object.keys(props.data['options']['sites']).length > 0 && (
          <div>
            <label style ={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>{t('Site', {ns: 'loris'})}</label>
            <SelectElement
              name ='selectedSites'
              options ={{__clear__: clearSelection, ...options.sites}}
              multiple ={true}
              emptyOption ={false}
              value ={formDataObj['selectedSites'] || []}
              onUserInput ={(name, value) => {
                setFormData(name, value);
              }}
              style ={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Visit Section */}
        {Object.keys(props.data['options']['visits']).length > 0 && (
          <div>
            <label style ={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>{t('Visit', {ns: 'loris'})}</label>
            <SelectElement
              name ='selectedVisits'
              options ={{__clear__: clearSelection,
                ...options.visits}}
              multiple ={true}
              emptyOption ={false}
              value ={formDataObj['selectedVisits'] || []}
              onUserInput ={(name, value) => {
                setFormData(name, value);
              }}
              style ={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* Status Section */}
        {Object.keys(props.data['options']['participantStatus']).length > 0
        && (
          <div>
            <label style ={{fontWeight: 'bold',
              marginBottom: '5px',
              display: 'block'}}>
              {t('Participant Status', {ns: 'loris'})}
            </label>
            <SelectElement
              name ='selectedParticipantStatus'
              options ={{__clear__: clearSelection,
                ...options.participantStatus}}
              multiple ={true}
              emptyOption ={false}
              value ={formDataObj['selectedParticipantStatus'] || []}
              onUserInput ={(name, value) => {
                setFormData(name, value);
              }}
              style ={{width: '100%', padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc'}}
            />
          </div>
        )}

        {/* DateRegistered Section */}
        <div>
          <label style ={{fontWeight: 'bold',
            marginBottom: '5px',
            display: 'block'}}>
            {t('Date Registered', {ns: 'statistics'})}</label>
          <DateElement
            name='dateRegisteredStart'
            value={formDataObj['dateRegisteredStart'] || ''}
            onUserInput ={(name, value) => {
              setFormData(name, value);
            }}
            style={{width: '100%', padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc'}}
            label={t('Range Start', {ns: 'statistics'})}
          />
          <DateElement
            name='dateRegisteredEnd'
            value={formDataObj['dateRegisteredEnd'] || ''}
            onUserInput={(name, value) => {
              setFormData(name, value);
            }}
            style={{width: '100%', padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc'}}
            label={t('Range End', {ns: 'statistics'})}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div style ={{display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'}}>
        <ButtonElement
          label={t('Clear Filters', {ns: 'loris'})}
          onUserInput ={resetFilters}
          buttonClass ='btn btn-sm btn-primary'
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
