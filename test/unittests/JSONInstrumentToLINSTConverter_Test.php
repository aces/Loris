<?php

class JSONInstrumentToLINSTConverter_Test extends \PHPUnit_Framework_TestCase
{
    /**
     * @test
     * @covers JSONInstrumentToLINSTConverter::convert
     */
    function testConvert() {
        $year = "2017";

        $EXPECTED_RESULT = implode("\n", [
            "table{@}wasi",
            "title{@}WASIIII",
            "date{@}Date_taken{@}Date of Administration{@}2006{@}{$year}",
            "static{@}Candidate_Age{@}Candidate Age (Months)",
            "static{@}Window_Difference{@}Window Difference (+/- Days)",
            "select{@}Examiner{@}Examiner{@}NULL=>''",
            "static{@}{@}Label1",
        ]);

        $json = '
        {
          "Meta": {
            "InstrumentVersion": "v0.0.1",
            "InstrumentFormatVersion": "v0.0.3-dev",
            "ShortName": "wasi",
            "LongName": "WASIIII",
            "IncludeMetaDataFields": true
          },
          "Elements": [
            {
              "Type": "label",
              "Description": {
                "en-ca": "Label1"
              },
              "Options": {}
            }
          ]
        }
        ';

        $this->assertEquals(
            $EXPECTED_RESULT,
            JSONInstrumentToLINSTConverter::convert($json, 'en-ca', $year)
        );
    }
    /**
     * @test
     * @covers JSONInstrumentToLINSTConverter::generateStandardLines
     */
    function generateStandardLines() {
        $table = 'wasi';
        $title = 'Wechsler Abbreviated Scale of Intelligence';
        $year  = '2017';

        $EXPECTED_RESULT = [];
        $EXPECTED_RESULT[] = "table{@}{$table}";
        $EXPECTED_RESULT[] = "title{@}{$title}";
        $EXPECTED_RESULT[] = "date{@}Date_taken{@}Date of Administration{@}2006{@}{$year}";
        $EXPECTED_RESULT[] = "static{@}Candidate_Age{@}Candidate Age (Months)";
        $EXPECTED_RESULT[] = "static{@}Window_Difference{@}Window Difference (+/- Days)";
        $EXPECTED_RESULT[] = "select{@}Examiner{@}Examiner{@}NULL=>''";

        $this->assertEquals(
            $EXPECTED_RESULT,
            JSONInstrumentToLINSTConverter::generateStandardLines($table, $title, $year)
        );
    }

    /**
     * @test
     * @covers JSONInstrumentToLINSTConverter::convertLabelElement
     */
    function convertLabelElement() {
        $labelElement = array(
            "Type" => "label",
            "Description" => array(
                "en-ca" => "English Label",
                "fr-ca" => "Label français",
            ),
            "Options" => array()
        );

        $this->assertEquals(
            "static{@}{@}English Label",
            JSONInstrumentToLINSTConverter::convertLabelElement($labelElement, 'en-ca')
        );
    }

    /**
     * @test
     * @covers JSONInstrumentToLINSTConverter::convertSelectElement
     */
    function convertSelectElementSingle() {
        $selectElement = array(
            "Type" => "label",
            "Name" => "s1",
            "Description" => array(
                "en-ca" => "English Label",
                "fr-ca" => "Label français",
            ),
            "Options" => array(
                "Values" => array(
                    "en-ca" => array(
                        "1" => "Option 1",
                        "2" => "Option 2",
                    ),
                    "fr-ca" => array(
                        "1" => "Option 1",
                        "2" => "Option 2"
                    )
                ),
                "AllowMultiple" => false,
                "RequireResponse" => false
            )
        );

        $this->assertEquals(
            "select{@}s1{@}Label français{@}NULL=>''{-}'1'=>'Option 1'{-}'2'=>'Option 2'",
            JSONInstrumentToLINSTConverter::convertSelectElement($selectElement, 'fr-ca')
        );
    }

    /**
     * @test
     * @covers JSONInstrumentToLINSTConverter::convertSelectElement
     */
    function convertSelectElementMultiple() {
        $selectElement = array(
            "Type" => "label",
            "Name" => "s1",
            "Description" => array(
                "en-ca" => "English Label",
                "fr-ca" => "Label français",
            ),
            "Options" => array(
                "Values" => array(
                    "en-ca" => array(
                        "1" => "Option 1",
                        "2" => "Option 2",
                    ),
                    "fr-ca" => array(
                        "1" => "Option 1",
                        "2" => "Option 2"
                    )
                ),
                "AllowMultiple" => true,
                "RequireResponse" => false
            )
        );

        $this->assertEquals(
            "multiselect{@}s1{@}Label français{@}NULL=>''{-}'1'=>'Option 1'{-}'2'=>'Option 2'",
            JSONInstrumentToLINSTConverter::convertSelectElement($selectElement, 'fr-ca')
        );
    }

    /**
     * @test
     * @covers JSONInstrumentToLINSTConverter::convertSelectElementOptions
     */
    function convertSelectElementOptions() {
        $options = array(
            "1" => "Option 1",
            "2" => "Option 2",
        );

        $this->assertEquals(
            "NULL=>''{-}'1'=>'Option 1'{-}'2'=>'Option 2'",
            JSONInstrumentToLINSTConverter::convertSelectElementOptions($options)
        );
    }
}
?>
