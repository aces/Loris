#!/usr/bin/env php
<?php
/**
 * Purpose:
 * This script automatically generates the following tables from ip_output.txt
 *    - parameter_type
 *    - parameter_type_category
 *    - parameter_type_category_rel
 *
 * These tables (now referred to as the parameter_type.* tables) are the data
 * dictionary for Loris.
 *
 * Input:
 * data_dictionary_builder.php takes as input the ip_output.txt file (generated
 * by lorisform_parser.php) and inserts records for each field of each
 * discovered NDB_BVL_Instrument. To be complete, this tool must be run on an
 * ip_output.txt file that was constructed from all instruments.
 *
 * *
 * * WARNING THIS FILE ACTIVELY AFFECTS THE DATABASE INDICATED BY CONFIG.XML.
 * * READ THE SCRIPT FIRST AND MODIFY AS NECESSARY.
 * *
 *
 * Functioning:
 * Currently, this script deletes all entries in parameter_type.* relating to
 * parameter_type_category.Type='Instrument' and regenerates them.
 * parameter_type primary keys (ParameterTypeID) are preserved though
 * parameter_type_category primary keys ARE NOT preserved.  Entries relating
 * to parameter_type_category.Type Metafields or manually entered custom fields
 * of parameter_type_category.Type != 'Instrument' are preserved.
 *
 * Further Improvements:
 * It is recommended that this script be changed to be intelligent about its
 * methods, possibly with command line options that allow it to be more
 * selective about its actions and deletion targets.
 *
 * Usage:
 *    php data_dictionary_builder.php
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$parameter_types = [];
$instrumentParameterTypeCategoryIDs = [];
$instrumentParameterTypeIDs         = [];

$parameter_types = $DB->pselectColWithIndexKey(
    "SELECT pt.Name, pt.ParameterTypeID
    FROM parameter_type pt
        JOIN parameter_type_category_rel ptcr USING (ParameterTypeID)
        JOIN parameter_type_category ptc USING (ParameterTypeCategoryID)
    WHERE ptc.Type = 'Instrument'",
    [],
    "Name"
);

// 2 query to clear all old parameter_type data associated to instruments.
// This data will be rebuilt below and IDs will be preserved when possible using
// the data queried above. Note, a single multi-join query fail with MySQL 5.7
$DB->run(
    "DELETE parameter_type,  parameter_type_category_rel
    FROM parameter_type
    JOIN parameter_type_category_rel USING (ParameterTypeID)
    WHERE ParameterTypeCategoryID IN (
       SELECT ParameterTypeCategoryID
       FROM parameter_type_category
       WHERE Type = 'Instrument'
    );"
);

$DB->delete("parameter_type_category", ["Type" => "Instrument"]);

print "Cleared data from BVL instruments\n";

print "Reading instruments\n";
//Read the ip_output.txt staging file.
$fp = fopen(__DIR__."/../ip_output.txt", "r");
if (!$fp) {
    print "There was an issue opening the ip_output file. Ensure the
    file exists and the permissions are properly set.\n";
    die();
}
$data = fread($fp, filesize(__DIR__."/../ip_output.txt"));
fclose($fp);


print "Parsing instruments\n";
$instruments =explode("{-@-}", trim($data));

//process all HTML_QuickForm Elements found in ip_output.txt
$tblCount       = 0;
$parameterCount = 0;
// Array holding all inserted names in memory to avoid inserting duplicates
$parameterNames = [];

foreach ($instruments AS $instrument) {
    $catId    = "";
    $table    = "";
    $testname = "";
    $items    = explode("\n", trim($instrument));
    foreach ($items AS $item) {
        $paramId = "";
        $bits    = explode("{@}", trim($item));
        switch ($bits[0]) {
        case "testname":
            $testname = $bits[1];
            print "Instrument: $testname\n";
            break;
        case "table":
            $table = $bits[1];
            //`testname` was only recently added to the lorisform parser, for
            //backwards compatibility, instruments with no testname parameter
            //should assume the testname from the `table` name (to maintain
            //status quo) although it might be incorrect since instrument names
            //and table names could be different by design.
            if (empty($testname)) {
                $testname = $table;
                print "Instrument: $testname\n";
            }
            break;

        case "title":
            $title = $bits[1];
            // Check if there's already an entry with the same name
            // insertIgnore does not work here since name
            // is not a Unique key in the database
            $catId = $DB->pselectOne(
                "SELECT ParameterTypeCategoryID
                       FROM parameter_type_category
                       WHERE Name=:name AND Type=:type",
                [
                    // htmlspecialchars() is necessary since data is escaped when
                    // inserted in the database but not escaped
                    // in the $title variable
                    "name" => htmlspecialchars($title),
                    "type" => "Instrument",
                ]
            );
            if (empty($catId)) {
                $DB->insert(
                    "parameter_type_category",
                    [
                        "Name" => $title,
                        "Type" => "Instrument",
                    ]
                );
                $catId = $DB->lastInsertID;
            }

            $tblCount++;
            break;

        case "header":
            break;

            //for HTML_QuickForm versions of standard HTML Form Elements...
        default:
            //continue; // jump straight to validity for debugging
            if (isset($bits[1]) && preg_match("/^Examiner/", $bits[1])) {
                // Treat examiner specially, since it's a select box but we need
                // to treat it as a varchar.
                // derive_timepoint_variables will derive
                // the name from the examiner id
                $bits[0] = "varchar(255)";
            } else if ($bits[0]=="select") {
                $bits[0] = enumizeOptions($bits[3], $testname, $bits[1]);
            } else if ($bits[0]=="textarea") {
                $bits[0] ="text";
            } else if ($bits[0]=="text") {
                $bits[0] ="varchar(255)";
            } else if ($bits[0]=="selectmultiple") {
                $bits[0] ="varchar(255)";
            } else if ($bits[0]=="checkbox") {
                $bits[0] ="varchar(255)";
            } else if ($bits[0]=="static") {
                $bits[0] ="varchar(255)";
            }

            // Skip lines that contains only label
            // or notes where bit[1] is empty.
            if (empty($bits[1])) {
                continue 2;
            }

            print "\tInserting $testname $bits[1]\n";
            $bits[2] = htmlspecialchars($bits[2]);
            //find values to insert
            $Name = $testname . "_" . $bits[1];
            if (in_array($Name, $parameterNames, true)) {
                // this specific table_field combination
                // was already inserted, skip.
                continue 2;
            }
            $parameterCount++;
            $query_params = [
                "Name"        => $Name,
                "Type"        => $bits[0],
                "Description" => $bits[2],
                "SourceField" => $bits[1],
                "SourceFrom"  => $testname,
                "Queryable"   => "1",
            ];

            // Check if the same element existed in the parameter_type table
            // before deleting the data.
            if (array_key_exists($Name, $parameter_types)) {
                //If element existed, reuse the same id
                $ParameterTypeID = $parameter_types[$Name];
                $query_params["ParameterTypeID"] = $ParameterTypeID;
            } else {
                //If it's new set it to empty string
                //and get the value from the insert below
                $ParameterTypeID = "";
            }

            $DB->insert(
                "parameter_type",
                $query_params
            );

            if ($ParameterTypeID === "") {
                // from DB
                $paramId = $DB->lastInsertID;
            } else {
                // from above
                $paramId = $ParameterTypeID;
            }

            $parameterNames[$paramId] = $query_params["Name"];
            $DB->insert(
                "parameter_type_category_rel",
                [
                    "ParameterTypeID"         => $paramId,
                    "ParameterTypeCategoryID" => $catId,
                ]
            );
        }
    }

    if (empty($testname)) {
        continue;
    }

    // INSTRUMENT VALIDITY
    print "\tInserting validity for $testname\n";
    $Name = $testname . "_Validity";

    if (in_array($Name, $parameterNames, true)) {
        // this specific table_validity combination was already inserted, skip.
        continue;
    }

    $_type_enum = "enum('Questionable', 'Invalid', 'Valid')";

    $query_params = [
        "Name"        => $Name,
        "Type"        => $_type_enum,
        "Description" => "Validity of $testname",
        "SourceField" => "Validity",
        "SourceFrom"  => $testname,
        "Queryable"   => "1",
    ];

    if (array_key_exists($Name, $parameter_types)) {
        $ParameterTypeID = $parameter_types[$Name];
        $query_params["ParameterTypeID"] = $ParameterTypeID;
    } else {
        $ParameterTypeID = "";
    }
    $DB->insert(
        "parameter_type",
        $query_params
    );
    if ($ParameterTypeID === "") {
        $paramId = $DB->lastInsertID;
    } else {
        $paramId = $ParameterTypeID;
    }

    $parameterNames[$paramId] = $query_params["Name"];
    $DB->insert(
        "parameter_type_category_rel",
        [
            "ParameterTypeID"         => $paramId,
            "ParameterTypeCategoryID" => $catId,
        ]
    );

    // INSTRUMENT ADMINISTRATION
    print "\tInserting administration for $testname\n";
    $Name = $testname . "_Administration";
    if (in_array($Name, $parameterNames, true)) {
        // this specific table__Administration combination
        // was already inserted, skip.
        continue;
    }

    $_type_enum   = "enum('None', 'Partial', 'All')";
    $query_params = [
        "Name"        => $Name,
        "Type"        => $_type_enum,
        "Description" => "Administration for $testname",
        "SourceField" => "Administration",
        "SourceFrom"  => $testname,
        "Queryable"   => "1",
    ];

    if (array_key_exists($Name, $parameter_types)) {
        $ParameterTypeID = $parameter_types[$Name];
        $query_params["ParameterTypeID"] = $ParameterTypeID;
    } else {
        $ParameterTypeID = "";
    }

    $DB->insert(
        "parameter_type",
        $query_params
    );

    if ($ParameterTypeID === "") {
        $paramId = $DB->lastInsertID;
    } else {
        $paramId = $ParameterTypeID;
    }

    $parameterNames[$paramId] = $query_params["Name"];
    $DB->insert(
        "parameter_type_category_rel",
        [
            "ParameterTypeID"         => $paramId,
            "ParameterTypeCategoryID" => $catId,
        ]
    );
}

//Copies the modified descriptions from the parameter_type_override to parameter_type
$elements = $DB->pselect(
    "SELECT * FROM parameter_type_override WHERE Description IS NOT NULL",
    []
);
foreach ($elements as $element) {
    $description = $element["Description"];
    $name        = $element["Name"];

    $DB->update(
        "parameter_type",
        ["Description" => $description],
        ["Name" => $name]
    );
}


//Print completion info message
echo "\n\nData Dictionary generation complete:  $tblCount new categories added"
    ." and $parameterCount new parameters added\n\n";

/**
 * Convert ip_output.txt format enums to MySQL format
 * enums
 *
 * @param string $options  The line of the ip_output.txt to enumize
 * @param string $testname The table containing this line
 * @param string $name     The name of the field being enumized
 *
 * @return string A valid MySQL format enum field string
 */
function enumizeOptions($options, $testname, $name)
{
    $options =explode("{-}", $options);
    foreach ($options as $option) {
        $option =explode("=>", $option);
        if ($option[0]!="NULL") {
            $enum[] =$option[0];
        }
    }
    if (!is_array($enum)) {
        echo "$testname $name $options\n";
    }
    $enum =implode(",", $enum);
    return "enum($enum)";
}
