# LORIS REDCap module configuration

The LORIS REDCap module can be configured in the LORIS `config.xml` file.

## Configuration template

The configuration is of the following form:

```xml
<redcap>
  <instance>
    <redcap-url>https://www.example.net/redcap/</redcap-url>
    <project>
      <redcap-project-id>123</redcap-project-id>
      <redcap-api-token>ABCDEFGGHIJKLMNOPQRSTUVWXYZ</redcap-api-token>
      <prefix-instrument-variable>false</prefix-instrument-variable>
      <redcap-participant-id>record_id</redcap-participant-id>
      <candidate-id>pscid</candidate-id>
      <visit>
        <visit-label>visit_1</visit-label>
        <redcap-arm-name>arm_1</redcap-arm-name>
        <redcap-event-name>event_1</redcap-event-name>
        <create-session>
          <site-name>My Site</site-name>
          <project-name>My Project</project-name>
          <cohort-name>My Cohort</cohort-name>
        </create-session>
      </visit>
    </project>
  </instance>
</redcap>
```

## Detailed description

### General configuration

The configuration nodes are the following:
- `redcap` (required): Root node of the LORIS REDCap configuration.
- `instance` (required, multiple allowed): The list of instance entries to synchronize with LORIS.

In an `instance` entry, the configuration parameters are the following:
- `redcap-url` (required): The URL of the REDCap instance. This is also the URL of the REDCap instance API without the `api` suffix.
- `project` (required, multiple allowed): The list of project entries in this REDCap instance to synchronize with LORIS.

### Project configuration

In a `project` entry, the configuration parameters are the following:
- `redcap-project-id` (required): The REDCap project ID of the REDCap project described by this entry.
- `redcap-api-token` (required): The REDCap API token used by LORIS to retrieve REDCap data for this project.
- `prefix-instrument-variable` (optional): Whether or not the instrument field variable names are prefixed by their instrument name in REDCap. The two options are `true` or `false`. If not present, `false` is used.
- `redcap-participant-id` (optional): The type of REDCap participant identifier used to map the REDCap participants with the LORIS candidates. The two options are `record_id` and `survey_participant_id`. If not present, `record_id` is used.
- `candidate-id` (optional): The type of LORIS candidate identifier used to map the REDCap participants with the LORIS candidates. The three options are `pscid`, `candid`, and `external_id`. If not present, `pscid` is used.
- `visit` (optional, multiple allowed): A list of visit mappings that describe how REDCap arms and events are mapped to LORIS visits. If not present, the REDCap arms are ignored and the REDCap event names are matched to LORIS visit labels with the same name.

### Visit mapping configuration

In a `visit` entry, the configuration parameters are the following:
- `visit-label` (required): The LORIS visit label of the visit to which to attach the instrument responses that match this entry.
- `redcap-arm-name` (optional): The REDCap arm name that the instrument responses must match to be attached to this visit. If not present, the arm name is ignored when filtering instrument responses.
- `redcap-event-name` (optional): The REDCap event name that the instrument responses must match to be attached to this visit. If not present, the event name is ignored when filtering instrument responses.
- `create-session` (optional): The information needed to create the LORIS session for the candidate and visit associated with a REDCap event if it does not already exist.

###  Session creation configuration

In a `create-session` entry, the configuration parameters are the following:
- `site-name`: The name of the LORIS site for which to create the session if it does not already exist.
- `project-name`: The name of the LORIS project for which to create the session visit if it does not already exist.
- `cohort-name`: The name of the LORIS cohort for which to create the session visit if it does not already exist.
