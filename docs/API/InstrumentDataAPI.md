This file describes the REST API to be implemented for interacting with Loris data. This
API is NOT YET IMPLEMENTED.
====

# Loris Instrument API - v0.0.1a-dev

## 1.0 Overview

Loris will implement a RESTful API. Any request sent to $LorisRoot/api/$APIVERSION/$API_CALL
will return either a JSON object or no data. The Loris API will use standard HTTP error
codes (200 for success, 3xx for errors) and the body will either be empty or contain only
a JSON object for any request. For brevity, the $LorisRoot/api/$APIVERSION is omitted from
this specification. This document specifies $APIVERSION v0.0.1a-dev

HTTP GET requests will NEVER modify data. POST requests MUST be used to modify data.

The current version of the API is split into 2 parts. Part 1 specifies the API for getting
instruments. Part 2 specifies the API for interacting with candidate data.

The current API assumes that the user issuing the HTTP request is already logged in to Loris
and has appropriate permissions. If not, an error object will be returned of the form

```json
{
    "error" : "an error message"
}
```

and a non-200 code will be used.

Subsequence versions of this API should specify a more flexible authentication mechanism.

# 2.0 Instrument API

The instrument API specifies an API for interacting with instruments and their data directly.
The instrument API is specified under $LorisRoot/api/$APIVERSION/Instrument/ and uses subcomponents
for different aspects of interacting with Loris


## 2.1 API for getting/updating forms and/or rules.

The /Instrument/Form/ subcomponent specifies rules for creating and retrieving the instrument
form and rules itself, with no data.

```
GET /Instrument/Form/$InstrumentName?Form=true&Rules=true
```

This will return a JSON object of the format specified in InstrumentFormat.md and RulesFormat.md
which describe the instrument named $InstrumentName in this Loris instance.
If Form=true and Rules=true, the rules and form will be combined into a single JSON object.
If either are false, then that portion of the object will be omitted.
Default for both both are true if omitted from the GET request. At least one should always
be true, otherwise an empty JSON object may be returned.

```
POST /Instrument/Form/$InstrumentName?Form=true&Rules=true
```
A POST request for /Instrument/Form/$InstrumentName will install or update an already existing
form. The user issuing the request must have appropriate permissions. If either Rules=false or
Form=false is set on the request, then that aspect of the form will NOT be updated and existing
form or rules will continue to be used.

## 2.2 Flags

The /Instrument/Flags subcomponent specifies an API for interacting with instrument flags, separately
from the data. Flags correspond to the instrument flags on the left sidepanel of an instrument in Loris.

```
GET /Instrument/Flags/$CommentID
```

A GET request to `/Instrument/Flags/$CommentID` will retrieve a JSON object of the current flags. If
the CommentID is unknown, it can be found using the candidate API.

The JSON object is of the form:

```json
TODO: Write this
```

```
POST /api/v0.0.1a-dev/Instrument/Flags/$CommentID
```

A POST request to `/Instrument/Flags/$CommentID` will retrieve a JSON object of the current flags.




==== TODO: Below this line is not yet written.
GET /api/v0.0.1a-dev/Instrument/Data/$CommentID
POST /api/v.0.1a-dev/Instrument/Data/$CommentID
-- Returns JSON
-- Body includes JSON of instrument

Candidate API:
-- Getting Candidate data (such as list of Visits):
GET /api/v0.0.1a-dev/$CandID
-- Getting session data (such as list of instruments, files, documents..)
GET /api/v0.0.1a-dev/$CandID/$VisitLabel?IncludeInstruments=true&IncludeImages=true&IncludeDocuments=false
-- Getting / updating instrument data through candidate API
-- Behaviour mirrors instrument API, but does not require knowledge of
-- CommentID
GET /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName&DDE=false
POST /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName&DDE=false
GET /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName/Flags&DDE=false
POST /api/v0.0.1a-dev/$CandID/$VisitLabel/Instruments/$InstrumentName/Flags&DDE=false
