# API module testplan
 
The API should be tested by following the API specs and making sure every command works.
This document is a preliminary test plan that should be superseded by a proper automated test suite.

## Using the integration tests
The API's integration test suite can be used to test all endpoints automatically

# API module testplan
 
The API should be tested by following the API specs and making sure every command works.
This document is a preliminary test plan that should be superseded by a proper automated test suite.

## Using the integration tests
The API's integration test suite can be used to test all endpoints automatically. These tests are passed at every Travis checks.

### Using dockerized tests
To run the dockerized tests:
1- Make sure the Docker containers have been created. Otherwise, follow the instructions in `test/QuickSetup.md`.
2- Run `docker-compose run -T --rm integration-tests vendor/bin/phpunit --configuration test/phpunit.xml --testsuite LorisModuleIntegrationTests`

## Using curl:
`curl` can be used to test any endpoint manually.
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
Candidate creation is done by sending a POST request to /candidates with the required data. Note the usage of the Authorization header. For a candidate to be created, the candidate's information must also be included. The following command contains the minimal information necessary for the request to create a new candidate (see [docs](../../../docs/wiki/99_Developers/LORIS-REST-API-0.0.3-dev.md#30-candidate-api) for format instructions):

```bash
~$ curl -H "Authorization: Bearer $token" https://<your-hostname>/api/v0.0.3/candidates -d '{"Candidate":{"Project":"Rye","Site":"Montreal","DoB":"2019-01-31", "Sex":"Female"}}' 
```

If the candidate is successfully created, the candidate's data is returned. For example, the previous example returns: `{"CandID":"872451","Project":"Rye","PSCID":"MTL185","Site":"Montreal","EDC":null,"DoB":"2019-01-31","Sex":"Female"}`

Otherwise, an error message is returned. For example, the command `curl -H "Authorization: Bearer $token" https://<your-hostname>/api/v0.0.3/candidates -d ''` returns `{"error":"You are not affiliated with the candidate's site"}`

