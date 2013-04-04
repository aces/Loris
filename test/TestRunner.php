#!/usr/bin/php
<?php
/**
 * This file runs all loris tests from the tests subdirectory
 *
 * PHP Version 5
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     http://www.loris.ca
 *
 *
 */
require_once 'simpletest/web_tester.php';
require_once 'simpletest/reporter.php';
        
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
