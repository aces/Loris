# API module testplan
 
The API should be tested by following the API specs and making sure every command works.
This document is a preliminary test plan that should be superseded by a proper automated test suite.

## Using curl:
### Login
This is done sending a POST request to /login
```bash
~$ curl https://<your-hostname>/api/v0.0.3/login -d '{"username": "<your-username>", "password": "<your-password>"}'
```

The expected response is:

{"token": "\<a-really-long-string>"}

Store the token in a variable.
```bash
~$ token='<a-really-long-string>'
```

**Note:** If the response is: `{"error":"Unacceptable JWT key"}` then you need to set the JWTKey value in the config module to a sufficiently complex value. A value that is at least 20 characters and contains at least one letter, one number, and one special character should work.


### Examples
#### Candidates list - GET /candidates
This is done by sending a GET request to /candidates.
```bash
~$ curl -H "Authorization: Bearer $token" https://<your-hostname>/api/v0.0.3/candidates
```

See specification for the expected response format.


#### Candidate creation - POST /candidates
Candidate creation
This is done by sending a POST request to /candidates with the required data. Note the usage of the Authorization header.
```bash
~$ curl -H "Authorization: Bearer $token" https://<your-hostname>/api/v0.0.3/candidates -d '{see specs for content}'
```


