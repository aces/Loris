#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
        
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
$Reporter = new TextReporter();
$test = new TestSuite('Core LORIS tests');
// Generally test functionality. Database class, permissions,
// instruments save
$test->addFile('tests/CoreFunctionality.php');
// Test individual components
$test->addFile('tests/NewProfile.php');
$test->addFile('tests/CandidateList.php');
// Project specific tests..
$test->addFile('tests/SiteSpecific.php');
exit ($test->run($Reporter) ? 0 : 1);
