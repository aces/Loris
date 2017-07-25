<?php
/**
 * JSON Instrument class tests
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Test
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */



/**
 * JSON Instrument class tests
 *
 * @category Tests
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_Instrument_JSON_Test extends PHPUnit_Framework_TestCase
{
    protected function setUp()
    {
        parent::setUp();
    }

    public function testInlineCalcFormulas()
    {
        
        $ELEMENTS = [
            [
              "Name" => "a",
              "Type" => "select",
            ],
            [
              "Name" => "b",
              "Type" => "calc",
              "Formula" => "2 + 2",
            ],
            [
              "Name" => "c",
              "Type" => "calc",
              "Formula" => "[a] + [b]",
            ],
            [
              "Name" => "d",
              "Type" => "calc",
              "Formula" => "[c] - 3",
            ]
        ];

        $EXPECTED = [
            [
              "Name" => "a",
              "Type" => "select",
            ],
            [
              "Name" => "b",
              "Type" => "calc",
              "Formula" => "2 + 2",
            ],
            [
              "Name" => "c",
              "Type" => "calc",
              "Formula" => "[a] + (2 + 2)",
            ],
            [
              "Name" => "d",
              "Type" => "calc",
              "Formula" => "([a] + (2 + 2)) - 3"
            ]
        ];

        $this->assertEquals(
          $EXPECTED,
          \Loris\Behavioural\NDB_BVL_Instrument_JSON::inlineCalcFormulas($ELEMENTS)
        );
    }

    public function testInlineCalcFormulasCircularReference() {


    }
}
