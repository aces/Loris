# LORIS REDCap module configuration

The LORIS REDCap module can be configured in the LORIS `config.xml` file.

## Configuration template

The configuration is of the following form:

```xml
<redcap>
  <issue-assignee>REDCap</issue-assignee>
  <instance>
    <redcap-url>https://www.example.net/redcap/</redcap-url>
    <project>
      <redcap-project-id>1</redcap-project-id>
      <redcap-api-token>ABCDEFGGHIJKLMNOPQRSTUVWXYZ</redcap-api-token>
      <redcap-participant-id>record-id</redcap-participant-id>
      <candidate-id>psc-id</candidate-id>
      <visit>
        <visit-label>visit_1</visit-label>
        <redcap-arm-name>arm_1</redcap-arm-name>
        <redcap-event-name>event_1</redcap-event-name>
      </visit>
    </project>
  </instance>
</redcap>
```

## Detailed description

The configuration nodes are the following:
- `redcap` (required): Root node of the LORIS REDCap configuration.
- `issue-assignee` (required): The LORIS user ID of the user to whom to assign issues in case of a REDCap module malfunction.
- `instance` (required, multiple allowed): The list of instance entries to synchronize with LORIS.

In an `instance` entry, the configuration parameters are the following:
- `redcap-url` (required): The URL of the REDCap instance. This is also the URL of the REDCap instance API without the `api` suffix.
- `project` (required, multiple allowed): The list of project entries in this REDCap instance to synchronize with LORIS.

In a `project` entry, the configuration parameters are the following:
- `redcap-project-id` (required): The REDCap project ID of the REDCap project described by this entry.
- `redcap-api-token` (required): The REDCap API token used by LORIS to retrieve REDCap data for this project.
- `redcap-participant-id` (optional): The type of REDCap participant identifier used to map the REDCap participants with the LORIS candidates. The two options are `record-id` and `survey-participant-id`. If not present, `record-id` is used.
- `candidate-id` (optional): The type of LORIS candidate identifier used to map the REDCap participants with the LORIS candidates. The two options are `psc-id` and `dcc-id`. If not present, `psc-id` is used.
- `visit` (optional, multiple allowed): The list of visit entries that describe how REDCap arms and events are mapped to LORIS visits. If not present, the REDCap arms are ignored and the REDCap event names are matched to LORIS visit labels with the same name.

In a `visit` entry, the configuration parameters are the following:
- `visit-label` (required): The LORIS visit label of the visit to which to attach the instrument responses that match this entry.
- `redcap-arm-name` (optional): The REDCap arm name that the instrument responses must match to be attached to this visit. If not present, the arm name is ignored when filtering instrument responses.
- `redcap-event-name` (optional): The REDCap event name that the instrument responses must match to be attached to this visit. If not present, the event name is ignored when filtering instrument responses.

## Check configuraion

The tool `redcap_check_config.php` can be used to check that the module configuration is correct.
