>**IMPORTANT**:
>
1. The following instructions are in beta. Please report any inconsistencies or unclear information.
2. Don't forget to replace $LORIS$ with the path to your Loris installation
3. Don't forget to replace $ModuleName$ with the actual name of your module

---

## 📝 Testing Procedure

**Step 1: Write a Test Plan**
  - A test plan consists of a text file containing a set of steps (written in plain English) that a tester needs to follow in order to test the functionality of a given module. These include but are not limited to permission verification (view/edit), button and link clicks, display of appropriate results, etc
  - Create your test plan under ```$LORIS$/modules/$ModuleName$/test/TestPlan.md```
  
**Step 2: Add integration tests**
  - Integration tests consist of a set of automated tasks to test the module in the browser. These attempt to automate the execution of common user actions loosely based on those described in the Test Plan
   - ```Note: Attempting to automate as many Test Plan tasks as possible is highly encouraged```
  - Selenium (browser automation software) is used in order to run integration tests. To run them on a remote VM, X11 forwarding needs to be used to display GUI on a local machine
  - Add your integration tests to ```$LORIS$/modules/$ModuleName$/test/$ModuleName$Test.php```

---

## 📝 X11 Overview

In current tutorial X11 is used in order to run an application remotely on the server (VM) and see an associated UI locally (on local machine)

In order for this to work, X11 server needs to be installed and launched on the local machine, listening for the incoming connections.

Once you launch X11 locally and SSH to VM using -X option, you could forward requests from your remote SSH session to X11 server. 

---

## 💻 Setup on Local Machine

### 1) Install Firefox 45.0
  - **MAC**: https://ftp.mozilla.org/pub/firefox/releases/45.0/mac/en-US/
  - **Unix**: For unix install see [Install Firefox on VM](#2-install-firefox-45)
  
### 2) Install X11/XQuartz
  - https://xquartz.macosforge.org/trac
  - After downloading and installing X11 on your machine make sure to reboot it
  - After reboot your global display variable should be set to an auto-generated X11 path
  - Verify it using ```echo $DISPLAY```
  - If the output is blank, your install wasn't successful or you didn't reboot the computer
  - If the DISPLAY variable is properly set, launch X11 server on your local machine

---

## 💻 Setup on remote Virtual Machine

### 0) Login

- SSH to your VM using ```-X``` parameter 
- i.e ```ssh -X user@localhost```


### 1) Install X11

```bash
sudo apt-get install xorg openbox
```


### 2) Install Firefox 45

**Step 1: Download**

```bash
#32 bit 
wget https://ftp.mozilla.org/pub/firefox/releases/45.0/linux-i686/en-US/firefox-45.0.tar.bz2

#64 bit
wget https://ftp.mozilla.org/pub/firefox/releases/45.0/linux-x86_64/en-US/firefox-45.0.tar.bz2
```

**Step 2: Extract**

```bash
tar -xjf firefox-45.0.tar.bz2
```

**Step 3: Move the Firefox 45 folder to opt**

```bash
#Remove the older version of firefox if it's there
sudo rm -rf /opt/firefox
sudo mv firefox /opt/firefox45
```

**Step 4: Create Symbolic link for New Firefox as default**

```bash
sudo mv /usr/bin/firefox /usr/bin/firefoxold
sudo ln -s /opt/firefox45/firefox /usr/bin/firefox
```

**Step 5: Test** 

Running ```firefox``` command should open a new firefox window in local instance of X11

>**Note**: If you get a "DISPLAY" error, go back to step 1 setup on local machine :(


### 3) Install and Run Selenium

>**Prerequisite**: you need to have Java installed

>**Important**: make sure you are logged in to SSH with -X option
- SSH to your VM using ```-X``` parameter 
- i.e ```ssh -X user@localhost```

**Step 1: Download Selenium**

```bash
cd ~ # Home folder can be changed to folder of preference
sudo wget http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.1.jar
```

**Step 2: Launch Selenium Server**

```bash
java -jar selenium-server-standalone-2.53.1.jar

# The launch can take a couple of minutes
# Once you see "Selenium Server is up and running" message, the server is ready to use
# Note: The server must remain running for the duration of testing (i.e you need to ssh -x again in the new tab to continue tutorial)
```


### 4) Set up DB connection for testing

**Step 0: Go to Loris test folder** 

```bash
cd $LORIS$/test/
```

**Step 1: Update config.xml**

Under ```<database>``` tag update the following information with your own.

```xml
<host>$DATABASE_HOST$</host>
<username>$DATABASE_USER$</username>
<password>$DATABASE_PASSWORD$</password>
<database>$SCHEMA_NAME$</database>
```

**Step 2: Update integration.sh**

Update information for host, database, username and password on top of the file, with information entered above.

**Step 3: Update phpunit.xml**

Add a module you want to test under ```<testsuite>```
```xml
<testsuite name='Loris Module Integration Tests'>
    ...
    <directory>../modules/$ModuleName$/test/</directory>
    ...
</testsuite>
```

### 5) Add your tests

Under ```$LORIS$/modules/$ModuleName$/test/``` create a file ```$ModuleName$Test.php``` with the following content:

```php

<?php
/**
 * $ModuleName$ automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   John Appleseed <jappleseed.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * $ModuleName$ module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   John Appleseed <jappleseed.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class $ModuleName$Test extends LorisIntegrationTest
{

    // All functions that start with test...() will be run
    // for this integration test

    /**
     * Test the page load
     *
     * @return void
     */
    public function testPageLoads()
    {
        $this->safeGet($this->url . '/$ModuleName$/');

        // In order to test the successful page load, retrieve an 
        // element on the page using its css selector and compare its
        // text to the asserted value. 
        // (e.g. retrieve Browse string from browse tab)
        $selector = WebDriverBy::cssSelector("#tab-browse");
        $text = $this->webDriver->findElement($selector)->getText();
        $this->assertContains("Browse", $text);
    }

    // Add more tests here

}

```

>Note: for more examples of integration test files see:
>
1. [Document Repository](https://github.com/aces/Loris/blob/16.1-dev/modules/document_repository/test/document_repositoryTest.php)
2. [Candidate List](https://github.com/aces/Loris/blob/16.1-dev/modules/candidate_list/test/candidate_listTest.php)
3. Any other existing [Loris module](https://github.com/aces/Loris/blob/16.1-dev/modules/)

### 6) Run integration tests

Under ```$LORIS$/test/``` run:

```./integration.sh``` - runs tests for all modules

```./integration.sh $ModuleName$``` - runs test for a specific module

Expect the following output for passing and failing tests:
```bash

# Success
OK (1 test, 1 assertion)

# Fail
FAILURES!                          
Tests: X, Assertions: X, Errors: X.
```

### 7) Pray 🙏 

[...](https://en.wikipedia.org/wiki/List_of_prayers)

---

>This tutorial is provided to you by **[Alex](https://github.com/alisterdev)** with special thanks to **[Shen](https://github.com/kongtiaowang)**, StackOverflow and countless hours of debugging! 💪 