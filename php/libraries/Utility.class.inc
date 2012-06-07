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
        function Flatten($Arr) {
            return $Arr['Test_name'];
        }
        $in = array_map('Flatten', $instruments_q);
        $instruments = array_combine($in, $in);
        return $instruments;

    }


}
?>
