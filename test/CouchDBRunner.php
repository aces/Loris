#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once('simpletest/autorun.php');
        
/*
$Reporter = new TextReporter();
if($argv[$argc-1] == '-xml') {
    $Reporter = new XMLTimeReporter();
}
 */
$test = new TestSuite('CouchDB Database wrapper tests');
$test->addFile('tests/CouchDB_test.php');
$test->addFile('tests/CouchDBImport.php');
// Autorun runs, no need to do it manually..
//exit ($test->run($Reporter) ? 0 : 1);
