# **Unit Testing 101: How to Write Tests for LORIS**


## Written: Summer 2019 for LORIS 21


###  Alexandra Livadas, Google Summer of Code

#### _[with reference to PHPUnit Manual (8.3)](https://phpunit.readthedocs.io/en/8.3/)_

 

---


This guide was written as part of Google Summer of Code.  It is for LORIS developers or anyone working with LORIS who wants to contribute unit tests to the LORIS codebase (github.com/aces/Loris) and learn best practices for setting up and writing unit tests. 

Note that integration tests are run by Travis via GitHub and out of the scope of this guide.


## Setup

**<span style="text-decoration:underline;">A note on Branching:</span>** LORIS test development should be done on the _major_ branch by convention.  However links in this guide sometimes point to the branch holding the latest release (_master)_.


### **Setting up your Test Dev Environment**

A very similar set-up guide can be found in the [README.md](https://github.com/aces/Loris/blob/master/test/README.md) in the test directory. 

**All steps below should be conducted under loris root path `/var/www/loris` as _lorisadmin_**



1. Ensure that NodeJS is installed by running `node -v` under LORIS root directory. If not, follow the installation instructions [here](https://nodejs.org/en/download/package-manager/).
2. Docker Engine needs to be installed by following the official [Docker instructions](https://docs.docker.com/install/). It is recommended to use Docker’s “[Convenience scripts](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-convenience-script)” under the [Ubuntu Community](https://docs.docker.com/install/linux/docker-ce/ubuntu/) section because Docker is only being used for a test-dev setup. 

	Test that it installed by running: `sudo docker run hello-world`

3. Create a [Docker Group](https://docs.docker.com/install/linux/linux-postinstall/). Otherwise, anything Docker-related will need to be run with `sudo`.
    1. The VM must be restarted (exit and log back in) for the changes to take effect.
    2. Test that it worked by running: <code>docker run hello-world </code>
4. Docker Compose should be installed by running the following commands:

     ```
     curl -L https://github.com/docker/compose/releases/download/1.8.1/docker-compose-`uname -s`-`uname -m` > ~/docker-compose
     chmod +x ~/docker-compose
     sudo mv ~/docker-compose /usr/local/bin/docker-compose
     ```


5. Run `npm install`

Now the test-dev environment should be ready!

Run the command `npm run tests:unit` to execute all unit tests. The first time this command is run, **it will take time** for the environment to be setup. Every time after this, it will take a lot less time.


### **How to Run Tests**

To run all unit tests under [test/unittests](https://github.com/aces/Loris/tree/major/test/unittests), use the command below. (Run this from the LORIS root directory and NOT inside the test directory.)


   `npm run tests:unit`


This command can be made more specific:



*   To run the unit tests of a specific class:

    `npm run tests:unit -- --filter Candidate`


*   To run a specific unit test:

    `npm run tests:unit -- --filter Candidate::testValidatePSCID`


*   To run the unit tests in debug mode:

    `npm run tests:unit --debug OR npm run tests:unit:debug`



This is an example of what will show up when the unit tests are executed:
```
PHPUnit 6.5.14 by Sebastian Bergmann and contributors.

Runtime:       PHP 7.2.21
Configuration: /app/test/phpunit.xml

....................................I..........................  63 / 285 ( 22%)
............................................................... 126 / 285 ( 44%)
......................................SSSS..................... 189 / 285 ( 66%)
............................................................... 252 / 285 ( 88%)
.................................                               285 / 285 (100%)

Time: 2.54 seconds, Memory: 14.00MB

```


`.` → Successful unit test

`I` → Incomplete test

`S` → Skipped test

`F` → Failure

`E` → Error

If any tests produce a failure or error, a big red error message will appear in the output. The details of all incomplete and skipped tests will be listed below the summary section. See “The Basics” section below for more information on incomplete and skipped tests. 



#### **How does this command work?**

`npm run tests:unit` is a script specified in the package.json file in your LORIS root directory. It is defined as: 


`"tests:unit": "./test/dockerized-unit-tests.sh"`


So, the script runs the contents of [test/dockerized-unit-tests.sh](https://github.com/aces/Loris/blob/major/test/dockerized-unit-tests.sh). If we take a look at this file, it runs the unit tests using docker-compose and vendor/bin/phpunit. It specifies which tests to run with this line: 


`--configuration test/phpunit.xml --testsuite LorisUnitTests $*`


The list of tests to run is defined in [test/phpunit.xml](https://github.com/aces/Loris/blob/major/test/phpunit.xml) under the “LorisUnitTests” testsuite section. If you look at this testsuite block, you can see that it refers to every file in the ./test/unittests/ directory!


### **Troubleshooting**
**General Errors:**

If  the _major_ branch has been updated on the Loris repo, and your test-dev environment is now out of sync (branch and/or database) you will see seemingly unrelated errors like: 	

Example A:


`Fatal error:  Uncaught LorisNoSuchModuleException`


Example B:

`E: Package 'mysql-client' has no installation candidate \
ERROR: Service 'unit-tests' failed to build: The command '/bin/sh -c apt-get update &&     `	

**How to fix:**

You will need to update your environment to the major branch: 

Rebase your branch and update your database. It is convenient to reload a backup of your database and then run the patches needed to update it to _major_, but only do this if nothing else is working!

After rebasing, you will need to run these commands, which resets your docker-compose environment. 


```
       sudo docker-compose down
       sudo docker image rm $(sudo docker images -aq) -f
```


Then, run `npm run tests:unit` again. The tests will take longer to run because the docker-compose environment has to re-compile. 


## The Basics

Unit tests are meant to test small units of the codebase. The idea is that if each small function is actively being tested, it will be easier to avoid larger errors and it will also make finding and fixing bugs a lot easier. So, the first thing to keep in mind is that unit tests should not be long or complicated bits of code! 


### **Class Definition**

Every unit test class should extend the _TestCase_ class from the PHPUnit framework. So, before your class definition, be sure to include this line of code:


```
    use PHPUnit\Framework\TestCase;
```


Then, define your class:


```
    class ExampleTest extends TestCase
    {
    }
```



### **Naming Conventions**

The name of the individual unit test must start with the word **‘test’** to be considered. For example, something like `testAddDate` works, but `addDateTest` does not. 

All unit tests should be declared **public**.


### **The setUp function**

This function is called **before** each unit test in the class is run. This is where you can set up variables that you know will be used in every test, like constants or mock objects. Even if there are no variables to set up, you still need to write a generic method or you will get an error. Here is the generic setUp method, which calls the parent _setUp_ method from the _TestCase_ phpunit class:


```
    protected function setUp()
    {
        parent::setUp();
    }
```



### **The tearDown function**

This function is called **after** each unit test is run. If any variables or objects need to be reset or cleared before running the next test, it should be done here. Generally, if a mock factory or database was used, it should be reset here after every test (an example of this can be found in the “Testing Queries” section). Similarly to the setUp function explained above, the generic tearDown function will simply call its parent from the _TestCase_ class:


```
    protected function tearDown()
    {
        parent::tearDown();
    }
```



### **Incomplete tests**

[PHPUnit Documentation](https://phpunit.readthedocs.io/en/8.3/incomplete-and-skipped-tests.html#incomplete-tests)

If a test is incomplete or not working correctly and you would like to return to it later, the test can be marked as incomplete. The test will not be run but it will be marked as incomplete so that it can be easily found later.

To mark a test as incomplete, this line of code should be included as the first line in the function:


```
$this->markTestIncomplete("This test is incomplete (or something more specific)");
```


The message will appear on the command line when the unit tests are executed to specify which test is incomplete and why. **Code below this line does not have to be commented out or deleted because the test aborts as soon as it hits that line.**


### **Skipped tests**

[PHPUnit Documentation](https://phpunit.readthedocs.io/en/8.3/incomplete-and-skipped-tests.html#skipping-tests)

Skipped tests can be useful when a test can only be run in certain environments. For example, if there is a test that can only be run when in sandbox mode, there can be some sort of check that skips the test if it is not being run in that mode. 

Here is an example of this, taken from [Loris_PHPUnit_Database_TestCase.php](https://github.com/aces/Loris/blob/master/test/unittests/Loris_PHPUnit_Database_TestCase.php):


```
    //if not in sandbox mode do not run tests
    if (!$this->factory->settings(CONFIG_XML)->isSandbox()) {
        $this->markTestSkipped(
            "You are not in 'sandbox' mode.
                This is a destructive test, it will be skipped!"
        );
    }
```


**Again, code below this line in the test does not have to be commented out or deleted.**


## Specific Test Types


### **Data Providers**

[PHPUnit documentation](https://phpunit.readthedocs.io/en/8.2/writing-tests-for-phpunit.html#data-providers)

Example Implementation: [test/unittests/UtilityTest.php::testCalculateAgeFormat](https://github.com/aces/Loris/blob/major/test/unittests/UtilityTest.php#L200)

Data providers are used to provide an array of different inputs to a test. 

_Useful to Test:_

1. Methods that perform calculations -- test multiple inputs and their outputs.
    1. If the method you are testing is a pure function which takes parameters and returns a value, the data provider should return an array of tuples of the form 
    **[param1, param2, .., result]**
2. Methods that change an input’s format, like a “toArray” method
3. Methods that require a specific format for their input **(example used below)**

_In the “provider” function:_ Return an array with whatever input to “feed” the test. 

_In the test function:_ Declare the data provider in the function comment. Then, declare the inputs as parameters for that test. 

_Fact:_ The comment the data provider is declared in **MUST** start with `/**` or it will not work. 
_Example implementation (from UtilityTest.php):_


```
    /**
     * Test that the calculateAge() method fails
     * when the dates have the incorrect format
     *
     * @param string $first  string with the badly formatted date of birth
     * @param string $second string with the badly formatted current date
     *
     * @dataProvider ageIncorrectFormatProvider
     * @covers       Utility::calculateAge
     *
     * @return void
     */
    public function testCalculateAgeFormat($first, $second)
    {
        $this->expectException('\LorisException');
        $array = Utility::calculateAge($first, $second);
    }

    /**
     * Data provider for testCalculateAgeFormat
     *
     * @return void
     */
    public function ageIncorrectFormatProvider()
    {
        return array(
            array("1990\\07\\05", "2018\\05\\23"),
            array("1990", "2018"),
            array("1990_07_05", "2019_09_65"),
            array(" ", " "),
        );
    }
```



### **Test Doubles (Mocking)**

[PHPUnit Documentation](https://phpunit.readthedocs.io/en/8.3/test-doubles.html#)

_Useful to test:_
 Beyond testing database queries (discussed later), creating a test double of some object is most useful when you would like **to test that a method gets called**, but you do not need to test the actual logic of the method. 

The two methods used to create test doubles are `createMock($type)` and `getMockBuilder($type)`. The method used most often within LORIS is `getMockBuilder()`, because it is more customizable. 

Here is the simplest example of how to create a test double:


```
$form = $this->getMockBuilder('LorisForm')
            ->getMock();
```


This is a mock LorisForm object. If you do not specify which LorisForm methods it would like to mock, it will be able to use all of them. 

The getMockBuilder function is very customizable, and the different options are explained in more detail in the PHPUnit documentation. Two custom methods are very useful for our purposes: 

`disableOriginalConstructor(): `If you are creating a mock of an object whose constructor requires some arguments, you can disable the constructor if it is unnecessary to specify the arguments for a given test. 

`setMethods():` If your mock object only needs to use a short list of the LorisForm class methods, you can specify these in an array. 


```
$form = $this->getMockBuilder('LorisForm')
                 ->disableOriginalConstructor()
                 ->setMethods(array('addStatic'))
                 ->getMock();
```


Here is the most common example of a unit test that can be run with this mock object:


```
public function testAddStaticIsCalled()
{
    $form->expects($this->any())
        ->method('addStatic')
        ->with(
            $this->equalTo($someName), $this->equalTo($someLabel)
        )
        ->willReturn("addStatic was called with the correct params!");

    $this->assertEquals(
        "addStatic was called with the correct params!", 
        $form->addElement('static', $someName, $someLabel)
    );
}
```


This tests that when LorisForm::addElement() is called with the ‘static’ parameter, the addStatic method is called. 

`expects:` specifies how many times the addStatic function is expected to be called.

`with:` checks that the arguments being passed to the mock method are as expected. 

`willReturn:` specifies what “fake” output you would like the mock object to return once this method is called. Since this is a mock object, the method will not return anything on its own, so you can specify what you would like it to return for your test. 

This can be used for almost any class within LORIS. In the section right below, there is more detail on how to use test doubles to test database queries. 


### **Testing Queries**

To know before starting: if you encounter a user/database object declaration like this: 


```
    $DB   = \Database::singleton();
    $user = \User::singleton();
```


Please update the code to use this LORIS standard declaration:


```
    $factory = NDB_Factory::singleton();
    $DB      = $factory->database();
    $user    = $factory->user();
```


This will make testing a lot easier. See issues #[4989](https://github.com/aces/Loris/issues/4989), #[5015](https://github.com/aces/Loris/issues/5015)

**There are 2 ways to test a query.** Pick method 1 if you want to test which queries get called and pick method 2 if you want to test the result of specific queries. It’s important to be consistent because they are set up differently.



**1. With the ‘pselect’-style database method**

   Example implementation: [test/unittests/UtilityTest.php](https://github.com/aces/Loris/blob/major/test/unittests/UtilityTest.php) -- Not including the first 2 tests!


	

**When to use this:** This test is a “pure” unit test because there are no external dependencies involved. It should be used when you would like **to test that the correct query is being called**. 

As will be explained, the database is a mock and so you decide what the query returns. Therefore, you cannot test the logic of the query with this method. 

The **setUp** method, where you declare the necessary mock objects:
```
protected function setUp(): void
{ 
    parent::setUp();

    //Create a mock NDB_Config and Database
    $this->_configMock =  $this->getMockBuilder('NDB_Config')->getMock();
    $this->_dbMock     = $this->getMockBuilder('Database')->getMock();


    //This factory object will act as the factory used in the method being tested 
    $this->_factory = NDB_Factory::singleton();

    //Set the Config and Database values for the factory to be the mock objects 
    $this->_factory->setConfig($this->_configMock); 
    $this->_factory->setDatabase($this->_dbMock); 
}
```

	
**You then need to reset the factory object every time a test is finished** so that it can 
be re-defined again in the setUp method. This is done in the tearDown method: 


```
protected function tearDown()
{
    parent::tearDown();
    $this->_factory->reset();
}
```


Everything is now setup so we can write tests. 

The Database class comes with methods such as `pselect`, `pselectRow`, `pselectWithIndexKey` that allow you to run MySQL queries. So, when a method calls 
these methods, such as here:


```
$query = "SELECT Test_name FROM flag WHERE CommentID=:CID"; 
$testName = $db->pselectOne($query, array('CID' => $commentID));
```

you can “mock” this method call and decide what it returns. 

Below is an example of a test for the above query. Check out the comments within the code for detailed explanations of the steps:


```
public function testExample()
{
    /**
     * 'expects': set how many times you are expecting a function to be called
     * 'method': specify the function that you are expecting to be called
     * 'with': checks that the query being called contains some string
     * 'willReturn': specify what the function will return when called. Since we are
     *               mocking the database, the query won't actually return anything
     */
    $this->_dbMock->expects($this->any())
        ->method('pselectOne')
        ->with(
            $this->stringContains(
                "SELECT Test_name FROM flag WHERE CommentID=:CID"
            )
        )
        ->willReturn("test_flag1");

    $this->assertEquals(
         "test_flag1",
         Utility::getTestNameByCommentID("ID123")
    );
}
```

**2. With the ‘setFakeTableData’ database method**

Example implementation: [test/unittests/UserTest.php](https://github.com/aces/Loris/blob/major/test/unittests/UserTest.php)

**This is not a ‘pure’ unit test because it does not use a mock database! Instead, you are
essentially creating a database object and inputting fake tables into it, which means that these tests usually take longer to execute.**

**When to use this:** This method is useful when you would like to test the actual logic of the query. Since you are inserting tables into your fake database, you can test that the query returns the correct output given the table information you have included. 

The **setUp** method, where you declare the necessary objects:

```
protected function setUp(): void \
{
    parent::setUp();

    $this->_factory = \NDB_Factory::singleton();
    $this->_factory->reset();
    $this->_factory->setTesting(false);
    
    $this->_configMock = $this->_factory->Config(CONFIG_XML);
    $database          = $this->_configMock->getSetting('database');
	
    $this->_dbMock     = \Database::singleton(
        $database['database'],
        $database['username'],
        $database['password'],
        $database['host'],
        true
    );

} 

```
As you can see, the `$this->_dbMock` object is now declared as a `\Database::singleton() ` rather than as a mock object. This is why it is not a pure unit test and why we cannot use the same “expects” method as in the previous section. 

	
The **tearDown** function is the same as before:


```
protected function tearDown()
{
    parent::tearDown();
    $this->_factory->reset();
}
```

Since we are using a “real” database here, instead of using the `expects` method, we will instead be putting fake tables into the database object and then testing that if a query is run on this database, the correct information is returned given what is in the fake tables. 

**To add a fake table:**

 Check out the comments within the code for detailed information!


```
private $_userInfo = array('ID'         => 1, 
                           'Password'   => 'pass123',
                           'Real_name'  => 'John Doe',
                           'First_name' => 'John',
                           'Last_name'  => 'Doe');

/**
 * The setFakeTableData method is found in php/libraries/Database.class.inc
 * First parameter: table name
 * Second parameter: array of table information.
 *                   The array should be numeric, where 0 points to the first entry 
 *                   in the table, which itself is an array with all
 *                   the table columns specified!
 */
$this->_dbMock->setFakeTableData(
    "users",
    array(0 => $this->_userInfo)
);

```


**To remove a fake table:**

Tables **do not need** to be removed when they are no longer being used. 


`$this->_dbMock->run("DROP TEMPORARY TABLE users");`


              

   **Changing table information from test to test:** 

There is no way to update the information in the fake table, so instead you need to drop the entire table and re-add it with the new information. 


```
$this->_dbMock->run("DROP TEMPORARY TABLE users");
$this->_dbMock->setFakeTableData(
    "users",
    array(0 => $this->_changedInfo)
);
```

**Important:**

**The table should only be added once**. So, setFakeTableData should never be included in the setUp method because you will get a “Table already exists” error after the first test is run. If you create some helper method, like “_setUpFakeTables” that adds tables that will be used in every test, **it should still only be run once**, like in the first test. See [test/unittests/UserTest.php](https://github.com/aces/Loris/blob/major/test/unittests/UserTest.php) on the major branch for an example. 


 Once the tables that the query uses are added, you can test the method as normal, and 	the query should run on the “fake” database you’ve created!


### **Testing Exceptions**

[PHPUnit Documentation](https://phpunit.readthedocs.io/en/8.3/writing-tests-for-phpunit.html#testing-exceptions)

This can be used to test that when a method is called with certain parameters or under certain conditions, some exception will be called. 

If a method throws a \LorisException when called with a certain parameter, something like this could test that functionality:


```
public function testExample()
{
$this->expectException('\LorisException');
$this->exampleObject->exampleFunction(incorrectParam);
}
```


If that exception is not thrown, the test will fail with this error message:


```
Failed asserting that exception of type "\LorisException" is thrown. 
```

