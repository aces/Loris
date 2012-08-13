#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once('simpletest/autorun.php');
require_once("xmltime.php");
        
$Reporter = new TextReporter();
if($argv[$argc-1] == '-xml') {
    $Reporter = new XMLTimeReporter();
}
$test = &new TestSuite('CouchDB Database wrapper tests');
$test->addFile('tests/CouchDBWrapper.php');
exit ($test->run($Reporter) ? 0 : 1);
