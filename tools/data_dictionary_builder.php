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
 * by quickform_parser.php) and inserts records for each field of each
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
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");

require_once __DIR__ . "/../vendor/autoload.php";
$configFile = "../project/config.xml";
$client     = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);
$DB = Database::singleton();

// Set a user for the history table
if (!isset($_SESSION['State'])) {
    $_SESSION['State'] =& State::singleton();
}
$_SESSION['State']->setUsername(get_current_user());

// define which configuration file we're using for this installation
//Get the entries we already have in the DB
getColumns(
    "Select Name, ParameterTypeID from parameter_type",
    $DB,
    $parameter_types,
    array()
);

//Delete in the parameter_type table relating to
//parameter_type_category.Type = 'Instrument', without affecting other entries.
//get parameter_type_category.Type ='Instrument' ParamenterTypeCategoryIDs
getColumn(
    "SELECT ParameterTypeCategoryID
        FROM parameter_type_category
        WHERE Type = :in",
    $DB,
    $instrumentParameterTypeCategoryIDs,
    array('in' => 'Instrument')
);

if (!empty($instrumentParameterTypeCategoryIDs)) {
    // Prepare for the IN () SQL quandary
    $prepIn = prepareIn($instrumentParameterTypeCategoryIDs);

    //get all 'Instrument' ParameterTypeIDs
    getColumn(
        "SELECT ParameterTypeID
            FROM parameter_type_category_rel
            WHERE ParameterTypeCategoryID
            IN (" . $prepIn['query'] . ")",
        $DB,
        $instrumentParameterTypeIDs,
        $prepIn['array']
    );
    $instrumentParameterTypeIDString = implode(', ', $instrumentParameterTypeIDs);
}

if (!empty($instrumentParameterTypeIDString)) {
    //delete all 'Instrument' entries from parameter_type_category_rel
    $DB->run(
        "DELETE FROM parameter_type_category_rel
        WHERE ParameterTypeID in ($instrumentParameterTypeIDString)"
    );
}

if (!empty($instrumentParameterTypeCategoryIDString)) {
    //delete all 'Instrument' entries from parameter_type_category
    $DB->run(
        "DELETE FROM parameter_type_category
        WHERE ParameterTypeCategoryID IN ($instrumentParameterTypeCategoryIDString)"
    );
}

if (!empty($instrumentParameterTypeIDString)) {
    //delete all 'Instrument' entries from parameter_type
    $DB->run(
        "DELETE FROM parameter_type
        WHERE ParameterTypeID IN ($instrumentParameterTypeIDString)"
    );
}

print "Cleared data from BVL instruments\n";

print "Reading instruments\n";
//Read the ip_output.txt staging file.
$fp   =fopen("ip_output.txt", "r");
$data =fread($fp, filesize("ip_output.txt"));
fclose($fp);

print "Parsing instruments\n";
$instruments =explode("{-@-}", trim($data));

//process all HTML_QuickForm Elements found in ip_output.txt
$tblCount       =0;
$parameterCount =0;

foreach ($instruments AS $instrument) {
    $catId ="";
    $items =explode("\n", trim($instrument));
    foreach ($items AS $item) {
        $paramId ="";
        $bits    =explode("{@}", trim($item));
        switch($bits[0]){
        case "table":
            $table =$bits[1];
            print "At $table\n";
            break;

        case "title":
            $title  = $bits[1];
            $error  = $DB->insert(
                "parameter_type_category",
                array(
                 'Name' => $title,
                 'Type' => 'Instrument',
                )
            );
             $catId = $DB->lastInsertID;
             $tblCount++;
            break;

        case "header":
            continue;
            break;

            //for HTML_QuickForm versions of standard HTML Form Elements...
        default:
            //continue; // jump straight to validity for debugging
            if (isset($bits[1]) && preg_match("/^Examiner/", $bits[1])) {
                // Treat examiner specially, since it's a select box but we need
                // to treat it as a varchar. derive_timepoint_variables will derive
                // the name from the examiner id
                $bits[0] = "varchar(255)";
            } else if ($bits[0]=="select") {
                $bits[0] =enumizeOptions($bits[3], $table, $bits[1]);
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

            // Skip lines that containts only label or notes where bit[1] is empty.
            if (empty($bits[1])) {
                continue;
            }

            print "Inserting $table $bits[1]\n";
            $parameterCount++;
            $bits[2] = htmlspecialchars($bits[2]);
            //find values to insert
            $Name = $table . "_" . $bits[1];

            $query_params = array(
                             'Name'            => $Name,
                             'Type'            => $bits[0],
                             'Description'     => $bits[2],
                             'SourceField'     => $bits[1],
                             'SourceFrom'      => $table,
                             'CurrentGUITable' => 'quat_table_'
                                     . ceil(($parameterCount  - 0.5) / 200),
                             'Queryable'       => '1',
                            );

            if (array_key_exists($Name, $parameter_types)) {
                $ParameterTypeID = $parameter_types[$Name];
                $query_params['ParameterTypeID'] = $ParameterTypeID;
            } else {
                $ParameterTypeID = '';
            }

            $error = $DB->insert(
                "parameter_type",
                $query_params
            );
            print_r($error);
            if ($ParameterTypeID === '') {
                $paramId = $DB->lastInsertID;
            } else {
                $paramId = $ParameterTypeID;
            }
            $error = $DB->insert(
                "parameter_type_category_rel",
                array(
                 "ParameterTypeID"         => $paramId,
                 "ParameterTypeCategoryID" => $catId,
                )
            );
        }
    }

    if (empty($table)) {
        continue;
    }
    print "Inserting validity for $table\n";
    // Insert validity
    $Name = $table . "_Validity";

    $_type_enum = 'enum(\'Questionable\', \'Invalid\', \'Valid\')';
    $_CurrentGUITable_value = 'quat_table_' . ceil(($parameterCount  - 0.5) / 150);

    $query_params = array(
                     'Name'            => $Name,
                     'Type'            => $_type_enum,
                     'Description'     => "Validity of $table",
                     'SourceField'     => 'Validity',
                     'SourceFrom'      => $table,
                     'CurrentGUITable' => $_CurrentGUITable_value,
                     'Queryable'       => '1',
                    );

    if (array_key_exists($Name, $parameter_types)) {
        $ParameterTypeID = $parameter_types[$Name];
        $query_params['ParameterTypeID'] = $ParameterTypeID;
    } else {
        $ParameterTypeID = '';
    }
    $error =$DB->insert(
        "parameter_type",
        $query_params
    );
    if ($ParameterTypeID === '') {
        $paramId = $DB->lastInsertID;
    } else {
        $paramId = $ParameterTypeID;
    }
    $error = $DB->insert(
        "parameter_type_category_rel",
        array(
         "ParameterTypeID"         => $paramId,
         "ParameterTypeCategoryID" => $catId,
        )
    );
    // Insert administration
    print "Inserting administration for $table\n";
    $Name = $table . "_Administration";

    $_type_enum = 'enum(\'None\', \'Partial\', \'All\')';
    $_CurrentGUITable_value = 'quat_table_' . ceil(($parameterCount  - 0.5) / 150);
    $query_params           = array(
                               'Name'            => $Name,
                               'Type'            => $_type_enum,
                               'Description'     => "Administration for $table",
                               'SourceField'     => 'Administration',
                               'SourceFrom'      => $table,
                               'CurrentGUITable' => $_CurrentGUITable_value,
                               'Queryable'       => '1',
                              );

    if (array_key_exists($Name, $parameter_types)) {
        $ParameterTypeID = $parameter_types[$Name];
        $query_params['ParameterTypeID'] = $ParameterTypeID;
    } else {
        $ParameterTypeID = '';
    }

    $error = $DB->insert(
        "parameter_type",
        $query_params
    );
    if ($ParameterTypeID === '') {
        $paramId = $DB->lastInsertID;
    } else {
        $paramId = $ParameterTypeID;
    }
    $error =$DB->insert(
        "parameter_type_category_rel",
        array(
         "ParameterTypeID"         => $paramId,
         "ParameterTypeCategoryID" => $catId,
        )
    );
    // Insert examiner
}

//Copies the modified descriptions from the parameter_type_override to parameter_type
$elements = $DB->pselect(
    "SELECT * FROM parameter_type_override WHERE Description IS NOT NULL",
    array()
);
foreach ($elements as $element) {
    $description = $element['Description'];
    $name        = $element['Name'];

    $DB->update(
        'parameter_type',
        array('Description' => $description),
        array('Name' => $name)
    );
}


//Print completion info message
echo "\n\nData Dictionary generation complete:  $tblCount new categories added"
   ." and $parameterCount new parameters added\n\n";


//script specific utility functions
/**
 * Convert ip_output.txt format enums to MySQL format
 * enums
 *
 * @param string $options The line of the ip_output.txt to enumize
 * @param string $table   The table containing this line
 * @param string $name    The name of the field being enumized
 *
 * @return string A valid MySQL format enum field string
 */
function enumizeOptions($options, $table, $name)
{
    $options =explode("{-}", $options);
    foreach ($options as $option) {
        $option =explode("=>", $option);
        if ($option[0]!='NULL') {
            $enum[] =$option[0];
        }
    }
    if (!is_array($enum)) {
        echo "$table $name $options\n";
    }
    $enum =implode(",", $enum);
    return "enum($enum)";
}

/**
 * Runs a MySQL query and returns the result in
 *
 * @param string   $query     The SQL query to run
 * @param Database $DB        Reference to the Database object
 * @param array    $result    A reference to an array in which to
 * @param array    $preparray Values for the prepared statements
 *                         store the output.
 *
 * @return an array of the results of the query
 */
function getColumn($query, &$DB, &$result, $preparray)
{
    $TwoDArray = $DB->pselect($query, $preparray);
    foreach ($TwoDArray as $container=>$cell) {
        foreach ($cell as $key=>$value) {
            $result[] = $value;
        }
    }
    return $result;
}

/**
 * Builds an array parameterTypeID=>Name
 *
 * @param string   $query     The SQL query to run
 * @param Database $DB        Reference to the Database object
 * @param array    $result    A reference to an array in which to
 * @param array    $preparray Values for the prepared statements
 *                         store the output.
 *
 * @return array An array of the query where the index of the
 *               array is the ParameterTypeID and the value
 *               is the row from the query supplied.
 */
function getColumns($query, &$DB, &$result, $preparray)
{
    $TwoDArray = $DB->pselect($query, $preparray);
    foreach ($TwoDArray as $containers=>$cells) {
        $values = array_values($cells);
        $result[$values[0]] = $values[1];
    }
    return $result;
}

/**
 * Builds an array and a string to allow IN () to be prepared
 *
 * @param array $preparray Values for the prepared statements
 *
 * @return array   a string of keys for the query, and key value pairs to prepare
 */
function prepareIn($preparray)
{
    $varray = array();
    $karray = array();
    $i      = 0;

    foreach ($preparray as $value) {
        $key          = 'zqx' . $i;
        $karray[]     = ':' . $key;
        $varray[$key] = $value;
        $i++;
    }

    $result['query'] = implode(',', $karray);
    $result['array'] = $varray;
    return $result;
}

?>
