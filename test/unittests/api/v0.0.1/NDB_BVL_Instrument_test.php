<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';

if(!class_exists('\NDB_BVL_Instrument_test')) {
    // NDB_BVL_Instrument::factory() directly calls "new $class",
    // so instead of using the PHP Unit mocking, we need to just
    // create a new class that does what we want. Namely, nothing.
    class NDB_BVL_Instrument_test extends \NDB_BVL_Instrument {
        function __construct() {
        }

        function save() {
            return true;
        }

        function _hasAccess() {
            return true;
        }

        function toJSON() {
            return '{ "Test" : "Test" }';
        }
    };
}
?>
