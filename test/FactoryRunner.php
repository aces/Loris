#!/usr/bin/php
<?php
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once('simpletest/autorun.php');
        
$test = new TestSuite('NDB_Factory factory tests');
$test->addFile('tests/NDB_Factory_test.php');
?>
