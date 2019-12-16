# Dockerized Test Suite

## Requirements
You will need Docker Engine, Docker Compose, and NodeJS.

Please follow the directions [here](https://docs.docker.com/engine/installation/) to install Docker Engine. Be sure to also [create a Docker group](https://docs.docker.com/install/linux/linux-postinstall/) so Docker can be run without using `sudo`.

Next, install Docker Compose:

```
curl -L https://github.com/docker/compose/releases/download/1.8.1/docker-compose-`uname -s`-`uname -m` > ~/docker-compose
chmod +x ~/docker-compose
sudo mv ~/docker-compose /usr/local/bin/docker-compose
```

Make sure you have NodeJS installed. If not, follow the instructions [here](https://nodejs.org/en/download/package-manager/).

Finally, run `npm install` in the root folder (this is only required for Javascript linting).

## Basic Workflow

**To run all the unit tests:**

```
npm run tests:unit
```

**To run all of the integration tests:**

```
npm run tests:integration
```

You can see the integration tests in action by connecting your VNC viewer to `<host>:5900` and supplying the password `secret`. 


**To run PHP linting:**

```
npm run lint:php
```

**To run Javascript linting:**

```
npm run lint:javascript
```
  
## Advanced Workflow

#### View tests in realtime
You can view the testing process as it happens with [Selenium Server](https://selenium.dev/downloads/) and using [VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/).


1) Start the Selenium Server:
    ```
    java -jar selenium-server-standalone-2.53.1.jar
    ```

2) Start the tests with npm:
    ```
    npm run tests:integration
    ```

3) View the tests as they perform with VNC Viewer at `127.0.0.1` with password `secret`.

4) You should now be able to view the browser performing all the tests (one by one) in realtime.

#### Command-Line Options
You can pass any [PHPUnit command-line options](https://phpunit.de/manual/current/en/textui.html) by appending `--` followed by the options. For example, say you only wanted to run the unit tests contained in the `CandidateTest` class. To achieve this you could run the following command:

```
npm run tests:unit -- --filter CandidateTest
```

Or, to run a specific test within `CandidateTest`:

```
npm run tests:unit -- --filter CandidateTest::testValidatePSCID
```

#### Debugging

Both the unit and integration tests can be run with XDebug enabled.

```
npm run tests:unit:debug
```
Or
```
npm run tests:integration:debug
```

You must specify a remote host for XDebug to connect to via the `XDEBUG_REMOTE_HOST` environment variable when using either of these commands.


## Todo

- Run integration tests in parallel

## Issues

- By default npm will output some irrelevant info when a script returns a non-zero error code, as described [here](https://github.com/npm/npm/issues/8821). To prevent this pass `-s` or `--silent` to `npm run`, e.g. `npm run -s tests:unit`.

- Running the entire integration test suite with XDebug enabled sometimes results in a segmentation fault. This appears to be an issue with XDebug itself.
