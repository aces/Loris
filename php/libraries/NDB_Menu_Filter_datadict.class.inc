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
		if(PEAR::isError($user)) {
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
		return true;
	}


	function _setFilterForm()
	{
		
		// list of feedback statuses
		$instruments = Utility::getAllInstruments();
		$instruments = array_merge(array('' => 'All Instruments'), $instruments);
		$this->form->addElement('select','sourceFrom', 'instruments', $instruments);
		$this->form->addElement('select','Description', 'Description', array('' => 'All', 'empty'=>'empty','modified'=>'modified','un_modified'=>'un_modified'));
		
		return true;
	}


	function _setDataTableRows($count)
	{

		foreach ($this->list as $item) {
			$this->tpl_data['items'][$x][0]['value'] = $x + $count;
			$i = 1;

			foreach ($item as $key => $val) {
				if ($key =='description'){
					$key = $item['sourceField'] . "___" .$item['sourceFrom'] . "___" . "description";
				}
				$this->tpl_data['items'][$x][$i]['name'] = $key;
				$this->tpl_data['items'][$x][$i]['value'] = $val;

				$i++;
			}

			$x++;
		}
		return true;
	}

	/**
     * Returns a list of candidates, users, etc.
     *
     * @return array
     * @throws PEAR_Error
     * @access private
     * 
     * NOTE: This function is getting overriden because of the All/empty , modified and un-modified description criteria
     
     */
	function _getList()
	{
		// create DB object
		$DB =& Database::singleton();
		if(PEAR::isError($DB)) {
			return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
		}
		// make the SELECT statement
		$query = "SELECT ";
		if (is_array($this->columns) && count($this->columns) > 0) {
			$query .= implode(', ', $this->columns);
		} else {
			$query .= "*";
		}
		
		// add the base query
		if ($_REQUEST['Description'] =='modified'){
			$query .= " FROM parameter_type pt JOIN parameter_type_override pto USING (Name) WHERE pt.Queryable=1";
		}
		else{
			$query .= $this->query;
		}
		
		

									

		// add filters to query
		if (is_array($this->filter) && count($this->filter) > 0) {
			foreach ($this->filter as $key => $val) {

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
						elseif ($val=='un_modified'){
							$query .= " AND pto.description IS NULL";
						}
						else{
							$query .= " AND $key LIKE '$val%' ";
						}
					}
				}
			}
		}

		// add GROUP BY if applicable
		if (!empty($this->group_by)) {
			$query .= " GROUP BY $this->group_by ";
		}
		// add HAVING clause (for restricting aggregates)
		if(!empty($this->having)) {

			$first = True;
			foreach ($this->having as $key => $val) {
				if($val !== '' and $val != null) {
					if($first == False) {
						$query .= ' AND ';
					}
					else {
						$query .= ' HAVING ';
					}
					$first = False;

					$query .= "$key LIKE " . $DB->quote("$val%");
				}
			}
		}

		// apply ORDER BY filters
		$query .= " ORDER BY ";
		if (!empty($this->filter['order'])) {
			$query .= $this->filter['order']['field']." ".$this->filter['order']['fieldOrder'].", ";
		}
		$query .= $this->order_by;
		// get the list
		//print($query);
		$DB->select($query, $result);
		if(PEAR::isError($result)) {
			return PEAR::raiseError("DB Error: ".$result->getMessage());
		}

		return $result;
	}

}
?>
