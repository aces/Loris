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
		$tableName = $metaInfo['ShortName'];
        
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
                        $type = "varchar(255)";
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
                        $type = "varchar(255)";
                    }
                    break;
                case "text":
                    $type = "varchar(255)";
                    break;
                case "checkbox":
                    $type = "varchar(255)";
                    break;
                case "calc":
                    $type = "varchar(255)";
                    break;
                case "date":
                    $type = "date(10)";
                    break;
                default:
                    echo("unhandled type: $switchType\n");
                    continue 2;
                    break;
            }
            $type = htmlspecialchars($type);
            $output .= "`$elName` $type DEFAULT NULL,\n";
		}

        $output .= "PRIMARY KEY (`CommentID`))";
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
                                                 if (is_string($val)) {
                                                     return "$val";
                                                 }
                                                 return "'$val'";
                                             }, array_keys($values)));
        return "enum($enumValues)";
    }
}
?>
