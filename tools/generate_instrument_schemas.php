<?php
/**
 *
 */

// require all relevant OO class libraries
require_once __DIR__ . "/../vendor/autoload.php";
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
require_once "../php/libraries/NDB_BVL_Instrument.class.inc";

class generate_instrument_schemas
{
	/**
	 * Takes JSON as a string and dumps the data into an array.
     *
     * @param string $json		A string of JSON elements
	 *
	 * @return array
     */
	function decodeJSON($json)
    {
        return json_decode($json, true);
    }

	/**
	 * Takes an array of JSON elements and returns corresponding
	 * SQL schema statements.
	 *
	 * @param array $elements	The array of parsed JSON elements
     *
     * @return string
	 */
	function generateSchema($elements)
	{
		//Handle meta info
		$metaInfo = $elements['Meta'];
		$tableName = $metaInfo[2];
        
		//Handle individual elements
		foreach($elements['Elements'] AS $element) {
		    switch($element['Type']) {
                case "label":
                break;
                case "radio-label":
                break;
                case "radio":

                case "text":

                case "checkbox":

                case "

                case "
            }
		}
	}
?>
