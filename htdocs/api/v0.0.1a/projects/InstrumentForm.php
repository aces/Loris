<?php
/**
 * This returns the instrument passed in by the Instrument GET parameter
 * and serializes it as JSON for the REST API.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  API
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
//Load config file and ensure paths are correct
set_include_path(
    get_include_path()
    . ":"
    .  __DIR__ . "../../../php/libraries"
);

// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../../../project/config.xml");


require_once 'NDB_BVL_Instrument.class.inc';
$Instrument = $_REQUEST['Instrument'];

$a = NDB_BVL_Instrument::factory($Instrument, null, null);

print $a->toJSON();
?>
