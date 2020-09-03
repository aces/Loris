# LORIS API Tour 1/2

## HTTP 1.1

**Disclaimer! This is not exhaustive and mostly accurate **  
*My intention is to present some key concepts that will be used later in the presentation*  


URLs are ressources addresse that can be access and interact with using predefined methods.  
ex: `https://demo.loris.ca/main.php` is a link for the ressource `main.php` on `demo.loris.ca` 


Protocol : A client send a **HTTP Request** to a server that should answer with a **HTTP Response**.  
 - Requests and Responses have headers and often body
 - Requests uses a Methods
 - Responses have status codes
  


### HTTP Request
##### Methods
  - GET : Retreive a ressource
  - POST : Send data to the server
  - PUT : Replace a ressource
  - PATCH : Partially replace a ressource 
  - DELETE : Delete
  - HEAD : Same as GET but without the ressource (headers only)
   
   https://www.restapitutorial.com/lessons/httpmethods.html
   
##### Headers
The headers describe the nature of the request or give hint to the server about how to process it.
  - **Accept** *Used for content negociation*
  - **Authorization** *Involved in the authentication process*
  - **Content-Length** *When the request contains a body (POST/PUT/PATCH)*
  - **Content-Type** *When the request contains a body (POST/PUT/PATCH)*
  - ...  
  

### HTTP Response
#### Status code
  - 1xx: Informational - Request received, continuing process
  - 2xx: Success - The action was successfully received, understood, and accepted
  - 3xx: Redirection - Further action must be taken in order to complete the request
  - 4xx: Client Error - The request contains bad syntax or cannot be fulfilled
  - 5xx: Server Error - The server failed to fulfill an apparently valid request
 
  https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 
**200 OK**  
The request has succeeded. The information returned with the response is dependent on the method used in the request, for example:

*GET* an entity corresponding to the requested resource is sent in the response   
*POST* an entity describing or containing the result of the action   
  
  
**303 See Other**  
The response to the request can be found under a different URI and SHOULD be retrieved using a GET method on that resource. [...]

The different URI SHOULD be given by the **Location field** in the response. [...]  


**400 Bad Request**  
The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.

**401 Unauthorized** ... _I don't know who you are_  
The request requires user authentication. 

**403 Forbidden** ... _I know who you are and you can't access that ressource_  
The server understood the request, but is refusing to fulfill it. 

**404 Not Found**  
The server has not found anything matching the Request-URI. [...]  

**500 Internal Server Error**  
The server encountered an unexpected condition which prevented it from fulfilling the request.
      
#### Headers


  - **Content-Length** *When the response contains a body (even for HEAD)*
  - **Content-Type** *The type of data returned*  
  - **Location** After a 303 response, the URL to GET the ressource
  - ...  
  

#### Quick example using curl


```bash
%%bash
curl -v -s --head https://demo.loris.ca/main.php 2>&1 |grep '[<>]'
```

#### With a html parser user agent (browser)
https://demo.loris.ca

### What if I do not want to use a mouse?


```bash
%%bash
curl -k -i -s \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=demo&password=demo&login=Click+to+enter' \
  https://demo.loris.ca/main.php
```

## LORIS API ressources (endpoints)

Our API documentation: https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md


```bash
%%bash
curl -s https://demo.loris.ca/api/v0.0.3/login -d '{"username":"", "password": ""}'
```

### Great, we have a token... now what?


```bash
%%bash
# Query the /candidates endpoint
# https://github.com/aces/Loris/blob/minor/docs/API/LorisRESTAPI.md#30-candidate-api

token=''
curl -k -s \
  -H "Authorization: Bearer $token" \
  https://demo.loris.ca/api/v0.0.3/candidates/ 
```


```bash
%%bash
# Query the /candidate_list module

token=''
curl -k -s \
  -H "Authorization: Bearer $token" \
  'https://demo.loris.ca/candidate_list/?format=json'
```

### Scripting and parsing json; maybe with python 
  
see: [part2 - Python script](https://github.com/aces/Loris/blob/2020-07-20-jupyterApiPart2/docs/notebooks/LORIS-API_Part2-Python-script.ipynb)
