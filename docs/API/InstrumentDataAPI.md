This file describes the REST API to be implemented for interacting with Loris data. This
API is NOT YET IMPLEMENTED.
====

# Loris Instrument API - v0.0.1a-dev

## 1.0 Overview

Loris will implement a RESTful API. Any request sent to `$LorisRoot/api/$APIVERSION/$API_CALL`
will return either a JSON object or no data. The Loris API will use standard HTTP error
codes and the body will either be empty or contain only a JSON object for any request.
For brevity, the `$LorisRoot/api/$APIVERSION` is omitted from the definitions in this
document. This document specifies $APIVERSION v0.0.1a-dev and it
MUST be included before the request in all requests.

HTTP GET requests will NEVER modify data. POST requests MUST be used to modify data.

The current version of the API is split into 2 parts. Part 1 specifies the API for getting
instruments and their data. Part 2 specifies the API for interacting with candidate data.

The current API assumes that the user issuing the HTTP request is already logged in to Loris
and has appropriate permissions. If not, an error object will be returned of the form

```json
{
    "error" : "an error message"
}
```

and a non-200 code will be used.

Subsequence versions of this API should specify a more flexible authentication mechanism.

## 2.0 Instrument API

The instrument API specifies an API for interacting with instruments and their data directly if
the CommentID is known.
The instrument API is specified under $LorisRoot/api/$APIVERSION/Instrument/ and uses subcomponents
for different aspects of interacting with Loris instruments.


### 2.1 API for getting/updating forms and/or rules.

The /Instrument/Form/ subcomponent specifies rules for creating and retrieving the instrument
form and rules itself as specified by the InstrumentFormat and RulesFormat documents. It can be
used to get the details needed to render the form by a client.

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

A POST request for `/Instrument/Form/$InstrumentName` will install or update an already existing
form. The user issuing the request must have appropriate permissions. If either Rules=false or
Form=false is set on the request, then that aspect of the form will NOT be updated and existing
form or rules will continue to be used.

NOTE: The `POST` aspect of this subcomponent is likely to return a `501 Not Implemented` code for
      the foreseeable future.

### 2.2 Flags

The `/Instrument/Flags` subcomponent specifies an API for interacting with instrument flags, separately
from the data. Flags correspond to the instrument flags on the left sidepanel of an instrument in Loris.

The Flags subcomponent requires knowing the CommentID of the instrument that you would like to update.
If the CommentID is unknown, it can be retrieved using the Candidate API.

```
GET /Instrument/Flags/$CommentID
```

A GET request to `/Instrument/Flags/$CommentID` will retrieve a JSON object of the current flags. If
the CommentID is unknown, it can be found using the candidate API.

The JSON object is of the form:

```json
{
    "Meta" : {
        "CommentID" : $CommentID
    },
    "Flags" : {
        "Data_entry" : "In Progress|Complete",
        "Administration" : "None|Partial|All",
        "Validity" : "Questionable|Invalid|Valid"
    }
}
```

Where the Data_Entry, Administration, and Validity correspond to the flags in the `flag` table of Loris.
for that CommentID. Validity MAY be omitted if Validity is disabled for the instrument but every instrument
should have a Data_entry and Administration flag

```
POST /Instrument/Flags/$CommentID
```

A POST request to `/Instrument/Flags/$CommentID` will update the flags for the CommentID. The body of
the POST request should be a valid JSON object of the same format as the JSON object returned by a GET request.
However, if any flag is missing from the POST request that flag will not be updated. To null a flag, the value
of the JSON key should be explicitly set to the empty string.

Loris will return a 200 code on success and an appropriate HTTP error code on failure. If the CommentID of
the URL and JSON object do not match, a `400 Bad Request` will be returned.


### 2.3 Instrument Data

The `Instrument/Data` subcomponent of the instrument API is used for getting or modifying the data
of an instrument.
It requires knowledge of the `CommentID`. If the `CommentID` is not known, it can be retrieved
using the Candidate API.

```
GET /Instrument/Data/$CommentID?IncludeFlags=false
```

This will return a JSON object representing the data for the specified `CommentID`. The JSON object will
be of the format.

```json
{
    "Meta" : {
        "CommentID" : CommentID
    },
    "data" : {
        "Field1"       : "Value",
        "AnotherField" : "value",
        ...
    }
}
```

Where each field in the `data` hash represents the field corresponding to the InstrumentFormat. If
`?IncludeFlags=true` is set, then a "Flags" key will also be added to the top level JSON object.

```
POST /Instrument/Data/$CommentID
```

Posting a JSON object of the same format as that returned by a GET request to the same address will
update the data for that instrument. Any fields not in the "data" hash will be unmodified. To null them,
the key must be explicitly set to the empty string.

If the CommentID in the Meta object and the CommentID in the JSON object do not match a `400 Bad Request`
error will be returned.

## 3.0 Candidate API

The Candidate API is used to retrieve information about candidates the data for that candidate and its
respective visits. It is currently a read-only API, except for the aspect which mirrors the instrument API.

### 3.1 Getting Candidate data

If a GET request for a candidate is issued such as

```
GET $CandID
```

A JSON object representing that candidate will be returned.

The JSON object is of the form

```json
{
    "Meta" : {
        "CandID" : CandID
    },
    "Visits" : ["V1", "V2", ...]
}
```

### 3.2 Getting Candidate Visit label

A GET request of the form

```
GET $CandID/$VisitLabel?IncludeInstruments=true&IncludeImages=false&IncludeDocuments=false
```

Will return a JSON object of that candidate's visit. The JSON object is of the form

```json
{
    "Meta" : {
        "CandID" : CandID,
        "Visit"  : VisitLabel
    },
    "Instruments" : {
        "InstrumentName" : "CommentID",
        "AnotherInstrument" : "CommentID2",
        ...
    },
    "Images"      : {
        "FileName" : "MRI Protocol Name for File",
        "FileName2" : "MRI Protocol",
        ...
    }
    "Documents"   : {
        "DocumentName" : "URL to retrieve document",
        "Docment2"     : "URL to retrieve Document2"
    }
}
```

Instruments, Images, and Documents hashes will only be included in the object if
the respective IncludeX GET parameter is set. Default is only IncludeInstruments=true,
and the others are false.

### 3.3 The Candidate/Instrument API.

The Candidate API also contains a subcomponent to mirror the Instrument Data API described
in section 2.2 and 2.3 for when there is no knowledge of the CommentID. It consists of the
following requests:

```
GET $CandID/$VisitLabel/Instruments/$InstrumentName&DDE=false
POST $CandID/$VisitLabel/Instruments/$InstrumentName&DDE=false
```

These are the equivalent of `GET /Instrument/Data/$CommentID` or `POST /Instrument/Data/$CommentID`
for the CommentID of `InstrumentName` of candidate `CandID` at timepoint `VisitLabel`. If DDE=true is
specified, it is equivalent to the double data entry CommentID, otherwise the single data entry CommentID
is used.


```
GET $CandID/$VisitLabel/Instruments/$InstrumentName/Flags&DDE=false
POST $CandID/$VisitLabel/Instruments/$InstrumentName/Flags&DDE=false
```

These are the equivalent of `GET /Instrument/Flags/$CommentID` or `POST /Instrument/Flags/$CommentID`
for the CommentID of `InstrumentName` of candidate `CandID` at timepoint `VisitLabel`. If DDE=true is
specified, it is equivalent to the double data entry CommentID, otherwise the single data entry CommentID
is used.
