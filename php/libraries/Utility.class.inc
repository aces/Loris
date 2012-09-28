<?php
require_once 'PEAR.php';

/**
 * A set of (static) utility functions
 *
 * @access public
 * @package main
 */
class Utility extends PEAR
{
    /**
     * Builds a query string
     *
     * @param  array   Array of parameters to put into query string
     * @return string
     * @access public
     */
    function unparse_str ($params) {
        $str = '';
        foreach ($params as $key => $value) {
            if(is_array($value)) {
                foreach($value AS $vkey => $vval) {
                    $str .= (strlen($str) < 1) ? '' : '&';
                    $str .= $key . rawurlencode("[$vkey]") . '=' . rawurlencode($vval);
                }
            } else {
                $str .= (strlen($str) < 1) ? '' : '&';
                $str .= $key . '=' . rawurlencode($value);
            }
        }
        return ($str);
    }


    /**
     * Converts a multi-dimensional array to a one-dimensional array
     *
     * @param  array   The multi-dimensional array
     * @return string
     * @access public
     */
    function reduce($array)
    {
        $string = array_reduce($array, array('Utility', 'crunch'));
        return (!empty($string)) ? explode('`', $string) : array();
    }


    /**
     * Implodes a multi-dimensional array using array_reduce()
     *
     * @note           If any element of the array contains a backtick, you'll run into trouble
     * @param  mixed
     * @param  mixed
     * @return string
     * @access public
     */
    function crunch($x, $y)
    {
        $a = (is_array($x)) ? array_reduce($x, array('Utility', 'crunch')) : $x;
        $b = (is_array($y)) ? array_reduce($y, array('Utility', 'crunch')) : $y;
        return (!empty($a)) ? "$a`$b" : $b;
    }


    /**
     * computes an age in years:months:days (assumes 30 days per months)
     *
     * @param  string  date of birth (or first date), formatted YYYY-MM-DD
     * @param  string  date of testing (or second date), formatted YYYY-MM-DD
     * @return mixed   an array with keys 'year', 'mon', 'day' containing the computed age, or a PEAR::Error object
     * @access public
     * @static
     */
    function calculateAge($dob, $testdate)
    {
        if(!preg_match("/([0-9]{4})-?([0-9]{1,2})-?([0-9]{1,2})/", $dob, $matches)) {
            return PEAR::raiseError("Argument 1 does not match expected date format (YYYY-MM-DD)");
        }
        $dob = array('year'=>$matches[1], 'mon'=>$matches[2], 'day'=>$matches[3]);

        if(!preg_match("/([0-9]{4})-?([0-9]{1,2})-?([0-9]{1,2})/", $testdate, $matches)) {
            return PEAR::raiseError("Argument 2 does not match expected date format (YYYY-MM-DD)");
        }
        $testdate = array('year'=>$matches[1], 'mon'=>$matches[2], 'day'=>$matches[3]);

        if($testdate['day'] < $dob['day']) { $testdate['day']+= 30; $testdate['mon']--; }
        if($testdate['mon'] < $dob['mon']) { $testdate['mon']+= 12; $testdate['year']--; }

        $age = array('year'=>$testdate['year'] - $dob['year'],
                     'mon' =>$testdate['mon'] - $dob['mon'],
                     'day' =>$testdate['day'] - $dob['day']);

        return $age;
    }

    /**
     * Returns a list of available ethnicities that can be assigned to subjects
     *
     * @return array       an associative array("ethnicity" => "ethnicity")
     * @throws PEAR_Error
     * @access public
     * @static
     */
    function getEthnicityList()
    {
        $DB =& Database::singleton();

        // get the list of ethnicities
        $query = "SELECT DISTINCT Race as Ethnicity FROM ethnic WHERE Race <> ''";

        // execute the query
        $DB->select($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["Ethnicity"]] = $row["Ethnicity"];
        }
        return $list;
    }

     /**
     * Returns a list of existing ethnicities of all candidates
     *
     * @return array       an associative array("ethnicity" => "ethnicity")
     * @throws PEAR_Error
     * @access public
     * @static
     */
    function getListOfSubjectEthnicities()
    {
        $DB =& Database::singleton();

        // get the list of ethnicities
        $query = "SELECT DISTINCT Ethnicity FROM candidate WHERE Ethnicity NOT IN (NULL, '') ORDER BY Ethnicity";
        // execute the query

        $DB->select($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["Ethnicity"]] = $row["Ethnicity"];
        }
        return $list;
    }

    /**
     * Returns a list of study sites
     *
     * Study site if a site that actively collects study data
     *
     * @params bool        return only study sites, or not
     * @throws PEAR_Error
     * @return array       an associative array("center ID" => "site name")
     * @access public
     * @static
     */
    function getSiteList($study_site = true)
    {
        $DB =& Database::singleton();

        // get the list of study sites - to be replaced by the Site object
        $query = "SELECT CenterID, Name FROM psc ";
        if ($study_site) {
                $query .= "WHERE Study_site='Y'";
        }


        $DB->select($query, $result);
        if(PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

       // fix the array
       $list = array();
       foreach ($result as $row) {
           $list[$row["CenterID"]] = $row["Name"];
       }
       return $list;
    }


	function getAssociativeSiteList($study_site = true, $DCC = true)
	{
	 $DB =& Database::singleton();

        // get the list of study sites - to be replaced by the Site object
	        $query = "SELECT CenterID, Name FROM psc ";
        	if ($study_site) {
            	$query .= "WHERE Study_site='Y'";
        	}	
		if (!$DCC)
		$query .= "AND Name != 'DCC'";

        	$DB->select($query, $result);
        	if(PEAR::isError($result)) {
            		return PEAR::raiseError("DB Error: ".$result->getMessage());
        	}

        	// fix the array
        	$list = array();
        	foreach ($result as $row) {
         	   	$list[$row["CenterID"]] = $row["Name"];
       	 	}
        	return $list;
	}

    function getVisitList()
    {
        $DB =& Database::singleton();

         $query = "SELECT Visit_label from Visit_Windows";

         $DB->select($query, $result);
         if(PEAR::isError($result)) {
             return PEAR::raiseError("DB Error: ".$result->getMessage());
         }

         $list = array();
         foreach ($result as $row) {
             $list[$row["Visit_label"]] = $row["Visit_label"];
         }
         return $list;
     }


    /**
     * Returns a list of study Subprojects
     * @throws PEAR_Error
     * @return array       an associative array("SubprojectID" => "Subproject title")
     * @access public
     * @static
     */
    function getSubprojectList()
    {
        $config =& NDB_Config::singleton();

        // get the list of Subprojects
        $subprojectSettings= $config->getSetting('subprojects');
        foreach(Utility::toArray($subprojectSettings['subproject']) AS $subproject){
    		$list[$subproject['id']]=$subproject['title'];
    	}
        return $list;
    }
    
    /**
     * Returns the test name associated with a given commentID
     * @throws PEAR_Error
     * @return string
     * @access public
     * @static
     */
    function getTestNameByCommentID($commentID)
    {
        $db =& Database::singleton();
        
        $query = "SELECT Test_name FROM flag WHERE CommentID='$commentID'";
        $testName = $db->selectOne($query);
        
        if(PEAR::isError($testName)) {
            return PEAR::raiseError("Could not get test name: ".$testName->getMessage());
        }
        
        return $testName;
    }
    
    /**
     * Cleans a string to make it safe for variables and such
     * @param  string  the string to clean
     * @return string  the cleaned string
     * @access public
     * @static
     */
    function getCleanString($string)
    {
        $string = trim($string);
        $string = str_replace('  ', ' ', $string);
        $string = str_replace(' ', '_', $string);
        $string = str_replace("'", '', $string);
        $string = str_replace('"', '', $string);
        $string = ereg_replace('[^A-Za-z0-9_/-]*', '', $string);
        $string = strtolower($string);
        return $string;
    }

    /**
     * Transforms a config structure (such as in PSCID) into a
     * Perl-compatible regex expression for validation
     *
     * @return string              the regex pattern
     * @param  array  $structure   the structure root
     * @param  string $siteAbbrev  the site abbreviation, sometimes used as part of the PSCID
     * @static
     * @access public
     */
    function structureToPCRE($structure, $siteAbbrev=null)
    {
        $seqs = $structure['seq'];
	// handle the situation where there exists only one seq
        if(isset($seqs['#'])) $seqs = array($seqs);
        $regex = "";
        foreach($seqs AS $seq) {
            $unit = "";

            switch($seq['@']['type']) {
            case 'alpha':
                $unit .= '[a-z]';
                break;

            case 'alphanumeric':
                $unit .= '[0-9a-z]';
                break;

            case 'numeric':
                $unit .= '[0-9]';
                break;

            case 'static':
                $unit .= '('.$seq['#'].')';
                break;

            case 'set':
                if(strpos($seq['#'], '|') !== false) {
                    $unit .= '('.$seq['#'].')';
                } else {
                    $unit .= '['.$seq['#'].']';
                }
                break;

            case 'siteAbbrev':
                $unit .= $siteAbbrev;
                break;
            } // end switch
            
            $length = "";
            if(isset($seq['@']['length'])) {
                $length .= $seq['@']['length'];
            } elseif(isset($seq['@']['minLength'])) {
                $length .= $seq['@']['minLength'];
            } else {
                $length .= '1';
            }

            $length .= ',';

            if(isset($seq['@']['length'])) {
                $length .= $seq['@']['length'];
            } elseif(isset($seq['@']['maxLength'])) {
                $length .= $seq['@']['maxLength'];
            } elseif(!isset($seq['@']['length']) && !isset($seq['@']['minLength'])) {
                $length .= '1';
            }

            $regex .= $unit.'{'.$length.'}';

        } // end foreach seq

        return '/^'.$regex.'$/i';
    }

    /**
     * merges two arrays recursively, overwriting values of the first
     * with the second.  the one "strange" bit is that if there exists
     * a set of 2 or more sibling elements with the same name, then
     * the entire set will be replaced rather than recursively merged.
     *
     * @param  array  $structure   the structure root
     * @param  string $siteAbbrev  the site abbreviation, sometimes used as part of the PSCID
     * @return string              the regex pattern
     * @static
     * @access public
     */
    function array_merge_recursive_overwriting($array1, $array2, $merged_array=null)
    {
        if (empty($merged_array)) $merged_array = $array1;
        foreach ($array2 AS $key=>$value) {
            if (is_array($array1[$key]) && isset($array1[$key][0])) {
                $merged_array[$key] = $value; 
            } elseif (is_array($array2[$key]) && !isset($array2[$key][0])) {
                Utility::array_merge_recursive_overwriting($array1[$key], $array2[$key], &$merged_array[$key]);
            } else {
                $merged_array[$key] = $value;
            }
        }
        return $merged_array;
    }
    
    /**
    * returns a list of bvl instruments
    * returns a list of instruments for a timepoint's stage ($stage). If no stage arg is passed, return the full list for all stages
    * @param int age in days
    * @param string study stage (screening or visit)
    * @return array list of instruments
    * @throws PEAR::error
    * @static
    * @access public
    */
    function lookupBattery($age, $stage=null)
    {
        $DB =& Database::singleton();

        // craft the select query
        $query = "SELECT t.Test_name FROM test_battery AS b, test_names AS t WHERE t.Test_name=b.Test_name AND b.AgeMinDays<='$age' AND b.AgeMaxDays>='$age' AND b.Active='Y'";

        if(!is_null($stage)) {
            $query .= " AND b.Stage='$stage'";
        }

        $query .= " GROUP BY Test_name ORDER BY Test_name";

        // get the list of instruments
        $rows = array();
        $tests = array();
        $DB->select($query, $rows);
        if(PEAR::isError($rows)) {
            fwrite(STDERR, "Could not lookup battery from database: ".$rows->getMessage());
            return false;
        }

        // repackage the array
        foreach($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    }
    
    //toArray ensures that $var is a collection of $var elements, not just a single element
    //If this makes no sense to you, examine the way the xml parser deals with multiple elements of the same name.
    //Note: This does not change a string into an array with one string element
    function toArray($var){
        if(!isset($var[0])) {
            $var = array($var);
        }
        return $var;
    }
    
    //asArray ensures that $var is a collection elements, not just a single element
    //Not the same as toArray, apparently.
    function asArray($var){
        if(!is_array($var)) {
            return array($var);
        }
        return $var;
    }
    
    //Explodes an encapsulted, delimited string like 'hello','my name is \'bob\'', 'etc'
    function explodeEncapsulated($seperator, $delimiter, $string){
		$state=0;
		$output=$string;
		$output_index=0;
	
		for($i=0;$i<strlen($string);$i++){
			switch($string[$i]){
				case $delimiter:
					if($string[$i-1]!="\\"){
    					$output=substr_replace($output,"",$output_index, 1);
    					$output_index--;
    				}
    			break;
    			
    			case $seperator:
    				if($state%2==0){
    					$output=substr_replace($output,"{@}",$output_index, 1);
    					$output_index+=2;
    				}
    			break;
			}
			$output_index++;
		}
		$output=str_replace("\\".$delimiter, $delimiter, $output);
		return explode("{@}",$output);
    }
    
    
	//From php.net    
	function arrayMergeKeepKeys() {
	     $arg_list = func_get_args();
	     foreach((array)$arg_list as $arg){
	         foreach((array)$arg as $K => $V){
	             $Zoo[$K]=$V;
	         }
	     }
	   return $Zoo;
	}

    // Replace the empty string with null in specified field
    // in an array passed in as an argument. This undoes the
    // damaged that Smarty causes by making nulls in a dropdown
    // the empty string.
    // This is needed before calling $db->insert() on any integer
    // fields, because mysql considers '' to be 0, not null if
    // the database column is of type integer.
    function nullifyEmpty(&$arr, $field) {
        if($arr[$field] === '') {
            $arr[$field] = null;
        }
        return $arr;
    }
	// from php.net comments
	function in_array_insensitive($item, $array) {
	    $item = &strtoupper($item);
	    foreach($array as $element) {
	        if ($item == strtoupper($element)) {
	            return true;
	        }
	    }
	    return false;
	}
   
    function Flatten($Arr) {
        return $Arr['Test_name'];
    }

    function FlattenFull($Arr) {
        return $Arr['Full_name'];
    }

    function getAllInstruments() {
        $DB =& Database::singleton();
        $DB->select("SELECT Test_name FROM test_names", &$instruments_q);
                                
        // This array_map call turns the result of the above query to
        // a non-associative array, so that we can use the array_combine
        // trick to get an array of the form array( 'test_name' => 'test_name')
        // which can be used by quickforms for the dropdown. The array_merge
        // call after that just adds an Any/All Instruments option.
        $in = array_map(array('Utility', 'Flatten'), $instruments_q);
        $instruments = array_combine($in, $in);
        return $instruments;

   }
   
   	function getColumnThresholdCount(){
   	    $config =& NDB_Config::singleton();
		// get the list of Subprojects
		$column_threshold= $config->getSetting('columnThreshold');
		return $column_threshold;
	}


    /**
     * Checks to see if the given table exists
     *
     * @param unknown_type $options
     * @param unknown_type $table
     * @param unknown_type $name
     * @return unknown
     */
    function ColumnExists($test_name,$column)
    {
        $config =& NDB_Config::singleton();
        $database = $config->getSetting('database');
        $query = "SELECT DISTINCT table_name FROM information_schema.columns WHERE table_name = :tn and COLUMN_NAME = :cn and TABLE_SCHEMA = :db";
        $DB =& Database::singleton();
        $effected = $DB->pselectOne($query,array('tn'=>$test_name,'cn'=>$column, 'db'=>$database));
        if ($effected) {
            return true;
        }
        return false;
    }

    /**
     * Returns the Visit Label for a given commentID
     * @throws PEAR_Error
     * @return string  visitlabel
     * @access public
     * @static
     */
    function getVisitLabelUsingTestName($test_name)
    {
        $db =& Database::singleton();
        $query = "SELECT DISTINCT s.visit_label FROM session s
            JOIN flag f ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.Candid = s.Candid)
            JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE s.Active = 'Y' AND c.Active= 'Y' AND f.Test_name = :tn AND psc.Centerid!= '1'";

        $visitlabels = $db->pselect($query,array('tn'=>$test_name));
        if(PEAR::isError($visitlabels)) {
            return PEAR::raiseError("Could not get visit label: ".$visitlabels->getMessage());
        }
        return $visitlabels;
    }
    /**
     * looks up the test_name for the current full name
     *
     * @return string        test_name of the instrument
     * @access public
     */

    function getTestNameUsingFullName($fullname)
    {
        $db =& Database::singleton();
        //print_r($instument);
        $instrument = $db->pselect("SELECT Test_name FROM test_names WHERE Full_name =:fname",array('fname'=>$fullname));
        if(is_array($instrument) && count($instrument)) {
            //$full_name = $names[0]
            list(,$test_name) = each($instrument[0]);
        }
        return $test_name;
    }

    /**
     * Returns all the sourcefrom instruments from parameter_type (which exist in the data_integrity flag table) using the test_names
     * full_name
     *
     * @return unknown
     */
    function getSourcefrom()
    {
        $DB =& Database::singleton();

        $sourcefrom = $DB->pselect("SELECT DISTINCT t.Full_name FROM parameter_type pt
                JOIN data_integrity_flag di ON (pt.Name = di.Name)
                JOIN test_names t ON (t.test_name = pt.sourcefrom)
                WHERE pt.sourcefrom IS NOT NULL
                ORDER BY t.Full_name",array());

        foreach ($sourcefrom as $table) {
            if (!is_null($table)) {
                $result[$table['Full_name']] = $table['Full_name'];
            }
        }
        return $result;
    }

    /**
     * Returns all the sourcefrom instruments from parameter_type
     *
     * @return unknown
     */
    function getSourcefields($instrument=null,$commentID=null,$name=null)
    {
        $DB =& Database::singleton();
        //get sourcefield using instrument
        if (!is_null($instrument)) {
            $sourcefields = $DB->pselect("SELECT SourceField, Name FROM parameter_type WHERE queryable = '1' AND sourcefrom = :sf ORDER BY Name ", array('sf'=>$instrument));
        } elseif (!is_null($commentID)) { //get sourcefield using commentid
            $instrument = $DB->pselectOne("SELECT Test_name FROM flag WHERE CommentID = :cid" , array('cid'=>$commentID));
            $sourcefields = $DB->pselect("SELECT SourceField, Name FROM parameter_type WHERE queryable = '1' AND sourcefrom = :instrument ORDER BY Name ", array('instrument'=>$instrument));
        } elseif (!is_null($name)) { //get all source fields
            $sourcefields = $DB->pselectRow("SELECT * FROM parameter_type WHERE Name = :pn", array('pn'=>$name));
        } else {
        }
        return $sourcefields;
    }
    

	/**
     * Returns a list of study Visit Labels
     * @throws PEAR_Error
     * @return array  an array("" => "visit_label")
     * @access public
     * @static
     */
	function getExistingVisitLabels()
	{
		$db =& Database::singleton();
		$query = "SELECT DISTINCT Visit_label FROM session s 
		 JOIN candidate c ON (s.CandID = c.Candid) 
		 JOIN psc ON (s.CenterID = psc.CenterID)
		 WHERE c.Active = 'Y' AND s.Active = 'Y' AND c.PSCID NOT LIKE '%scanner%' AND psc.CenterID!= '1' ORDER BY VisitNo";
		$db->select($query,$visitlabels);
		$visits = array();
		for ($i =0 ;$i<count($visitlabels) ; $i++){
			$visits[$visitlabels[$i]['Visit_label']] = ($visitlabels[$i]['Visit_label']);
		}
		return $visits;
	}
	
	
		
	/**
	 * *
	 * get all the instruments for the given visit...
	 * @param unknown_type $visit
	 * @return unknown
	 */
	function getVisitInstruments($visit_label){
		$DB =& Database::singleton();
	
		if (Utility::ColumnExists('test_battery', 'Test_name_display')) {
			$test_names = $DB->pselect("SELECT distinct Test_name_display from test_battery where Visit_label =:vl",array('vl'=>$visit_label));
		} else {
			 $test_names= $DB->pselect("SELECT DISTINCT t.Full_name as Test_name_display FROM session s
			JOIN candidate c ON (c.candid=s.candid)
			JOIN psc ON (s.CenterID = psc.CenterID)
			JOIN flag f ON (f.sessionid=s.id)
			JOIN test_names t ON (f.test_name=t.Test_name)
			WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl AND psc.CenterID != '1' AND c.PSCID != '%scanner%' ORDER BY t.Full_name ",array('vl'=>$visit_label));
		}
		
		if (PEAR::isError($test_names)) {
			return PEAR::raiseError("DB Error: ".$instruments->getMessage());
		}
		return $test_names;
	}

}
?>
