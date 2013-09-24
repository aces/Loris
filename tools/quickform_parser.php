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


//Ensure php version compatability
//taken from php.net notes
if (version_compare(phpversion(),'4.3.0','<')) 
{
    define('STDIN',fopen("php://stdin","r"));
    register_shutdown_function( create_function( '' , 'fclose(STDIN);
    fclose(STDOUT); fclose(STDERR); return true;' ) );
}


// PEAR::Config
require_once "Config.php";


//allow instruments to find libraries
set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// define which configuration file we're using for this installation
$configFile = "../project/config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(PEAR::isError($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config =& $configObj->toArray();
$config = $config['config'];
unset($configObj, $root);

// require all relevant OO class libraries
require_once "Database.class.inc";
require_once "NDB_Config.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "Candidate.class.inc";


////////instruments to be excluded
 
$instrumentsToSkip = array();
$instruments = getExcludedInstruments();
foreach ($instruments as $instrument) {
    if (isset($instrument)) {
        $instrumentsToSkip[] = $instrument;
    }
}

/*
 * new DB Object
 */
$DB =& Database::singleton($config['database']['database'], $config['database']['username'], $config['database']['password'], $config['database']['host']);
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
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
    ereg("class (.+) extends NDB_BVL_Instrument", $data, $matches);
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
    
    if(!empty($output)){$output.="{-@-}";}
    
    echo "Parsing instrument object...\n";
    
    $output.="table{@}".$obj->table."\n";
    
    $output.="title{@}".$obj->getFullName()."\n";
    
    $output.=parseElements($obj->form->_elements);
    echo "Parsing complete\n---------------------------------------------------------------------\n\n";
}
$fp=fopen("ip_output.txt","w");
fwrite($fp,$output);
fclose($fp);
    
function parseElements($elements, $groupLabel=""){
    global $obj;
    foreach($elements AS $element){
        $label=$element->_label!="" ? str_replace("&nbsp;","",$element->_label) : $groupLabel;
        switch(strtolower(get_class($element))){
            case "html_quickform_select":
                $output.="select";
                if($element->getMultiple()) {
                    $output.="multiple";
                } 
                $output.="{@}".$element->_attributes['name']."{@}".$label."{@}";
                $optionsOutput="";
                foreach($element->_options AS $option){
                    if(!empty($optionsOutput)){$optionsOutput.="{-}";}
                    if(is_null($option['text']) || $option['text']===''){
                        $optionsOutput.="NULL";
                    } else {
                        $optionsOutput.="'".$option['attr']['value']."'";
                    }
                    $optionsOutput.="=>'".addslashes($option['text'])."'";
                }
                $output.=$optionsOutput."\n";
            break;
            
            case "html_quickform_text":
                $output.="text{@}".$element->_attributes['name']."{@}".$label."\n";
            break;
            
            case "html_quickform_textarea":
                $output.="textarea{@}".$element->_attributes['name']."{@}".$label."\n";
            break;
            
            case "html_quickform_date":
                if($element->_options['format']=="H:i"){
                    $type="time";
                } else {
                    $type="date";
                }
                $output.="$type{@}".$element->_name."{@}".$label."{@}".$element->_options['minYear']."{@}".$element->_options['maxYear']."\n";
            break;
            
            case "html_quickform_group":
                $output.=parseElements($element->_elements, $label);
            break;
            
            case "html_quickform_header":
                $output.="header{@}".$element->_attributes['name']."{@}".$element->_text."\n";
            break;
            
            case "html_quickform_static":
                //see how static element is used...
                if(($element->_attributes['name'] == null) || array_key_exists($element->_attributes['name'], $obj->localDefaults)) {
                    //element is plain form text, or a header.
                    $output.="header{@}";
                }
                else{
                    //element reports a database score
                    $output.="static{@}";
                }
                //add the element info
                $output.=$element->_attributes['name']."{@}".$element->_label."\n";
                
            break;
            
            case "html_quickform_advcheckbox":
                $output.="checkbox{@}".$element->_attributes['name']."{@}".$element->_label."\n";
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

            case "html_quickform_html":
            case "html_quickform_file":
            case "html_quickform_hidden":
                    // skip because it's useless
                    echo "SKIP: skipping quickform element type: ".get_class($element)."\n";
            break;
            
            default:
                echo "WARNING:  Unknown quickform element type: ".get_class($element)."\n";
            break;
        }
    }
    return $output;
    //print_r($obj->form);
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
