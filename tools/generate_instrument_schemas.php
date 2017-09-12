<?php
/**
 *
 */

class schema_generator 
{
	/**
	 * Takes JSON as a string and dumps the data into an array.
     *
     * param string $json		A string of JSON elements
	 *
	 * return array
     */
	function decodeJSON($json)
    {
        return json_decode($json, true);
    }

	/**
	 * Takes an array of JSON elements and returns corresponding
	 * SQL schema statements.
	 *
	 * param array $elements	The array of parsed JSON elements
     *
     * return string
	 */
	function generateSchema($elements)
	{
		//Handle meta info
		$metaInfo = $elements['Meta'];
		$tableName = htmlspecialchars($metaInfo['ShortName']);
        $fullName = htmlspecialchars($metaInfo['LongName']['en-ca']);
        
        $output = '';
        $output .= "DROP TABLE IF EXISTS `$tableName`;\n";
        $output .= "CREATE TABLE `$tableName` (\n";
        $output .= "`CommentID` varchar (255) NOT NULL DEFAULT '',\n";
        $output .= "`UserID` varchar(255) DEFAULT NULL,\n";
        $output .= "`Examiner` varchar(255) DEFAULT NULL,\n";
        $output .= "`Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON ";
        $output .= "UPDATE CURRENT_TIMESTAMP,\n";
        $output .= "`Data_entry_completion_status` enum('Incomplete','Complete') ";
        $output .= "NOT NULL DEFAULT 'Incomplete',\n";
        $output .= "`Date_taken` date DEFAULT NULL,\n";
        $output .= "`Candidate_Age` varchar(255) DEFAULT NULL,\n";
        $output .= "`Window_Difference` int(11) DEFAULT NULL,\n";

		//Handle individual elements
		foreach($elements['Elements'] AS $element) {
            $switchType = htmlspecialchars($element['Type']);
			switch($switchType) {
                case "label":
                    continue 2;
                    break;
                case "radio-labels":
                    continue 2;
                    break;
            }
            $elName = htmlspecialchars($element['Name']);
            switch($switchType) {
                case "radio":
                    $enumOpts = $element['Options']['Values']['en-ca'];
                    if(isset($element['Options']['AllowMultiple'])) {
                        $allowMult = $element['Options']['AllowMultiple'];
                    } else {
                        $allowMult = false;
                    }
                    if(!$allowMult) {
                        $type = $this->enumizeOptions($enumOpts);
                    } else {
                        $type = "TEXT";
                    }
                    break;
                case "select":
                    $enumOpts = $element['Options']['Values']['en-ca'];
					if(isset($element['Options']['AllowMultiple'])) {
                        $allowMult = $element['Options']['AllowMultiple'];
                    } else {
                        $allowMult = false;
                    }
                    if(!$allowMult) {                    
                        $type = $this->enumizeOptions($enumOpts);
                    } else {
                        $type = "TEXT";
                    }
                    break;
                case "text":
                    $type = "TEXT";
                    break;
                case "checkbox":
                    $type = "TEXT";
                    break;
                case "calc":
                    $type = "TEXT";
                    break;
                case "date":
                    $type = "date";
                    break;
                default:
                    echo("unhandled type: $switchType\n");
                    continue 2;
                    break;
            }
            $type = htmlspecialchars($type);
            $output .= "`$elName` $type DEFAULT NULL,\n";
		}

        $output .= "PRIMARY KEY (`CommentID`));\n";
        $output .= "INSERT INTO test_names (Test_name, Full_name, Sub_group, IsDirectEntry) VALUES ('$tableName', \"$fullName\", 1, 1);";
        return $output;
	}
    
    /*
     * Takes an array of values to be enumerized as options for a field
     *
     * param array $values     The array of values
     *
     * return string
     */
    function enumizeOptions($values)
    {
        $enumValues = implode(",", array_map(function($val) {
                                                 return "'$val'";
                                             }, array_keys($values)));
        return "enum($enumValues)";
    }
}
?>
