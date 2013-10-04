#!/usr/bin/php
<?php
require_once("simpletest/web_tester.php");
require_once('simpletest/reporter.php');
require_once('simpletest/autorun.php');
        
$test = new TestSuite('Direct Data Entry tests');
$test->addFile('tests/DirectDataEntry.php');
// Autorun runs, no need to do it manually..
//exit ($test->run($Reporter) ? 0 : 1);
?>
