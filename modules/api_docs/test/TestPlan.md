# API Docs module Test Plan

##  Overview

The API docs modules takes the api descriptor of LORIS's modules and creates an 
actionnable html page. Each endpoint of the selected schema is described and 
can be tried providing the required parameters. It uses 
[Swagger-ui](https://github.com/swagger-api/swagger-ui) to create the webpage.

##  Features

1. Presence of LORIS Menu Item 

2. Load schema from various modules.

3. Describe each endpoint's request body and expected responses. 

4. "Try it out" button to execute actions.

**_Note 1:_** Ideally, we should be testing each and every endpoints of all the 
definitions to make sure that requests and responses definitions matches the 
actual endpoints behaviour. This is out of scope for this module's tests plan 
and relies on the modules themselves to ensure that. 

---
## Permissions

A user requires `API documentation` (`api_docs`) permission to access the 
module.

**_Note 2:_** Schemas from modules that the user do not have access to 
shouldn't be available.

**_Note 3:_** Even if the module has described all the endpoints of a given 
schema, the availability of the endpoint and the data it presents when using "try it 
out", will depend on the user's permissions.

---
##  Testing Procedure

### Tests
1. In the Menu at the top, there should be a `API Documentation` item under 
`Tools`.
2. Click that submenu item, it should redirect to `/api_docs`.
3. Does page load? There should be an html page with a dropdown selector on the 
right to select api definitions.   
4. Select a different "module" in the  drop down. The endpoint list should 
change accordingly.
5. Select the `API` definition and scroll down to `GET /projects` in the 
`Project` section. Expend the endpoint by clicking on the chevron to the right. 
6. Click the "Try it out" button. An "Execute" button should appear. Click the 
"Execute" button. Something should appear (json data) in the `Response body` 
panel just below the "Execute" button.
