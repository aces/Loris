#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once('simpletest/autorun.php');
set_include_path(get_include_path().":../php/libraries:");
        
$test = &new TestSuite('CouchDB Database wrapper tests');
$test->addFile('tests/CouchDBWrapper.php');
$test->addFile('tests/CouchDBImport.php');
// Autorun runs, no need to do it manually..
//exit ($test->run($Reporter) ? 0 : 1);
