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

Testing the notification process can be done from a REDCap instance but also
directly from LORIS. It is still requiring the REDCap instance API access.

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

1. [structure] Check that all properties of the DET notifiction structure are required.
2. [structure] Check that `${instrument_backend_name}__complete` codes that are not `2` are ignored.
3. [structure] Check that `${instrument_backend_name}` and `instrument_backend_name` value must match.
4. [client] Check that any or both of `redcap_url` and `project_id` not filled out in a `config.xml >  redcap` instance are not creating a REDCap client.
5. [client] Check that unmatching `redcap_url` and `project_id` in config vs. DET notification are not creating a REDCap client.
6. [notification] Check that any new notification is registered in the `redcap_notification` table in database.
6. [import] Check that instrument with a `Data Entry = "In Progress"` can import data.
7. [import] Check that an instrument with a `Data Entry = "Complete"` cannot have its data overwritten, and triggers an error.
8. [import] Check that the process ends with instrument metadata being `Data Entry = "Complete"`, `Administration = "All"` and `Validity = "Valid"`.
9. [import] Check that the process ends with instrument data having the `REDCap` examiner.
10. [issue] Check that issues are created in the issue tracker when error are encounter (can happen at some points, see code).

#### Multiple REDCap instances

TBD

## REDCap tools

TBD