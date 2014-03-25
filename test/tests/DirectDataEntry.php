<?php
require_once __DIR__ . '/../test_includes.php';
require_once __DIR__ . '/../../htdocs/submit.php';

Mock::generate('Database');
Mock::generatePartial('DirectDataEntryMainPage', 'DirectDataEntryMainPageRunPartial', array('initialize', 'display', 'getCommentID'));

class TestOfDirectDataEntry extends UnitTestCase {
    function setUp() {
        //$this->config = NDB_Config::singleton();
    }

    function tearDown() {
    }


    function testDirectDataEntryMain() {
        $Page = new DirectDataEntryMainPageRunPartial();
        $Page->expectOnce('initialize');
        $Page->expectOnce('display');
        $Page->run();
    }
}
?>
