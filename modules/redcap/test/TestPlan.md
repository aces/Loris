# REDCap Module - Test Plan


## Introduction

### Pre-requisite

Before testing any data import, considering one REDCap instance, make sure to:

1. Have a LORIS instrument that is also defined in the REDCap instance.
2. Have a candidate (PSCID or DCCID) also defined in the same REDCap instance.
3. Have populated all required tables visit, cohort, test_names, test_battery,
and relational tables.
4. Have the visit started and the timepoint populated on the front-end.

### Faking Data Entry Trigger notification

Testing the notification process can be done from a REDCap instance i.e. saving
an instrument form in REDCap, but also directly from LORIS using the LORIS API
endpoint. It is still requiring the REDCap instance API access.

You do not need to test the Data Entry Trigger (DET) itself, meaning you do not
need to go the the REDCap front-end and change the DET option to target the test
LORIS instance. The data import can be triggered by faking the DET notification.
An HTTP query manager such as Postman or Insomnia, or even cURL can be used.

Send an HTTP POST request to `/redcap/notifications` with this payload:

```json
// change "${instrument_backend_name}" by the value of "instrument_backend_name"
{
    "instrument":"instrument_backend_name",
    "project_id":"REDCap project ID",
    "project_url":"REDCap project URL",
    "record":"REDCap record ID / PSCID",
    "redcap_event_name":"REDCap event name",
    "redcap_url":"REDCap instance URL",
    "username":"REDCap username",
    "${instrument_backend_name}_complete":"2" // 2 = instrument complete
}
```

## REDCap notification endpoint

Each of the test here requires a query to trigger the process.

### Configuration process

> Check the `CONFIGURATION.md` file for the expected configuration structure.

1. Check each tag of the configuration structure by removing/altering it.
2. Check that `visit` is optional.
3. Check that only instruments mentioned in the `redcap_importable_instrument`
from configuration module can be imported, else creating an `unauthorized instrument`
error.


### DET parsing process

#### Single REDCap instance

Targeting a single REDCap instance:

1. [structure] Check that all properties of the DET notifiction structure are required.
2. [structure] Check that `${instrument_backend_name}` and `instrument_backend_name` value must match.
3. [ignored_notifications]:
    - [structure] Check that `${instrument_backend_name}_complete` codes that are not `2` are ignored, and trigger a log starting with `[redcap][notification:skip] instrument not complete`.
    - [structure] Check that `${instrument_backend_name}` not included in the configuration `redcap_importable_instrument` are not imported, and trigger a log starting with `[redcap][notification:skip] unauthorized instrument`.
4. [client] Check that any or both of `redcap_url` and `project_id` not filled out in a `config.xml > redcap` instance are not creating a REDCap client, nor importing data.
5. [client] Check that unmatching `redcap_url` and `project_id` in config vs. DET notification are not creating a REDCap client, nor importing data.
6. [notification] Check that any new notification (i.e. that is not ignored) is registered in the `redcap_notification` table in database.
6. [import] Check that instrument with a `Data Entry = "In Progress"` can import data.
7. [import] Check that an instrument with a `Data Entry = "Complete"` cannot have its data overwritten, and triggers an error.
8. [import] Check that the process ends with instrument metadata being `Data Entry = "Complete"`, `Administration = "All"` and `Validity = "Valid"`.
9. [import] Check that the process ends with instrument data having the `REDCap` examiner.
10. [issue] Check that issues are created in the issue tracker when error are encounter (several points of failure, see `notifications.class.inc`). `500 - internal server error` should be returned in these cases. Logs should also contain the payload starting with `[redcap][issue:created][id:` and the issue tracker's issue ID.


#### Multiple REDCap instances

Targeting multiple REDCap instances and projects: ideally at least 2 REDCap instances with 2 projects each. The process will be the same as single REDCap instance, except we also want to check the cross-import configuration.

1. [structure] Check that data import expects a correctly defined couple of REDCap instance URL and project ID/token to fetch the data. Make the right definition in the `config.xml` file, then try sending a notification with: wrong instance URL and wrong project ID.

> NOTE: even very unlikely, there is a limit/gap in the process where if a tuple composed by the same (`instrument name`, `visit label` and `candidate ID`) in 2 different REDCap instance/projects, the first one to be imported will lock the data LORIS-side.


## REDCap tools

### Tool `redcap2linst`

For this tool, there are 2 modes/input-types: `api` or `file`:
    - `input-type=api` connects to the REDCap API to get the data dictionary, then parses it.
    - `input-type=file` uses a data dictionary file extracted from a REDCap instance, then parse it.

1. [output_directory] check that the `--output-dir` is mandatory.
2. [api] using the `--input-type=api` mode:
    - check that both `-r/--redcap-instance=INSTANCE_NAME` and `-p/--redcap-project=PROJECT_ID` are mandatory.
    - check that both `-r/--redcap-instance=INSTANCE_NAME` and `-p/--redcap-project=PROJECT_ID` must be defined in `config.xml` file.
3. [file] using the `--input-type=api` mode:
    - check that the file is correctly parsed.
    - if `-r/--redcap-instance=INSTANCE_NAME` and `-p/--redcap-project=PROJECT_ID` mentioned, check the name/title of the instrument is also generated in the LINST file.
4. [trim_form_name] check that the instrument name does not appear as a prfix of each field name when `-t/--trim-formname` option is used.
