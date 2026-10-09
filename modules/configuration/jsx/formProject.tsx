import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Trans,
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import {Errors} from 'jslib';
import i18n from 'I18nSetup';
import Loader from 'Loader';
import {TabPane, VerticalTabs} from 'Tabs';
import {
  FormElement,
  TextboxElement,
  SelectElement,
  ButtonElement,
} from 'jsx/Form';
import StudyEntitiesClient from './StudyEntitiesClient';

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
 * Create or edit one project through the established guarded endpoint.
 *
 * @param {ProjectFormProps} props Form properties
 * @return {React.ReactElement}
 */
function ProjectForm(props: ProjectFormProps): React.ReactElement {
  const [defaults, setDefaults] = useState(() => formValues(props.project));
  const [values, setValues] = useState<ProjectValues>(defaults);
  const [status, setStatus] = useState<SaveStatus>(null);
  const [saving, setSaving] = useState(false);

  /**
   * Update one controlled field and clear its prior save status.
   *
   * @param {string} name Field name
   * @param {string|string[]} value Field value
   */
  const updateValue = (
    name: string,
    value: string | string[]
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
   * @param {React.SyntheticEvent} event Submit event
   */
  const submit = async (event: React.SyntheticEvent) => {
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
      await new StudyEntitiesClient('configuration').save(
        `${loris.BaseURL}/configuration/ajax/updateProject.php`,
        body
      );

      setDefaults(values);
      setStatus({
        message: props.t('Successfully saved', {ns: 'configuration'}),
        type: 'success',
      });
      if (props.isNew) {
        window.setTimeout(() => window.location.reload(), 1000);
      } else {
        props.onSaved(props.projectID, values);
      }
    } catch (error) {
      const conflict = error instanceof Errors.ApiResponse
        && error.response?.status === 409;
      setStatus({
        message: error instanceof Error && !conflict
          ? error.message
          : props.t(
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
    <FormElement name={fieldPrefix} id={`form${fieldPrefix}`} onSubmit={submit}>
      <fieldset>
        <input
          className="ProjectID"
          name="ProjectID"
          type="hidden"
          value={props.projectID}
        />
        <div title={props.t(
          'Full descriptive title of the project',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Project Name', {ns: 'configuration'})}
            id={`${fieldPrefix}-name`}
            name="Name"
            onUserInput={updateValue}
            placeholder={props.isNew
              ? props.t(
                'Please add a project title here',
                {ns: 'configuration'}
              )
              : undefined}
            value={values.Name}
          />
        </div>
        <div title={props.t(
          'Short name of the project (4 characters or less)',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Alias', {ns: 'configuration'})}
            id={`${fieldPrefix}-alias`}
            name="Alias"
            onUserInput={updateValue}
            placeholder={props.isNew
              ? props.t('Please add an alias here', {ns: 'configuration'})
              : undefined}
            value={values.Alias}
          />
        </div>
        <div title={props.t(
          'The target number will be used to generate the recruitment '
            + 'progress bar on the dashboard',
          {ns: 'configuration'}
        )}>
          <TextboxElement
            label={props.t('Recruitment Target', {ns: 'configuration'})}
            id={`${fieldPrefix}-recruitment-target`}
            name="recruitmentTarget"
            onUserInput={updateValue}
            placeholder={props.t(
              'Please add a recruitment target here',
              {ns: 'configuration'}
            )}
            value={values.recruitmentTarget}
          />
        </div>
        <div title={props.t(
          'These cohorts will be automatically displayed for any candidate '
            + 'affiliated with this project at timepoint creation.',
          {ns: 'configuration'}
        )}>
          <SelectElement
            label={props.t('Affiliated Cohorts', {ns: 'configuration'})}
            id={`${fieldPrefix}-cohorts`}
            multiple={true}
            name="CohortIDs"
            onUserInput={updateValue}
            value={values.CohortIDs}
            options={props.cohorts}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
          />
        </div>
        <ButtonElement
          label={props.t('Save', {ns: 'loris'})}
          disabled={saving}
          id={`saveproject${props.projectID}`}
          type="submit"
          onUserInput={submit}
        />
        <ButtonElement
          label={props.t('Reset', {ns: 'loris'})}
          buttonClass="btn btn-default"
          onUserInput={() => {
            setValues(defaults);
            setStatus(null);
          }}
          type="button"
        />
        {status && (
          <div className="col-sm-offset-3 col-sm-9">
            <label
              className={
                status.type === 'success' ? 'text-success' : 'text-danger'
              }
            >
              {status.message}
            </label>
          </div>
        )}
      </fieldset>
    </FormElement>
  );
}

/**
 * React project manager.
 *
 * @param {ProjectManagerProps} props Page properties
 * @return {React.ReactElement}
 */
function ProjectManager(props: ProjectManagerProps): React.ReactElement {
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
      <VerticalTabs
        tabs={[
          {
            id: 'projectnew',
            label: props.t('New ProjectID', {ns: 'configuration'}),
          },
          ...Object.entries(projects).map(([projectID, project]) => ({
            id: `project${projectID}`,
            label: project.Name,
          })),
        ]}
        defaultTab="projectnew"
        updateURL={false}
      >
        {Object.entries(projects).map(([projectID, project]) => (
          <TabPane TabId={`project${projectID}`} key={projectID}>
            <h2>{project.Name} (ProjectID: {projectID})</h2>
            <br/>
            <ProjectForm
              cohorts={props.data.cohorts}
              project={project}
              projectID={projectID}
              isNew={false}
              onSaved={updateProject}
              t={props.t}
            />
          </TabPane>
        ))}
        <TabPane TabId="projectnew">
          <h2>{props.t('New Project', {ns: 'configuration'})}</h2>
          <br/>
          <ProjectForm
            cohorts={props.data.cohorts}
            project={EMPTY_PROJECT}
            projectID="new"
            isNew={true}
            onSaved={() => undefined}
            t={props.t}
          />
        </TabPane>
      </VerticalTabs>
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
    new StudyEntitiesClient<ProjectData>('configuration')
      .getById(dataURL.toString())
      .then((responseData: ProjectData) => setData(responseData))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <h3>
        {props.t('An error occurred while loading the page.', {ns: 'loris'})}
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
