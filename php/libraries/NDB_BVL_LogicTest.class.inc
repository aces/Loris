<?
/**
 * This class performs a logic test on a behavioral instrument
 *
 * SAMPLE use in control_panel.inc:
 *
 * if(delt_show_completed($Test_name, $CommentID)) draw_completed_button();
 * else echo '&nbsp;';
 *
 * SAMPLE use to generate a report (run this before activating the change to control_panel.inc):
 *
 * foreach($list_of_tests AS $testname) {
 *   $changes = delt_check_test($testname);
 *   foreach($changes AS $row) {
 *     echo "$row[CandID]\t$testname\n";
 *   }
 * }
 * @package garbage
 */

class NDB_BVL_LogicTest
{
    
    var $logicTestInfo;
    
    static function &singleton($type, $test_name, $commentID=null)
    {
        static $logicTestList = array();

        $objectName = md5(sprintf("c%ss%si%s", $type, $test_name, $commentID));

        if(!isset($logicTestList[$objectName])) {
            
            $logicTestList[$objectName] = new NDB_BVL_LogicTest($type, $test_name, $commentID);
            
            $success = $logicTestList[$objectName]->setup($type, $test_name, $commentID);
            
            if (PEAR::isError($success)) {
                unset($logicTestList[$objectName]);
                return PEAR::raiseError($success->getMessage());
            }
        }
        
        return $logicTestList[$objectName];
    }
    
    /**
    * @return void
    * @throws PEAR::Error
    * @param string logic test type
    * @param string test_name
    * @param string instrument key, field flag.commentID
    */
    function setup($type, $test_name, $commentID=null)
    {
        if (empty($type)) {
            return PEAR::raiseError("Error: a Logic Test type is not defined");
        }
        if (empty($test_name)) {
            return PEAR::raiseError("Error: an instrument to submit to the Logic Test is not defined");
        }
        // save the type
        $this->logicTestInfo['type'] = $type;
        $this->logicTestInfo['test_name'] = $test_name;
        $this->logicTestInfo['commentID'] = $commentID;
    }
    
    function getType()
    {
        return $this->logicTestInfo['type'];
    }
    
    function getTestName()
    {
        return $this->logicTestInfo['test_name'];
    }
    
    function getCommentID()
    {
        return $this->logicTestInfo['commentID'];
    }
    
    function delt_create_where_string()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // test type emtpy
        
        $query = "SELECT Table_name, Field_name, Conditional_operator, Value from data_entry_logic_test WHERE Type = '".$this->getType()."' AND Test_name='".$this->getTestName()."'";
        
        $result = array();
        $db->select($query, $result);
        
        if(PEAR::isError($result)) {
            return PEAR::raiseError("Delt construct DBError: " . $result->getMessage());
        }

        // return emptiness if there aren't any checks
        if(count($result) <= 0) {
            return array('from'=>$this->getTestName(), 'where'=>'0');
        }
        
        // make array of data
        $where_string = "";
        
        // generate the where string
        foreach($result AS $row) {
            if(!empty($where_string))
            $where_string .= ' OR ';
            
            $where_string .= "$row[Table_name].$row[Field_name] $row[Conditional_operator] ";
            if($row['Value']=='NULL') $where_string .= $row['Value'];
            else $where_string .= "'$row[Value]'";
        }
        $where_string = "($where_string)";
        
        $from_array = array();
        // generate the from string
        foreach($result AS $row) {
            if($row['Table_name'] != $this->getTestName() && !in_array($row['Table_name'], $from_array)) $from_array[] = $row['Table_name'];
        }
        $from_string = join(', ', $from_array);
        
        // join all the tables
        foreach($from_array AS $table) {
            $where_string .= " AND $table.CommentID=".$this->getTestName().".CommentID";
        }
        
        $commentID = $this->getCommentID();
        if(!empty($commentID)) {
            $where_string = $this->getTestName().".CommentID='".$this->getCommentID()."' AND ".$where_string;
        }
        
        
        // add $Test_name to the from string.
        if(empty($from_string)) {
            $from_string = $this->getTestName();
        } else {
            $from_string = $this->getTestName().", ".$from_string;
        }
        
        return array('from'=>$from_string, 'where'=>$where_string);
    }
    
    /**
    * executes the login test. Select CommentID from the test table if there are problems, ie. records returned from the delt.
    * @param string test_name
    * @param string flag.CommentID
    * @throws PEAR::Error
    * @return array list of CommentIDs
    */
    function delt_check_test()
    {
        // new DB Object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
        
        $query_pieces = $this->delt_create_where_string();
        $query = "SELECT ".$this->getTestName().".CommentID\nFROM\n$query_pieces[from]\nWHERE\n$query_pieces[where]";
        
        $result = array();
        $db->select($query, $result);
        
        if(PEAR::isError($result)) {
            return PEAR::raiseError("DELT FAILURE ON: $query -- DBError: " . $result->getMessage());
        }
        
        return $result;
    }
    
    /**
    * returns the false in case there are no Test failures
    * @return bool
    * @param string test_name
    * @param string flag.CommentID
    * @throws PEAR::Error
    */
    function delt_show_completed()
    {
        $logicTestProblemCommentIDs = $this->delt_check_test();
        
        if (PEAR::isError($logicTestProblemCommentIDs)) {
            return PEAR::raiseError($logicTestProblemCommentIDs->getMessage());
        }
        
        // if there were problems captured, i.e. records were returned from the DELT table, return FALSE
        if(count($logicTestProblemCommentIDs) > 0) return false;
        else return true;
    }
}
?>
