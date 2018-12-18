<?php
/**
 * This file contains the State class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
/**
 * Stores simple state data during a browsing session
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class State
{
    /**
     * The array that contains all the data owned by a State object
     */
    var $_privateStateData;

    /**
     * The array that contains all the data set with setProperty
     */
    var $_stateData;

    /**
     * The singleton model factory method
     *
     * @return State reference to the State object (new one if none
     *               existed previously)
     */
    static function &singleton()
    {
        static $instance = null;
        if (is_null($instance)) {
            $instance = new State;
        }

        return $instance;
    }

    /**
     * Sets the username
     *
     * @param string|null $username the user's username or null when clearing
     *                      SESSION state.
     *
     * @return void
     */
    function setUsername(?string $username): void
    {
        $this->_privateStateData['username'] = $username;
    }

    /**
     * Gets the username
     *
     * @return string|null the user's username, or null if not set
     */
    function getUsername(): ?string
    {
        return $this->_privateStateData['username'];
    }

    /**
     * Sets an arbitrarily named property
     *
     * @param string $property the name of the property to set
     * @param mixed  $value    the value to which to set the property
     *
     * @return void
     */
    function setProperty(string $property, $value): void
    {
        $this->_stateData[$property] = $value;
    }

    /**
     * Gets an arbitrarily named property
     *
     * @param string $property the name of the property to set
     *
     * @return mixed the value to which to set the property
     */
    function getProperty(string $property)
    {
        if (isset($this->_stateData[$property])) {
            return $this->_stateData[$property];
        }
        return null;
    }


    /**
     * Gets the last URL that was access to use as a "back" link.
     *
     * @return string|null URL suitable for adding to a link of for a "Back" link
     */
    function getLastURL(): ?string
    {
        $timepointSubMenus = array(
                              'instrument_list',
                              'create_timepoint',
                              'demographics',
                             );

        $caller =& NDB_Caller::singleton();
        if (isset($_REQUEST['test_name'])
            && $_REQUEST['test_name'] == 'timepoint_list'
        ) {
            return 'main.php?test_name=candidate_list';
        } elseif (!empty($_REQUEST['candID'])
            && in_array($_REQUEST['test_name'], $timepointSubMenus)
        ) {
            return 'main.php?test_name=timepoint_list&candID='.$_REQUEST['candID'];
        } elseif ($caller->type == 'instrument'
            || (isset($_REQUEST['test_name'])
            && $_REQUEST['test_name'] == 'next_stage')
        ) {
            if (isset($_REQUEST['candID']) && isset($_REQUEST['sessionID'])) {
                return 'main.php?test_name=instrument_list&candID='
                    .$_REQUEST['candID'].'&sessionID='.$_REQUEST['sessionID'];
            }
        }

        return null;
    }
}

