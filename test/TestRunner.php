#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once("xmltime.php");
        
$Reporter = new TextReporter();
if($argv[$argc-1] == '-xml') {
    $Reporter = new XMLTimeReporter();
}
$test = &new GroupTest('Core LORIS tests');
// Generally test functionality. Database class, permissions,
// instruments save
$test->addTestFile('tests/CoreFunctionality.php');
// Test individual components
$test->addTestFile('tests/CandidateList.php');
$test->addTestFile('tests/NewProfile.php');
// Project specific tests..
$test->addTestFile('tests/SiteSpecific.php');
exit ($test->run($Reporter) ? 0 : 1);
