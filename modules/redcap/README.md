# REDCap

## Purpose

The REDCap module aims to a open interoperability between LORIS and REDCap platforms, by allowing data import from REDCap instances and projects.
The REDCap module opens a new endpoint at `${base_url}/redcap/notifications`. This endpoint expects REDCap notifications with the `Data Entry Trigger (DET)` REDCap module format.
REDCap DET must be configured on any REDCap project to automatically import data from REDCap into LORIS.
To import instrument data from REDCap, LORIS instrument field names (i.e. linked to the dictionary) must match those from REDCap.
To create instrument from a REDCap data dicitonary, the `redcap2linst` tool should be used to automatically generate LORIS LINST instruments matching the REDCap description.

## Permissions

No LORIS permission. This is a public endpoint.
However, **REDCap tokens** need to be generated to use REDCap API.
Each REDCap server and project needs to generated a different access token per user.

## Process

With REDCap DET active in a project, every time a REDCap instrument is updated/saved, a DET notification is sent to LORIS.
The notification is registered, parsed and checked. Then, a REDCap export data API call is made to import data into LORIS.

## DET Data Format

The expected input format is the following:

```json
{
    "instrument":"instrument_backend_name",
    "project_id":"redcap_project_id",
    "project_url":"redcap_project_url",
    "record":"redcap_record_id",
    "redcap_event_name":"redcap_event_name",
    "redcap_url":"redcap_instance_url",
    "username":"redcap_username",
    "${instrument_backend_name}_complete":"2" // can be 0, 1, or 2
}
```

List of properies:
- `instrument`: LORIS backend instrument name.
- `project_id`: REDCap project ID.
- `project_url`: REDCap project URL.
- `record`: REDCap record ID, should correspond to LORIS PSCID.
- `redcap_event_name`: REDCap event unique name, should correspond to LORIS visit label (e.g. `v02_arm_1`).
- `redcap_url`: REDCap instance url.
- `username`: REDCap username.
- `${instrument_backend_name}_complete`: REDCap instrument state. 0 = not complete, 1 = unverified, 2 = complete.

## Future Development

TBD

## Interactions with LORIS

### LORIS-REDCap Compatibility

This modules aims to generalize the use of LORIS-REDCap interoperability and allows to import data automatically.
However, the definition of elements such as visit/event and record/PSCID in REDCap and LORIS are different.
There is also event subdivisions in REDCap, known as `arm`, that are not present in LORIS.
For instance, a REDCap event can be named `V02` and being involved in several `arms` e.g. `v02_arm_1` and `v02_arm_2`.
To be compatible, this should be defined as two distincts visits in LORIS i.e. `v02_arm_1` and `v02_arm_2`.
As such, **clearly defining event/visit and record/PSCID for studies is crucial to that module**.

### REDCap Instrument State

REDCap DET notification `${instrument_backend_name}_complete` property defines the state of a REDCap instrument.

It can only be one of the following three states:
- 0 = not complete.
- 1 = unverified.
- 2 = complete.

The current REDCap module **ignores** all notifications that are not **complete**, meaning only notifications with code **"2"** will be parsed.

### Multi-REDCap Instance/Project Support

REDCap servers are called `instances` and each can make multiple `projects` accessible.
The current module accepts multiple REDCap instance and project definitions in `config.xml` file.
REDCap instances and projects must be declared in the `config.xml` file to be used.
When a REDCap DET notification is received, a REDCap HTTP Client is generated based on the `redcap_url` and `project_id` inside the notification if they are defined in the `config.xml` file.

### REDCap Importable Instruments

A list of importable REDCap instruments is accessible and configurable in the front-end configuration panel.
Only instruments defined there can be imported. **All others will be ignored**.

### LORIS Instrument State

To be importable, the LORIS version of a REDCap instrument must:
- Have an associated instrument file.
- Have a database definition, that is, have an entry in the `test_names`, `session`, and `test_battery` tables.
- Have a visit that corresponds to a REDCap event name, or use a visit mapping in the REDCap module configuration.
- Have a started visit with a populated battery, or use the automatic session creation feature in the REDCap module configuration.

## REDCap instrument naming

Because the REDCap module imports REDCap instruments as LORIS LINST instruments, REDCap instruments must adhere to a few naming requirements to be LINST-compatible:
- A field name should not finish with `_status`.
