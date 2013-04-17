<?php
/**
 * stores simple state data during a browsing session
 * @package main
 */
class State
{
    /**
     * the array that contains all the data owned by a State object
     * @access private
     */
    var $_privateStateData;
    
    /**
     * the array that contains all the data set with setProperty
     * @access private
     */
    var $_stateData;

    /**
     * the singleton model factory method
     * this must always be called with a reference assignment operator
     * (=&) to work properly
     * @return State reference to the State object (new one if none
     * existed previously)
     * @access public
     */
    static function &singleton()
    {
        static $instance = null;
        if(is_null($instance)) {
            $instance = new State;
        }
        
        return $instance;
    }

    /**
     * sets the username
     * @param string $username the user's username
     * @return void
     * @access public
     */
    function setUsername($username)
    {
        $this->_privateStateData['username'] = $username;
    }

    /**
     * gets the username
     * @return string the user's username
     * @access public
     */
    function getUsername()
    {
        return $this->_privateStateData['username'];
    }

    /**
     * sets an arbitrarily named property
     * @param string $property the name of the property to set
     * @param mixed  $value    the value to which to set the property
     * @return void
     * @access public
     */
    function setProperty($property, $value)
    {
        $this->_stateData[$property] = $value;
    }

    /**
     * gets an arbitrarily named property
     * @param string $property the name of the property to set
     * @return mixed  the value to which to set the property
     * @access public
     */
    function getProperty($property)
    {
        if(isset($this->_stateData[$property])) {
            return $this->_stateData[$property];
        }
        return null;
    }


    function getLastURL()
    {
        $timepointSubMenus = array(
        'instrument_list',
        'create_timepoint',
        'demographics',
        'mri_safety'
        );
        $caller =& NDB_Caller::singleton();
        if (isset($_REQUEST['test_name']) && $_REQUEST['test_name'] == 'timepoint_list') {
            return 'main.php?test_name=candidate_list';
        } elseif (!empty($_REQUEST['candID']) && in_array($_REQUEST['test_name'], $timepointSubMenus)) {
            return 'main.php?test_name=timepoint_list&candID='.$_REQUEST['candID'];
        } elseif ($caller->type == 'instrument' || (isset($_REQUEST['test_name']) && $_REQUEST['test_name'] == 'next_stage')) {
            return 'main.php?test_name=instrument_list&candID='.$_REQUEST['candID'].'&sessionID='.$_REQUEST['sessionID'];
        }

        return null;
    }
}
?>
