#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once("xmltime.php");
        
$Reporter = new TextReporter();
if($argv[$argc-1] == '-xml') {
    $Reporter = new XMLTimeReporter();
}
$test = &new TestSuite('Core LORIS tests');
// Generally test functionality. Database class, permissions,
// instruments save
$test->addFile('tests/CoreFunctionality.php');
// Test individual components
$test->addFile('tests/CandidateList.php');
$test->addFile('tests/NewProfile.php');
// Project specific tests..
$test->addFile('tests/SiteSpecific.php');
exit ($test->run($Reporter) ? 0 : 1);
