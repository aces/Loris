#!/data/web/neurodb/software/bin/php
<?php

/**
 * This parses all of the instruments and generates a staging file (ip_output.txt) which can
 * be used by data_dictionary_builder.php and generate_tables_sql.php
 * 
 * ex cmd: find ../project/instruments/*.inc | php quickform_parser.php
 * 
 * @package behavioural
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");

require_once __DIR__ . "/../vendor/autoload.php";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");

$instrumentsToSkip = array();
$instruments = getExcludedInstruments();
foreach ($instruments as $instrument) {
    if (isset($instrument)) {
        $instrumentsToSkip[] = $instrument;
    }
}

//Get the list of files from STDIN
while($file=fgets(STDIN)){
    $file=trim($file);
    $files[]=$file;
    echo $file;
}

//Process the files
foreach($files AS $file){
    echo "\n";
    $fp=fopen($file, "r");
    $data=fread($fp, filesize($file));
    fclose($fp);
    preg_match("/class (.+) extends NDB_BVL_Instrument/", $data, $matches);
    if(empty($matches[1])){
        echo "File '$file' does not contain an instrument.\n";
        continue;
    }
    echo "Reading file $file\n";
    $className=$matches[1];
    echo "Instrument found: $matches[1]\n";
    echo "Requiring file...\n";
    require_once($file);
    echo "Instantiating new object...\n";
    $obj=new $className;
    echo "Initializing instrument object...\n";
    $obj->setup(NULL,NULL);

    //Some instruments ought not be parsed with the quickform_parser 
    if ((in_array($obj->testName, $instrumentsToSkip))) { 
        echo "quickform_parser will	skip file {$file}\n"; 
        continue;
    }

    $subtests=$obj->getSubtestList();
    foreach($subtests as $subtest){
        $obj->page=$subtest['Name'];
        echo "Building instrument page '$subtest[Name]'...\n";
        $obj->_setupForm();
    }
    
    if(!empty($output)){
        $output.="{-@-}";
    } else {
        $output = '';
    }
    
    echo "Parsing instrument object...\n";
    
    $output.="table{@}".$obj->table."\n";
    
    $output.="title{@}".$obj->getFullName()."\n";
    
    $formElements = $obj->form->toElementArray();
    $output.=parseElements($formElements["elements"]);
    echo "Parsing complete\n---------------------------------------------------------------------\n\n";
}
$fp=fopen("ip_output.txt","w");
fwrite($fp,$output);
fclose($fp);
    
function parseElements($elements, $groupLabel=""){
    global $obj;
    $output = '';
    foreach($elements AS $element){
        $label=$element['label']!="" ? str_replace("&nbsp;","",$element['label']) : $groupLabel;
        $label=trim(preg_replace('/\s+/', ' ',$label));
        switch($element['type']){
            case "select":
                $output.="select";
                if(array_key_exists('multiple', $element)) {
                    $output.="multiple";
                }
                $output.="{@}".$element['name']."{@}".$label."{@}";
                $optionsOutput="";
                foreach($element['options'] AS $key => $option){
                    if (!empty($optionsOutput)) {
                        $optionsOutput.="{-}";
                    }
                    if(is_null($option) || $option===''){
                        $optionsOutput.="NULL";
                    } else {
                        $optionsOutput.="'".$key."'";
                    }
                    $optionsOutput.="=>'".addslashes($option)."'";
                }
                $output.=$optionsOutput."\n";
            break;
            
            case "text":
                $output.="text{@}".$element['name']."{@}".$label."\n";
            break;
            
            case "textarea":
                $output.="textarea{@}".$element['name']."{@}".$label."\n";
            break;
            
            case "date":
                $options = "{@}";
                if (array_key_exists('options', $element)) {
                    $options = $element['options']['minYear']."{@}".$element['options']['maxYear'];
                }
                $output.="date{@}".$element['name']."{@}".$label."{@}".$options."\n";
            break;
            
            case "group":
                $output.=parseElements($element['elements'], $label);
            break;
            
            case "header":
                $name = '';
                if (array_key_exists('name', $element)) {
                    $name = $element['name'];
                }
                $output.="header{@}".$name."{@}".$element['label']."\n";
            break;
            
            case "static":
                //see how static element is used...
                if(!array_key_exists('name', $element)) {
                    $output.="header{@}{@}".$label."\n";
                } elseif (($element['name'] == null) || array_key_exists($element['name'], $obj->localDefaults)
                    || $element['name'] =='lorisSubHeader') {
                    //element is plain form text, or a header.
                    $output.="header{@}".$element['name']."{@}".$label."\n";
                }
                else{
                    //element reports a database score
                    $output.="static{@}".$element['name']."{@}".$label."\n";
                }
                
            break;
            
            case "advcheckbox":
                $output.="checkbox{@}".$element['name']."{@}".$label."\n";
            break;
            
        case "html_quickform_radio":
            $mainquestion = addslashes($element->_label);
            $optionfield = addslashes($element->_text);
            if ($element->_attributes['position'] == "first") {
                $output.= "radio{@}";
                $output.= $element->_attributes['name'] . "{@}";
                $output.= $mainquestion . "{@}";
            }
            $output.= "'" . $element->_attributes['value'] 
                   . "'=>'" . $optionfield . "'";
            if ($element->_attributes['position'] == "last") {
                $output.="\n";
            } else {
                $output.="{-}";
            }
        break;

            case "html":
            case "file":
            case "hidden":
                    // skip because it's useless
                    echo "SKIP: skipping quickform element type: ".$element['type']."\n";
            break;
            
            default:
                echo "WARNING:  Unknown quickform element type: ".$element['type']."\n";
            break;
        }
    }
    return $output;
}

/**
 * Get the excluded instruments from the config file
 *
 * @return Array   List of instruments to be skipped
 */
function getExcludedInstruments()
{

    // Get the abbreviated instruments
    $config =& NDB_Config::singleton();
    $excluded_instruments = $config->getSetting('excluded_instruments');
    
    $ex_instruments=array();
    foreach ($excluded_instruments as $instruments) {
        foreach (Utility::asArray($instruments) as $instrument) {
            $ex_instruments[$instrument] = $instrument;
        }

    }
    return $ex_instruments;
}

?>
