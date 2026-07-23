import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Trans,
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import i18n from 'I18nSetup';
import Loader from 'Loader';

import jaStrings from '../locale/ja/LC_MESSAGES/configuration.json';
import zhStrings from '../locale/zh/LC_MESSAGES/configuration.json';

declare const loris: {BaseURL: string};

type Project = {
  Alias: string,
  Name: string,
  cohortIDs: string[],
  id: number | string,
  recruitmentTarget: null | number | string,
};

type ProjectData = {
  cohorts: Record<string, string>,
  projects: Record<string, Project>,
};

type ProjectValues = {
  Alias: string,
  CohortIDs: string[],
  Name: string,
  recruitmentTarget: string,
};

type SaveStatus = {
  message: string,
  type: 'error' | 'success',
} | null;

type SaveResponse = {
  error?: string,
};

declare global {
  interface Window {
    lorisFetch?: typeof fetch,
  }
}

type ProjectManagerProps = {
  data: ProjectData,
  t: WithTranslation['t'],
};

type ProjectFormProps = {
  cohorts: Record<string, string>,
  isNew: boolean,
  onSaved: (projectID: string, values: ProjectValues) => void,
  project: Project,
  projectID: string,
  t: WithTranslation['t'],
};

type FormRowProps = {
  children: React.ReactNode,
  label: string,
  tooltip: string,
};

const EMPTY_PROJECT: Project = {
  Alias: '',
  Name: '',
  cohortIDs: [],
  id: 'new',
  recruitmentTarget: '',
};

/**
 * Convert server data into controlled form values.
 *
 * @param {Project} project Project data
 * @return {ProjectValues}
 */
function formValues(project: Project): ProjectValues {
  return {
    Alias: project.Alias,
    CohortIDs: project.cohortIDs.map(String),
    Name: project.Name,
    recruitmentTarget: project.recruitmentTarget === null
      ? ''
      : String(project.recruitmentTarget),
  };
}

/**
 * Render one labelled project form row.
 *
 * @param {FormRowProps} props Row properties
 * @return {React.ReactElement}
 */
function FormRow(props: FormRowProps): React.ReactElement {
  return (
    <div className="form-group">
      <div
        className="col-sm-12 col-md-3"
        title={props.tooltip}
      >
        <label className="col-sm-12 control-label">{props.label}</label>
      </div>
      <div className="col-sm-12 col-md-9">{props.children}</div>
    </div>
  );
}

/**
 * Create or edit one project through the established guarded endpoint.
 *
 * @param {ProjectFormProps} props Form properties
 * @return {React.ReactElement}
 */
function ProjectForm(props: ProjectFormProps): React.ReactElement {
  const [defaults] = useState(() => formValues(props.project));
  const [values, setValues] = useState<ProjectValues>(defaults);
  const [status, setStatus] = useState<SaveStatus>(null);
  const [saving, setSaving] = useState(false);

  /**
   * Update one controlled field and clear its prior save status.
   *
   * @param {keyof ProjectValues} name Field name
   * @param {string} value Field value
   */
  const updateValue = (
    name: Exclude<keyof ProjectValues, 'CohortIDs'>,
    value: string
  ) => {
    setValues((current) => ({...current, [name]: value}));
    setStatus(null);
  };

  /**
   * Return the first validation error from the legacy form contract.
   */
  const validationError = (): string | null => {
    if (!values.Name) {
      return props.t(
        'Failed to save, must enter a Project Name!',
        {ns: 'configuration'}
      );
    }
    if (!values.Alias) {
      return props.t(
        'Failed to save, must enter an Alias!',
        {ns: 'configuration'}
      );
    }
    if (Number.isNaN(Number(values.recruitmentTarget))) {
      return props.t(
        'Failed to save, recruitment target must be an integer!',
        {ns: 'configuration'}
      );
    }
    if (values.Alias.length > 4) {
      return props.t(
        'Failed to save, Alias should be at most 4 characters long!',
        {ns: 'configuration'}
      );
    }
    return null;
  };

  /**
   * Submit the project values to the existing update endpoint.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Submit event
   */
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validationError();
    if (error !== null) {
      setStatus({message: error, type: 'error'});
      return;
    }

    setSaving(true);
    setStatus(null);
    const body = new URLSearchParams({
      Alias: values.Alias,
      Name: values.Name,
      ProjectID: props.projectID,
      recruitmentTarget: values.recruitmentTarget,
    });
    values.CohortIDs.forEach((cohortID) => {
      body.append('CohortIDs[]', cohortID);
    });

    try {
      const lorisFetch = window.lorisFetch ?? fetch;
      const response = await lorisFetch(
        `${loris.BaseURL}/configuration/ajax/updateProject.php`,
        {
          body,
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          method: 'POST',
        }
      );
      const responseData = await response.json() as SaveResponse;
      if (!response.ok) {
        throw new Error(
          responseData.error
            ?? props.t(
              'Failed to save, same name already exist!',
              {ns: 'configuration'}
            )
        );
      }

      setStatus({
        message: props.t('Successfully saved', {ns: 'configuration'}),
        type: 'success',
      });
      if (props.isNew) {
        window.setTimeout(() => window.location.reload(), 1000);
      } else {
        props.onSaved(props.projectID, values);
      }
    } catch {
      setStatus({
        message: props.t(
          'Failed to save, same name already exist!',
          {ns: 'configuration'}
        ),
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldPrefix = props.isNew
    ? 'new-project'
    : `project-${props.projectID}`;

  return (
    <form
      className="form-horizontal"
      id={`form${fieldPrefix}`}
      method="post"
      onSubmit={submit}
      role="form"
    >
      <fieldset>
        <input
          className="ProjectID"
          name="ProjectID"
          type="hidden"
          value={props.projectID}
        />
        <FormRow
          label={props.t('Project Name', {ns: 'configuration'})}
          tooltip={props.t(
            'Full descriptive title of the project',
            {ns: 'configuration'}
          )}
        >
          <input
            className="form-control projectName"
            id={`${fieldPrefix}-name`}
            name="Name"
            onChange={(event) => updateValue('Name', event.target.value)}
            placeholder={props.isNew
              ? props.t(
                'Please add a project title here',
                {ns: 'configuration'}
              )
              : undefined}
            value={values.Name}
          />
        </FormRow>
        <FormRow
          label={props.t('Alias', {ns: 'configuration'})}
          tooltip={props.t(
            'Short name of the project (4 characters or less)',
            {ns: 'configuration'}
          )}
        >
          <input
            className="form-control projectAlias"
            id={`${fieldPrefix}-alias`}
            name="Alias"
            onChange={(event) => updateValue('Alias', event.target.value)}
            placeholder={props.isNew
              ? props.t('Please add an alias here', {ns: 'configuration'})
              : undefined}
            value={values.Alias}
          />
        </FormRow>
        <FormRow
          label={props.t('Recruitment Target', {ns: 'configuration'})}
          tooltip={props.t(
            'The target number will be used to generate the recruitment '
              + 'progress bar on the dashboard',
            {ns: 'configuration'}
          )}
        >
          <input
            className="form-control projectrecruitmentTarget"
            id={`${fieldPrefix}-recruitment-target`}
            name="recruitmentTarget"
            onChange={(event) => updateValue(
              'recruitmentTarget',
              event.target.value
            )}
            placeholder={props.t(
              'Please add a recruitment target here',
              {ns: 'configuration'}
            )}
            value={values.recruitmentTarget}
          />
        </FormRow>
        <FormRow
          label={props.t('Affiliated Cohorts', {ns: 'configuration'})}
          tooltip={props.t(
            'These cohorts will be automatically displayed for any candidate '
              + 'affiliated with this project at timepoint creation.',
            {ns: 'configuration'}
          )}
        >
          <select
            className="form-control projectCohortIDs"
            id={`${fieldPrefix}-cohorts`}
            multiple={true}
            name="CohortIDs"
            onChange={(event) => {
              const CohortIDs = Array.from(
                event.target.selectedOptions,
                (option) => option.value
              );
              setValues((current) => ({...current, CohortIDs}));
              setStatus(null);
            }}
            value={values.CohortIDs}
          >
            {Object.entries(props.cohorts).map(([cohortID, title]) => (
              <option key={cohortID} value={cohortID}>
                {title}
              </option>
            ))}
          </select>
        </FormRow>
        <div className="form-group">
          <div className="col-sm-offset-3 col-sm-9">
            <button
              className="btn btn-primary saveproject submit-area"
              disabled={saving}
              id={`saveproject${props.projectID}`}
              type="submit"
            >
              {props.t('Save', {ns: 'loris'})}
            </button>{' '}
            <button
              className="btn btn-default submit-area"
              onClick={() => {
                setValues(defaults);
                setStatus(null);
              }}
              type="button"
            >
              {props.t('Reset', {ns: 'loris'})}
            </button>{' '}
            {status && (
              <label
                className={
                  status.type === 'success' ? 'text-success' : 'text-danger'
                }
              >
                {status.message}
              </label>
            )}
          </div>
        </div>
      </fieldset>
    </form>
  );
}

/**
 * React project manager.
 *
 * @param {ProjectManagerProps} props Page properties
 * @return {React.ReactElement}
 */
function ProjectManager(props: ProjectManagerProps): React.ReactElement {
  const [activeID, setActiveID] = useState('new');
  const [projects, setProjects] = useState(props.data.projects);

  /**
   * Keep the current tab and heading in sync after an edit.
   *
   * @param {string} projectID Updated project identifier
   * @param {ProjectValues} values Updated project values
   */
  const updateProject = (projectID: string, values: ProjectValues) => {
    setProjects((current) => ({
      ...current,
      [projectID]: {
        ...current[projectID],
        Alias: values.Alias,
        Name: values.Name,
        cohortIDs: values.CohortIDs,
        recruitmentTarget: values.recruitmentTarget,
      },
    }));
  };

  return (
    <>
      <p>
        {props.t(
          'Use this page to manage the configuration of existing projects, '
            + 'or to add a new one.',
          {ns: 'configuration'}
        )}
      </p>
      <p>
        <Trans
          components={[
            <a
              href={`${loris.BaseURL}/configuration/cohort/`}
              key="cohort-link"
            />,
          ]}
          i18nKey="To configure study cohorts <0>click here</0>."
          ns="configuration"
          t={props.t}
        />
      </p>
      <div className="col-md-3">
        <ul
          className="nav nav-pills nav-stacked"
          data-tabs="tabs"
          role="tablist"
        >
          <li className={activeID === 'new' ? 'active' : undefined}>
            <a
              aria-selected={activeID === 'new'}
              href="#projectnew"
              id="#projectnew"
              onClick={(event) => {
                event.preventDefault();
                setActiveID('new');
              }}
              role="tab"
            >
              {props.t('New ProjectID', {ns: 'configuration'})}
            </a>
          </li>
          {Object.entries(projects).map(([projectID, project]) => (
            <li
              className={activeID === projectID ? 'active' : undefined}
              key={projectID}
            >
              <a
                aria-selected={activeID === projectID}
                href={`#project${projectID}`}
                id={`#project${projectID}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveID(projectID);
                }}
                role="tab"
              >
                {project.Name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-md-7">
        <div className="tab-content">
          {Object.entries(projects).map(([projectID, project]) => (
            <div
              className={
                `tab-pane${activeID === projectID ? ' active' : ''}`
              }
              hidden={activeID !== projectID}
              id={`project${projectID}`}
              key={projectID}
            >
              <h2>{project.Name} (ProjectID: {projectID})</h2>
              <br/>
              <ProjectForm
                cohorts={props.data.cohorts}
                isNew={false}
                onSaved={updateProject}
                project={project}
                projectID={projectID}
                t={props.t}
              />
            </div>
          ))}
          <div
            className={`tab-pane${activeID === 'new' ? ' active' : ''}`}
            hidden={activeID !== 'new'}
            id="projectnew"
          >
            <h2>{props.t('New Project', {ns: 'configuration'})}</h2>
            <br/>
            <ProjectForm
              cohorts={props.data.cohorts}
              isNew={true}
              onSaved={() => undefined}
              project={EMPTY_PROJECT}
              projectID="new"
              t={props.t}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Load project data and render the manager.
 *
 * @param {WithTranslation} props Translation properties
 * @return {React.ReactElement}
 */
function ProjectPage(props: WithTranslation): React.ReactElement {
  const [data, setData] = useState<ProjectData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dataURL = new URL(window.location.href);
    dataURL.searchParams.set('format', 'json');
    const lorisFetch = window.lorisFetch ?? fetch;
    lorisFetch(dataURL.toString(), {credentials: 'same-origin'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((responseData: ProjectData) => setData(responseData))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <h3>
        {props.t('An error occured while loading the page.', {ns: 'loris'})}
      </h3>
    );
  }
  if (data === null) {
    return <Loader/>;
  }
  return <ProjectManager data={data} t={props.t}/>;
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'configuration', jaStrings);
  i18n.addResourceBundle('zh', 'configuration', zhStrings);

  const workspace = document.getElementById('lorisworkspace');
  if (workspace === null) {
    throw new Error('Could not find lorisworkspace root');
  }

  const Page = withTranslation(['configuration', 'loris'])(ProjectPage);
  createRoot(workspace).render(<Page/>);
});

export default withTranslation(['configuration', 'loris'])(ProjectPage);
