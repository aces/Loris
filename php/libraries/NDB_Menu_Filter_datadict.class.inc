<?php
require_once 'NDB_Menu_Filter.class.inc';
/**
 * @package main
*/
class NDB_Menu_Filter_datadict extends NDB_Menu_Filter
{
	/**
    * overloading this method to allow access to site users (their own site only) and users w/ multisite privs
    * @note   overloaded function
    * @return bool
    * @access private
    */

	function _hasAccess()
	{
		// create user object
		$user =& User::singleton();
		if(Utility::isErrorX($user)) {
			return PEAR::raiseError("User Error: ".$user->getMessage());
		}

		return ($user->hasPermission('data_dict'));
	}

	function _setupVariables()
	{

		// set the class variables

		$this->columns = array('pt.sourceFrom','pt.Name', 'pt.sourceField','coalesce(pto.description,pt.description) as description');
		$config=&NDB_Config::singleton();
		$this->validFilters = array('pt.sourceFrom','pt.Description');
		$this->query = " FROM parameter_type pt LEFT JOIN parameter_type_override pto USING (Name)
		WHERE pt.Queryable=1";
	
		$this->formToFilter = array(
		'sourceFrom' => 'pt.sourceFrom',
		'Description' => 'pt.Description'
		);

        $this->searchKeyword = array('pt.Name', 'pt.sourceField','pto.description');
		return true;
	}


	function _setFilterForm()
	{
		
		// list of feedback statuses
		$instruments = Utility::getAllInstruments();
		$instruments = array_merge(array('' => 'All Instruments'), $instruments);
		$this->form->addElement('select','sourceFrom', 'Instruments', $instruments);
		$this->form->addElement('select','Description', 'Description', array('' => 'All', 'empty'=>'Empty','modified'=>'Modified','unmodified'=>'Unmodified'));
        $this->form->addElement('text', 'keyword', 'Search keyword');		
		return true;
	}


	function _setDataTableRows($count)
	{

		$x = 0;
		
		foreach ($this->list as $item) {
			$this->tpl_data['items'][$x][0]['value'] = $x + $count;
			$i = 1;

			foreach ($item as $key => $val) {
                if ($key =='description'){
                    $key = $item['Name'] . "___" . "description";
                }
                if($key == "sourceFrom" && $val== "parameter_session"){
                    $val = $item['Name'];
                }
				$this->tpl_data['items'][$x][$i]['name'] = $key;
				$this->tpl_data['items'][$x][$i]['value'] = $val;

				$i++;
			}

			$x++;
		}
		return true;
	}

    
    function _getBaseQuery() {
        // make the SELECT statement
        $query = "SELECT ";
        if (is_array($this->columns) && count($this->columns) > 0) {
            $query .= implode(', ', $this->columns);
        } else {
            $query .= "*";
        }
    	// add the base query
		if (isset($_REQUEST['Description']) && $_REQUEST['Description'] =='modified') {
			$query .= " FROM parameter_type pt JOIN parameter_type_override pto USING (Name) WHERE pt.Queryable=1";
		}
		else{
			$query .= $this->query;
		}
		
        return $query;
    }
  
    function _addValidFilters($prepared_key, $key, $val){
        $query = '';
        if ((!empty($val) || $val === '0') && $key != 'order') {
            //print "key: $key val: $val <BR>"	;

            // special rule for dropdowns where value is numeric
            if (strtolower(substr($key, -8)) == 'centerid' ||
                    strtolower(substr($key, -10)) == 'categoryid' ||
                    strtolower(substr($key, -6)) == 'gender') {
                $query .= " AND $key = '$val' ";
            }
            else {
                if ($val == 'empty')	{
                    $query .= " AND COALESCE(pto.description,pt.description) = ''";
                }
                elseif ($val=='modified') {
                    //NO where clause added
                }
                elseif ($val=='unmodified'){
                    $query .= " AND pto.description IS NULL";
                }
                else{
                    $query .= " AND $key LIKE '$val%' ";
                }
            }
        }

        return $query; 

    }


}
?>
