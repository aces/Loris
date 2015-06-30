This file describes the REST API to be implemented for interacting with Loris data.
IT IS STILL A WORK IN PROGRESS AND SHOULD NOT BE DEPENDED ON.

Still to be done:
1. Document an authentication/token system
2. Document a way to handle conflicts for offline clients
3. Add a way to get project settings which affect the API (ie. useEDC)
4. Ensure JSON markup is rendered correctly in document
5. Provide mechanism to extend REST API to include things such as imaging data, doc repo data,
   and an ability for modules to manage their data through the API

====

# Loris Instrument API - v0.0.1e-dev

## 1.0 Overview

Loris will implement a RESTful API. Any request sent to `$LorisRoot/api/$APIVERSION/$API_CALL`
will return either a JSON object or no data. The Loris API will use standard HTTP error
codes and the body will either be empty or contain only a JSON object for any request.
For brevity, the `$LorisRoot/api/$APIVERSION` is omitted from the definitions in this
document. This document specifies $APIVERSION v0.0.1d-dev and it
MUST be included before the request in all requests.

HTTP GET requests will NEVER modify data. PUT, POST or PATCH requests MUST be used to modify
data as per their definitions in the HTTP/1.1 specification. Any methods not supported
will respond with a 405 Method Not Allowed response and an appropriate Allow header set (as
per HTTP documentation.)

PUT requests either create or overwrite all data for a given instrument/candidate/visit/etc.
Any fields not explicitly specified in the PUT request are nulled.

PATCH requests are identical to PUT requests, but any fields not explicitly mentioned are
unmodified from their current value.

DELETE is not supported on any resource defined in this API.

The current API assumes that the user issuing the HTTP request is already logged in to Loris
and has appropriate permissions. If not, an error object will be returned of the form

```json
{
    "error" : "User not authenticated"
}
```

and an `401 Unauthorized` HTTP error code is returned.

Subsequence versions of this API should specify a more flexible authentication mechanism.

# 2.0 Project API

The Project API lives under the /projects portion of the API URL hierarchy. It is used to get
project specific settings or data. PUT and PATCH are not supported for the part of the API
living under /projects unless otherwise noted.

```
GET /projects
```

Will return a list of projects in this Loris instance. There is no corresponding PUT or PATCH
request. The JSON returned is of the form:

```json
{
    "Projects" : ["ProjectName1", "ProjectName2", ...]
}
```

If the Loris instance does not use projects, it will consist of a single project called "loris"

```
GET /projects/$ProjectName
```

Will return a 200 OK response if the project exists, and 404 Not Found if it does not, as well as any portion of the API under /projects/$ProjectName.

The body of the request to /projects/$ProjectName will be an entity of the form:

```json
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Visits" : ["V1", "V2", ... ],
    "Instruments" : ["InstrumentName", "InstrumentName2", "..."],
    "Candidates" : ["123543", "523234", ....]
}
```

It consists of a union of the $ProjectName/instruments/, $ProjectName/visits/, and $ProjectName/candidates/ URLs listed below.

```
GET /projects/$ProjectName/instruments/
```

Will return a JSON object of the form

```json
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Instruments" : ["InstrumentName", "InstrumentName2", "..."]
}
```

Where the InstrumentNames are the "Short Name" of all the instruments used/installed in this project.

```
GET /projects/$ProjectName/visits/
```

Will return a JSON object of the form

```json
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Visits" : ["V1", "V2", ... ],
}
```

Where V1, V2, ... are the visits that may exist for this project

```
GET /projects/$ProjectName/candidates/
```

will return a JSON object of the form

```json
{
    "Meta" : {
        "Project" : "ProjectName"
    },
    "Candidates" : ["123456", "342332", ... ],
}
```

where 123456, 342332, etc are the candidates that exist for this project.

## 2.1 Instrument Forms

```
GET /projects/$ProjectName/instruments/$InstrumentName
```

Will return a 200 response on success and 404 Not Found if $InstrumentName is not a valid instrument for this instance of Loris.

This will return a JSON representation of the instrument form. If available, rules and form will
be combined into a single JSON object. The format for the JSON returned is specified in the
accompanying InstrumentFormat.md and RulesFormat.md documents. The JSON document can be used
to render the form by a client.

PUT and PATCH are not supported for instrument forms.

Methods for getting/putting data into specific candidates are specified in section 3.

# 3.0 Candidate API

The /candidate portion of the API is used for retrieving and modifying candidate data and
data attached to a specific candidate or visit such as visits or instrument data.

```
GET /candidates
```

will return a JSON object of the form

```json
{
    "Candidates" : [CandID1, CandID2, CandID3, ...]
}
```

containing ALL CandIDs present in this Loris instance.

A new candidate can be created by sending a POST request to /candidates.

The body of the POST request should be a candidate key with a JSON object of the form:

```json
{
    "Candidate" : {
        "Project" : ProjectName,
        "PSCID"   : PSCID,
        "EDC"     : "YYYY-MM-DD",
        "DoB"     : "YYYY-MM-DD",
        "Gender"  : "Male|Female"
    }
}

Project is only required use useProjects is enabled in the Loris instance, and
similarly EDC is only required if useEDC is enabled in the Loris config. The
PSCID is only required if the generation type in the Loris config is not set to
"sequential".

The candidate will be created at the site of the user using the API's site.
A response code of 201 Created will be returned on success, 409 Conflict if
the PSCID already exists, and a 400 Bad Request if any data provided is invalid
(PSCID format, date format, gender something other than Male|Female, invalid project
name, etc). A created candidate will be accompagnied by data for the candidate
of the same form as a request to GET /candidates/$CandID

PUT / PATCH methods are not supported on /candidate in this
version of the Loris API.

# 3.1 Specific Candidate

If a GET request for a candidate is issued such as

```
GET /candidates/$CandID
```

A JSON object representing that candidate will be returned.

The JSON object is of the form

```json
{
    "Meta" : {
        "CandID"  : CandID
        "Project" : ProjectName,
        "PSCID"   : PSCID,
        "Site"    : Site,
        "EDC"     : "YYYY-MM-DD",
        "DoB"     : "YYYY-MM-DD",
        "Gender"  : "Male|Female"
    },
    "Visits" : ["V1", "V2", ...]
}
```

where V1, V2, etc are the visit labels that are registered for this
candidate.

PUT / PATCH are not supported for candidates in this version of the
API.

It will return a 200 OK on success, a 404 if the candidate does not exist, and
a 400 Bad Request if the CandID is invalid (not a 6 digit integer). The same is
true of all of the API hierarchy under /candidates/$CandID.

### 3.2 Getting Candidate visit data

A GET request of the form

```
GET /candidates/$CandID/$VisitLabel
```

Will return a JSON object of the metadata for that candidate's visit.

The JSON object is of the form:

```json
{
    "Meta" : {
        "CandID" : CandID,
        "Visit"  : VisitLabel
        "Battery" : "NameOfSubproject"
    },
    "Stages" : {
        'Screening' :  {
            'Date' : "YYYY-MM-DD"
            'Status' : "Pass|Failure|Withdrawal|In Progress"
        },
        'Visit' : {
            'Date' : "YYYY-MM-DD"
            'Status' : "Pass|Failure|Withdrawal|In Progress"
        }
        'Approval' : {
            'Date' : "YYYY-MM-DD"
            'Status' : "Pass|Failure|Withdrawal|In Progress"
        }
    }
}
```

A PUT request of the same format will create the VisitLabel for this candidate,
in an unstarted stage if the Visit label provided is valid.

PATCH is not supported for Visit Labels.

It will return a 404 Not Found if the visit label does not exist for this candidate
(as well as anything under the /candidates/$CandID/$VisitLabel hierarchy)

### 3.3 Candidate Instruments
```
GET /candidates/$CandID/$VisitLabel/instruments
```

Will return a JSON object of the form.

```json
{
    "Meta" : {
        "CandID" : CandID
        "Visit"  : VisitLabel
    },
    "Instruments" : [ "InstrumentName", "AnotherInstrument", ...]
}
```

Where the instruments array represents the instruments that were administered for that
candidate at that visit. InstrumentNames are the short names and the forms for them
SHOULD all be retrievable through the `project` portion of the API.

PUT / PATCH / POST are not currently supported for candidate instruments.

### 3.3 The Candidate Instrument Data

```json
GET /candidates/$CandID/$VisitLabel/instruments/$InstrumentName[/dde]
PUT /candidates/$CandID/$VisitLabel/instruments/$InstrumentName[/dde]
PATCH /candidates/$CandID/$VisitLabel/instruments/$InstrumentName[/dde]
```

These will retrieve or modifiy the data for $InstrumentName. If /dde is present, the double data
entry form of the data will be retrieved/modified. If absent, the "single data entry" version
of the form is used instead.

The format returned by a GET request is a JSON document of the form:

```json
{
    "$InstrumentName" : {
        "FieldName1" : "Value1",
        "FieldName2" : "Value2",
        ...
    }
}
```

Including the values of ALL fields for this instrument, including score field values.

The body of a PUT request to the same URL MUST contain a JSON object of the same format. Data PUT
to the URL SHOULD contain all fields with data entry. The server will null the data for keys not
specified. A PUT request MAY not specify score columns that will be calculated/overwriten by
server-side scoring. If the client attempted to score fields client-side and the value passed by the PUT
request conflict with the server-side calculation of the score, the server-side calculation will win.
Any keys specified in the document PUT that do not match a corresponding field in the form MAY be ignored.

The specification for PATCH request is similar to a PUT request, with the exception that any
fields not specified MUST be unmodified by the server rather than nulled. In most cases a series
of PATCH requests SHOULD be used rather than a single PUT request for a client with pagination.

A 200 OK will be returned on success, and a 404 Not Found if $InstrumentName is not a valid instrument installed in this Loris instance.

### 3.3.1 Instrument flags
```
GET /candidates/$CandID/$VisitLabel/instruments/$InstrumentName[/dde]/flags
PUT /candidates/$CandID/$VisitLabel/instruments/$InstrumentName[/dde]/flags
PATCH /candidates/$CandID/$VisitLabel/instruments/$InstrumentName[/dde]/flags
```

This URL is used to GET and modify flags for an instrument. The standard GET/PUT/PATCH
rules apply. However, PATCH and PUT requests MUST include the "Meta" attribute and all
fields in it MUST be specified and match the values in the URL, otherwise a "400 Bad request"
error is returned and no data is modified. Like instruments, the [/dde] component is optional
and used to differentiate single data entry and double data entry flags.

The "Validity" flag may be missing, if the ValidityEnabled flag is not true for this instrument.

The format of the JSON object for these URLS is:

```json
{
    "Meta" : {
        "Candidate"  : $CandID,
        "Visit"      : $VisitLabel,
        "Instrument" : $InstrumentName,
        "DDE"        : true|false
    },
    "Flags" : {
        "Data_entry" : "In Progress|Complete",
        "Administration" : "None|Partial|All",
        "Validity" : "Questionable|Invalid|Valid"
    }
}
```

