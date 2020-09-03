# LORIS API Tour 2/2

This tutorial contains basic examples in Python to demonstrate how to interact with the API.


## Setup


```python
import getpass  # For input prompt hide what is entered
import json     # Provides convenient functions to handle json objects 
import re       # For regular expression
import requests # To handle http requests
import warnings # To ignore warnings

# Because the ssl certificates are unverified, warnings are thrown at every 
# HTTPS request. The following command will prevent warning messages to be
# printed at every HTTPS request.
warnings.simplefilter('ignore')

baseurl = 'https://demo.loris.ca/api/v0.0.3'

def prettyPrint(string):
    print(json.dumps(string, indent=2, sort_keys=True))
```

## About the data in demo.loris.ca
The demo instance of LORIS contains the raisinbread dataset, which is used 
by LORIS developers. For more informations about raisinbread, click [here](https://github.com/aces/Loris/tree/main/raisinbread)

## Exercise 1. Login

This is a POST request to the `/login` endpoint that requires 2 parameters: `username` and `password`  
The expected response is a json string that contains a token property.  

https://github.com/aces/Loris/blob/main/modules/api/docs/LorisRESTAPI_v0.0.3.md


```python
payload = {
    'username': input('username: '), 
    'password': getpass.getpass('password: ')
}

response = requests.post(
    url = '/'.join([baseurl, 'login']),
    json = payload,
    verify = False
)

text = response.content.decode('ascii')

data = json.loads(text)

prettyPrint(data)
```

*Store the token in a variable for later*


```python
token = data['token']
```

The requests thoughout this tutorial are very similar, only the URL changes. We will define 5 functions that will make the tutorial easier to read.

For more information on HTTP requests and their differences, you can refer to https://github.com/aces/Loris/blob/main/modules/api/docs/LorisRESTAPI_v0.0.3.md#10-overview


```python
def GET(url):
    """
    Function to send an HTTP GET request

    Parameters: baseurl (URL of the api, e.g. https://demo.loris.ca/api/v0.0.3)

    Returns: projects (Information on all projects)
    """
    response = json.loads(requests.get(
        url = url,
        verify = False,
        headers = {'Authorization': 'Bearer %s' % token}
    ).content.decode('ascii'))
    return response

def GETFile(url):
    """
    Function to send an HTTP GET request to download files

    Parameters: baseurl (URL of the api, e.g. https://demo.loris.ca/api/v0.0.3)

    Returns: projects (Information on all projects)
    """
    filename = file['Filename']
    image = requests.get(
        url = url,
        verify = False,
        headers = {'Authorization': 'Bearer %s' % token}
    )
    f = open(filename, "w+b")
    f.write(bytes(image.content))

def PUT(url, json_input):
    """
    Function to send an HTTP PUT request

    Parameters: 
        baseurl     (URL of the api, e.g. https://demo.loris.ca/api/v0.0.3)
        json_input  json object to query the information for the PUT request

    """
    response = requests.put(
        url = url,
        json = json_input,
        verify = False,
        headers = {'Authorization': 'Bearer %s' % token}
    )
    print(r.status_code)

def PATCH(url, json_input):
    """
    Function to send an HTTP PATCH request

    Parameters: 
        baseurl     (URL of the api, e.g. https://demo.loris.ca/api/v0.0.3)
        json_input  json object to query the information for the PUT request

    """
    response = requests.patch(
        url = url,
        json = json_input,
        verify = False,
        headers = {'Authorization': 'Bearer %s' % token}
    )
    print(r.status_code)

def POST(url, json_input):
    """
    Function to send an HTTP POST request

    Parameters: 
        baseurl     (URL of the api, e.g. https://demo.loris.ca/api/v0.0.3)
        json_input  json object to query the information for the PUT request

    """
    response = requests.patch(
        url = ''.join([url]),
        json = json_input,
        verify = False,
        headers = {'Authorization': 'Bearer %s' % token}
    )
    print(r.status_code)


```

# Exercice 2 - Projects

The endpoints in this section are used to get information on all candidates, to get information on a specific candidate or to add a new candidate.

https://github.com/aces/Loris/blob/master/modules/api/docs/LorisRESTAPI_v0.0.3.md#20-project-api

## Exercise 2.1 Get all projects

The endpoint `/projects` can be used to obtain information on all the projects contained in the database.



```python
# Save the project names to test other endpoints later
url = '/'.join([baseurl, 'projects'])
projects = GET(url)
projectNames = list(projects['Projects'].keys())

prettyPrint(projects)
```

## Exercise 2.2 Get a specific project

The endpoint `/projects/{project}` can be used to obtain information on a specific project contained in the database.



```python
url = '/'.join([baseurl, 'projects', projectNames[0]])
project = GET(url)
prettyPrint(projects)
```

## Exercise 2.3 Get all the candidates in a specific project

The endpoint `/projects/{project}/candidates` can be used to obtain information on all the candidates for a specific project.



```python
url = '/'.join([baseurl, 'projects', projectNames[0], 'candidates'])
projectCandidates = GET(url)
prettyPrint(projectCandidates)
```

## Exercise 2.4 Get all the images in a specific project

The endpoint `/projects/{project}/images` can be used to obtain information on all the images that are used in a project.



```python
url = '/'.join([baseurl, 'projects', projectNames[0], 'images'])
projectImages = GET(url)
prettyPrint(projectImages)
```

### Find recent images


```python
url = '/'.join([baseurl, 'projects', projectNames[0],
                'images?since=2018-12-13T10:20:18-05:00'])
projectRecentImages = GET(url)
prettyPrint(projectRecentImages)
```

## Exercise 2.5 Get all the instruments in a specific project

The endpoint `/projects/{project}/instruments` can be used to obtain information on all the instruments that are used in a project.



```python
url = '/'.join([baseurl, 'projects', projectNames[0], 'instruments'])
projectInstruments = GET(url)
prettyPrint(projectInstruments)
```

## Exercise 2.6 Get a specific instruments in a specific project

The endpoint `/projects/{project}/instruments/{instrument}` can be used to obtain information on a specific instrument that is used in a specific project.



```python
singleInstrument = list(projectInstruments['Instruments'].keys())[1]
url = '/'.join([baseurl, 'projects', projectNames[0],
                'instruments', singleInstrument])
projectSingleInstrument = GET(url)
prettyPrint(projectSingleInstrument)
```

## Exercise 2.7 Get all the electrophysiology recordings in a specific project

The endpoint `/projects/{project}/images` can be used to obtain information on all the images that are used in a project.



```python
url = '/'.join([baseurl, 'projects', projectNames[0], 'recordings'])
projectRecordings = GET(url)
prettyPrint(projectRecordings)
```

# Exercice 3 - Candidates

The endpoints in this section are used to get information on all candidates, to get information on a specific candidate or to add a new candidate.

https://github.com/aces/Loris/blob/master/modules/api/docs/LorisRESTAPI_v0.0.3.md#30-candidate-api

## Exercise 3.1 Get all candid

The endpoint `/candidates` can be used to obtain information on all the candidates contained in the database.



```python
url = '/'.join([baseurl, 'candidates'])
allCandidates = GET(url)
prettyPrint(allCandidates)
```

## Exercise 3.2 Create a candidate
 - Send a **POST** request to /candidates with a payload containing an object with a candidate property
 ```json
    "Candidate" : {
        "Project" : ProjectName,
        "PSCID"   : PSCID, # only if config is set to prompt 
        "EDC"     : "YYYY-MM-DD", # optional
        "DoB"     : "YYYY-MM-DD",
        "Gender"  : "Male|Female",
        "Site"    : SiteName,
    }
 ```
 


```python
# Keep some variables for the next examples
projectname = list(projects['Projects'].keys())[0]
sitename = allCandidates['Candidates'][0]['Site']
```


```python
json_data = {
    'Candidate' : {
        'Project' : projectname,
        'DoB'     : "2015-09-10",
        'EDC'     : "2015-09-10", #Optional
        'Sex'     : "Female",
        'Site'    : sitename,
    }
}
url = '/'.join([baseurl, 'candidates'])
POST(url, json_data)
```

## Exercise 3.3 Get a specific candidate

This is a GET request to /candidates/{candid}



```python
candid = allCandidates['Candidates'][0]['CandID']
singleCandidate = GET('/'.join([baseurl, 'candidates', candid]))
prettyPrint(singleCandidate)
# keep a visit for the next examples
candidateVisit = singleCandidate['Visits'][0]
```

# Exercice 4 - Visits

The endpoints in this section are used to get information on all candidates, to get information on a specific candidate or to add a new candidate.

https://github.com/aces/Loris/blob/master/modules/api/docs/LorisRESTAPI_v0.0.3.md#40-imaging-data

## Exercise 4.1 Get all visits for a specific candidate

This is a GET request to /candidates/{candid}/{visit}



```python
url = '/'.join([baseurl, 'candidates', candid, candidateVisit])
candidateVisits = GET(url)
prettyPrint(candidateVisits)

```

## Exercise 4.2 Add a timepoint for a given candidate
 - **PUT** request to /candidates/\$candid/\$visit_label
```json
{
    "Meta" : {
        "Battery" : "Fresh",
        "CandID" : CandID,
        "Project" : "Pumpernickel",
        "Visit"  : VisitLabel,
        "Battery": "NameOfSubproject"
    "Stages": {
        "Visit": {
            "Date": "2017-03-26",
        }
    }
}
```

 - All VisitLabels for a given candidates can be found using /candidates/\$candid/
 
 
 - Every possible visit_labels for a project can be found using /projects/\$projectname/visits. If a \$visit_label is in /projects/\$projectname/visits but not in /candidates/\$candid/ , it can be added with a **PUT** request to /candidates/\$candid/\$visit_label


 - Battery (NameOfSubproject) must be guessed... 
 
 


```python
battery = candidateVisits['Meta']['Battery']

json_data = {
        "Battery" : battery,
        "Site" : sitename,
        "CandID" : candid,
        "Visit"  : candidateVisit,
        "Project": projectNames[0]
}
url = '/'.join([baseurl, '/candidates/', str(candid), '/', candidateVisit])
PUT(url, json_data)
GET(url)
```

## Exercise 4.3 Get QC/imaging of a candidate visit

This is a GET request to /candidates/{candid}/{visit}



```python
url = '/'.join([baseurl, 'candidates', candid, candidateVisit, 'qc', 'imaging'])
singleCandidateQcImaging = GET(url)
prettyPrint(singleCandidateQcImaging)
```

## Exercise 4.4 Change QC/imaging of a candidate visit
 - **PUT** request to /candidates/\$candid/\$visit_label/ qc/imaging
```json
{
    "Meta" : {
        "CandID" : CandID,
        "Visit"  : VisitLabel,
        "Battery": "NameOfSubproject"
}
```

 - All VisitLabels for a given candidates can be found using /candidates/\$candid/
 
 
 - Every possible visit_labels for a project can be found using /projects/\$projectname/visits. If a \$visit_label is in /projects/\$projectname/visits but not in /candidates/\$candid/ , it can be added using a **PUT** request to /candidates/\$candid/\$visit_label


 - Battery (NameOfSubproject) must be guessed... 


```python
json_data = {
    'Meta' : {
        'CandID' : candid,
        'Visit'  : candidateVisit,
    },
    'SessionQC': "",
    'Pending': True
}
url = '/'.join([baseurl, 'candidates', candid, candidateVisit, 'qc', 'imaging'])
PUT(url, json_data)
visitqcImaging = GET(url)
prettyPrint(visitqcImaging)
```

# Exercice 5: Instrument data for a candidate


## Exercise 5.1. Find all candidates and session with a given instruments

This is a series of GET request  

https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#31-specific-candidate  
https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#33-candidate-instruments   
https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#33-the-candidate-instrument-data


```python
request_count = 0

for candidate in allCandidates['Candidates']:
    candid = candidate['CandID']
    request_count += 1
    visit_labels = GET('/'.join([baseurl, 'candidates', candid]))['Visits']
    for visit_label in visit_labels:
        request_count += 1
        instruments = GET('/'.join([baseurl,
                                    'candidates',
                                    candid, 
                                    visit_label, 
                                    'instruments']))['Instruments']
        for instrument in instruments:
            request_count += 1
            instr = GET('/'.join([baseurl,
                                  'candidates',
                                  candid,
                                  visit_label,
                                  'instruments',
                                  instrument]))
            print(json.dumps(instr, indent=2, sort_keys=True))
print(request_count)


```


```python
# Get an example of candid and visit_label from the last 
# sample visited in the loop 
candid_instruments = instr['Meta']['Candidate']
visit_label_instruments = instr['Meta']['Visit']
candid_instrument = instr['Meta']['Instrument']
```

## Exercise 5.2 GET all instruments for a candidate



```python
url = '/'.join([baseurl, 'candidates', candid_instruments, 
                visit_label_instruments, 'instruments'])
candidateinstruments = GET(url)
prettyPrint(candidateinstruments)
```

## Exercise 5.3 Input instrument data for a candidate
  
GET, PUT or PATCH request to /candidates/$CandID/$VisitLabel/instruments/$InstrumentName  

https://github.com/aces/Loris/blob/main/modules/api/docs/LorisRESTAPI_v0.0.3.md#33-the-candidate-instrument-data

data format:
```json
{
  "Meta": {
    "Candidate": string,
    "Visit": string
    "DDE": true|false,
    "Instrument": string,
  },
  <instrument_name>: {
    <field1_name>: <value1>,
    <field2_name>: <value2>,
    ...
  }
}
```


### 5.3.1 GET request containing all the fields


```python
url = '/'.join([baseurl, 'candidates', candid_instruments, 
                visit_label_instruments, 'instruments', candid_instrument])
candidateSelectedInstrument = GET(url)
prettyPrint(candidateSelectedInstrument)
```

### 5.3.2 PATCH request


```python
# Get all the fields an meta data
url = '/'.join([baseurl, 'candidates', candid_instruments, 
                visit_label_instruments, 'instruments', candid_instrument])
json_input = GET(url)

# Update one field
json_input[candid_instrument]['Candidate_Age'] = 3
json_input[candid_instrument]['UserID'] = 'something2'

PATCH(url, json_input)
candidateSelectedInstrument = GET(url)
prettyPrint(candidateSelectedInstrument)
```

### 5.3.3 PUT request


```python
# Get all the fields an meta data
json_input = {
    'Meta': {
        'Candidate': candid_instruments,
        'DDE': False,
        'Instrument': candid_instrument,
        'Visit': candidateVisit},
        instrument: {'Candidate_Age': 42}}

url = '/'.join([baseurl, 'candidates', candid, candidateVisit,
                'instruments', instrument])
PUT(url, json_input)
candidateSelectedInstrument = GET(url)
# Candidate_Age should be changed to '41' and UserID back to null
prettyPrint(candidateSelectedInstrument)

# PROBLEM: UserID stays at the current modified value

```

## Exercise 5.4 Input instrument flags for a candidate
  
PUT or PATCH request to /candidates/$CandID/$VisitLabel/instruments/$InstrumentName  

https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#33-the-candidate-instrument-data

data format:
```json
{
  "Meta": {
    "Candidate": string,
    "Visit": string
    "DDE": false,
    "Instrument": string,
  },
  "Flags": {
    "Data_entry": string,
    "Administration": string
    "Validity": true|false
  }
}
```


### 5.4.1 GET request containing all the fields for an instrument flags


```python
url = '/'.join([baseurl, 'candidates', candid, visit_label_instruments,
                'instruments', candid_instrument, 'flags'])
candidateSelectedInstrumentFlags = GET(url)
prettyPrint(candidateSelectedInstrumentFlags)
```

#### 5.4.2 PUT request containing all the fields


```python
json_input = GET(url)

# Update one field
json_input = {
    'Meta': {
        'Candidate': candid_instruments,
        'DDE': False,
        'Instrument': candid_instrument,
        'Visit': candidateVisit},
        'Flags': {'Administration': 1}}

PUT(url, json_input)
candidateSelectedInstrument = GET(url)
prettyPrint(candidateSelectedInstrument)
```

#### 5.4.3 PATCH request containing some of the fields


```python
json_input = GET(url)

# Update one field
json_input['Flags']['Administration'] = 1
json_input['Flags']['Data_entry'] = 1

PATCH(url, json_input)
candidateSelectedInstrument = GET(url)
prettyPrint(candidateSelectedInstrument)
```

## Exercise 5.5 Input instrument DDE for a candidate
  
GET, PUT or PATCH request to /candidates/$CandID/$VisitLabel/instruments/$InstrumentName  

https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#33-the-candidate-instrument-data

data format:
```json
{
  "Meta": {
    "Candidate": string,
    "DDE": true,
    "Instrument": string,
    "Visit": string
  },
  <instrument_name>: {
    <field1_name>: <value1>,
    <field2_name>: <value2>,
    ...
  }
}
```


#### 5.5.1 GET request containing all the fields


```python
url = '/'.join([baseurl, 'candidates', candid_instruments, visit_label_instruments,
                'instruments', candid_instrument, 'dde'])

candidateSelectedInstrumentDde = GET(url)

prettyPrint(candidateSelectedInstrumentDde)
```

#### 5.5.2 PATCH request containing all the fields


```python
# Get all the fields and meta data
json_input = GET(url)
# Update one field
json_input[candid_instrument]['Candidate_Age'] = 5
json_input[candid_instrument]['UserID'] = '30'

PATCH(url, json_input)
candidateSelectedInstrumentDde = GET(url)
prettyPrint(candidateSelectedInstrumentDde)
```

#### 5.5.3 PUT request containing a single field to modify


```python
## Update one field
json_input = {
    'Meta': {
        'Candidate': candid_instruments,
        'DDE': True,
        'Instrument': candid_instrument,
        'Visit': candidateVisit},
        'aosi': {'Candidate_Age': '1'}}

PATCH(url, json_input)
candidateSelectedInstrumentDde = GET(url)
prettyPrint(candidateSelectedInstrumentDde)
```

## Exercise 5.6 Input instrument DDE flags for a candidate
  
PUT or PATCH request to /candidates/$CandID/$VisitLabel/instruments/$InstrumentName  

https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#33-the-candidate-instrument-data

data format:
```json
{
  "Meta": {
    "Candidate": string,
    "Visit": string
    "DDE": true,
    "Instrument": string,
  },
  "Flags": {
    "Data_entry": string,
    "Administration": string
    "Validity": true|false
  }
}
```


### 5.6.1 GET request to query all the fields


```python
url = '/'.join([baseurl, 'candidates', candid, visit_label_instruments,
                'instruments', instrument, 'flags', 'dde'])
candidateSelectedInstrumentDdeFlags = GET(url)

prettyPrint(candidateSelectedInstrumentDdeFlags)
```

### 5.6.2 PATCH request


```python
# Get all the fields an meta data
json_input = GET(url)

# Update one field
json_input['Flags']['Data_entry'] = 3

PATCH(url, json_input)
candidateSelectedInstrumentDdeFlags = GET(url)
prettyPrint(candidateSelectedInstrumentDdeFlags)
```

### 5.6.3 PUT request


```python
json_input = {
    'Meta': {
        'Candidate': candid_instruments,
        'DDE': False,
        'Instrument': candid_instrument,
        'Visit': candidateVisit},
        'Flags': {'Administration': 1}}

# Update one field
json_input['Flags']['Data_entry'] = 3

PATCH(url, json_input)
candidateSelectedInstrumentDdeFlags = GET(url)
prettyPrint(candidateSelectedInstrumentDdeFlags)
```

# Exercice 6: Images data for a candidate


```python
candid_img = projectImages['Images'][0]['Candidate']
visit_img = projectImages['Images'][0]['Visit']
imagename = projectImages['Images'][0]['Link'].split('/')[-1]
```

## Exercise 6.1 Find all images of a candidate for a visit


```python
url = '/'.join([baseurl, 'candidates', candid_img, visit_img, 'images'])
candidateImages = GET(url)
prettyPrint(candidateImages)
```

## Exercise 6.2 Download all minc files of a candidate


```python
for file in candidateImages['Files']:
    filename = file['Filename']
    url = '/'.join([baseurl, 'candidates', candid_img, 
                    visit_img, 'images', filename])
    GETFile(url)
```



## Exercise 6.3 GET QC data for a MINC image file


```python
url = '/'.join([baseurl, 'candidates', candid_img, visit_img, 'images',
                imagename, 'qc'])
candidateImagesQc = GET(url)
prettyPrint(candidateImagesQc)
```

## Exercise 6.4 PUT QC data for a MINC image file

PUT request to /candidates/$CandID/$VisitLabel/images/$imagename/qc  

https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#

data format:
```json
{
            'Meta'     : {
                'CandID' : string,
                'Visit'  : string,
                'File'   : string
            },
            "QC"       : string|null,
            "Selected" : boolean,
            'Caveats'  : {
                '0' : {
                    'Severity'   : string|null,
                    'Header'     : string|null,
                    'Value'      : string|null,
                    'ValidRange' : string|null,
                    'ValidRegex' : string|null
                    }
                }
}
```



```python
json_input = GET(url)
json_input['Selected'] = False

PATCH(url, json_input)
candidateSelectedInstrumentDdeFlags = GET(url)
prettyPrint(candidateSelectedInstrumentDdeFlags)
```

## Exercise 6.5 GET Image formats

### Exercise 6.5.1 GET Image Brainbrowser format


```python
candidateImageFormatBrainbrowser = GET('/'.join([baseurl, 'candidates',
                                                 candid_img, visit_img, 
                                                 'images', imagename, 
                                                 'format', 'brainbrowser'])) 
prettyPrint(candidateImageFormatBrainbrowser)
```

### Exercise 6.5.2 GET Image Raw format


```python
url = '/'.join([baseurl, 'candidates', candid_img, visit_img, 
                'images', imagename, 'format', 'raw'])
GETFile(url)
```

### Exercise 6.5.3 GET Image Thumbnail format


```python
url = '/'.join([baseurl, 'candidates', candid_img, visit_img, 
                        'images', imagename, 'format', 'thumbnail'])
GETFile(url)
```

## Exercise 6.6 GET Image headers

### Exercise 6.6.1 GET Image headers


```python
url = '/'.join([baseurl, 'candidates', candid_img,
                visit_img, 'images', imagename, 'headers'])
candidateImageHeaders = GET(url)
prettyPrint(candidateImageHeaders)
```

### Exercise 6.6.2 GET Image headers full


```python
url = '/'.join([baseurl, 'candidates', candid_img,
                visit_img, 'images', imagename, 'headers', 'full'])
candidateImageHeadersFull = GET(url)
prettyPrint(candidateImageHeadersFull)
```

### Exercise 6.6.3 GET Image headers headername


```python
url = '/'.join([baseurl, 'candidates', candid_img, visit_img, 
                'images', imagename, 'headers', 'specific'])
candidateImageHeadersHeadername = GET(url)
prettyPrint(candidateImageHeadersHeadername)
```

# Exercice 7: Electrophysiology recordings data for a candidate


```python
# First, find a candidate visit with an electrophysiology recording
candid_recs = projectRecordings['Recordings'][0]['Candidate']
visit_recs = projectRecordings['Recordings'][0]['Visit']
recording_filename = projectRecordings['Recordings'][0]['Link'].split('/')[-1]
```

## Exercise 7.1 Find all recordings of a candidate for a visit


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'recordings'])
candidateRecordings = GET(url)
prettyPrint(candidateRecordings)
```

## Exercise 7.2 Download electrophysiology recording (edf) files


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 
                'recordings', recording_filename])
GETFile(url)
```

## Exercise 7.3 Get electrophysiology recording channels data


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 
                'recordings', recording_filename, 'channels'])
candidateRecordingsChannels = GET(url)
prettyPrint(candidateRecordingsChannels)
```

## Exercise 7.4 Get electrophysiology recording channels meta data


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'recordings', 
                recording_filename, 'channels', 'meta'])
candidateRecordingsChannelsMeta = GET(url)
prettyPrint(candidateRecordingsChannels)
```

## Exercise 7.5 Get electrophysiology recording electrodes data


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'recordings', 
                recording_filename, 'electrodes'])
candidateRecordingsElectrodes = GET(url)
prettyPrint(candidateRecordingsChannels)
```

## Exercise 7.6 Get electrophysiology recording electrodes meta data


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'recordings', 
                recording_filename, 'electrodes', 'meta'])
candidateRecordingsElectrodesMeta = GET(url)
prettyPrint(candidateRecordingsChannels)
```

## Exercise 7.7 Get electrophysiology recording events data


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 
                'recordings', recording_filename, 'events'])
candidateRecordingsEvents = GET(url)
prettyPrint(candidateRecordingsEvents)
```

## Exercise 7.8 Get electrophysiology recording events meta data


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'recordings', 
                recording_filename, 'events', 'meta'])
candidateRecordingsEventsMeta = GET(url)
prettyPrint(candidateRecordingsEventsMeta)
```

# Exercise 8 - Dicoms


```python
# The flag is used to break the loops once an example that contains a 
# Dicom file is found
flag = 0

for candidate in allCandidates['Candidates']:
    candid = candidate['CandID']
    visit_labels = GET('/'.join([baseurl, 'candidates', candid]))['Visits']
    if flag == 1:
        break
    candid = candidate['CandID']
    visit_labels = GET('/'.join([baseurl, 'candidates', candid]))['Visits']
    for visit_label in visit_labels:
        dicoms = GET('/'.join([baseurl, 'candidates', candid, 
                               visit_label, 'dicoms']))
        # We only want to get a single valid example of a candidate and visit that
        # has Dicom files that can be used to test the Dicoms endpoints 
        if len(dicoms['DicomTars']) > 0:
            flag = 1
            break

```

## Exercise 8.1 GET a list of Dicom files for a candidate


```python
# Get an example of candid, visit_label and dicom tarname from the last 
# sample visited in the loop 
candid_dicom = dicoms['Meta']['CandID']
dicom_visit = dicoms['Meta']['Visit']
dicom_name = dicoms['DicomTars'][0]['Tarname']
```


```python
url = '/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'dicoms'])
candidateDicoms = GET(url)
prettyPrint(candidateRecordingsEventsMeta)
```

## Exercise 8.2 Download a Dicom tar file


```python
GETFile('/'.join([baseurl, 'candidates', candid_recs, visit_recs, 'dicoms', dicom_name]))
```
