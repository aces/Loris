<?php
require_once 'PEAR.php';

/**
 * Breadcrumb class
 * 
 * Builds the breadcrumb for the GUI
 * @package main
 */
class NDB_Breadcrumb extends PEAR
{
    /**
     * The breadcrumb
     * @var    array
     * @access private
     */
    var $_breadcrumb = array();

    /**
     * The index of the last crumb
     * @var    int
     * @access private
     */
    var $_lastIndex = -1;

    /**
     * The available parameters to build into the URL
     * @var    array
     * @access private
     */
    var $_parameters;

    /**
     * The user-friendly names for different forms or menus
     * @var    array
     * @access private
     */
    var $_userFriendlyNames = array(
                                   'next_stage' => 'Start Next Stage',
                                   'create_timepoint' => 'Create Time Point',
                                   'instrument_list' => 'TimePoint Details',
                                   'timepoint_list' => 'Candidate Profile',
                                   'candidate_list' => 'Access Profile'
                                   );

    /**
     * Adds a crumb to the breadcrumb
     *
     * You may pass in the next test name, so that the breadcrumb correctly 
     * adds the next crumb on the next iteration. You may pass in custom text
     * to fill the crumb, or you may pass in the name of a parameter to format
     * with which to fill the crumb. You can also pass in a parameter to unset.
     *
     * @param  string   next test name (optional)
     * @param  string   parameter to unset (optional)
     * @param  string   crumb text (optional)
     * @param  string   parameter to format (optional)
     * @return void
     * @access private
     */
    function _addCrumb($testName = null, $unset = null, $text = null, $parameter = null)
    {
        // go the the next crumb
        $this->_lastIndex++;

        // set the query string
        $this->_breadcrumb[$this->_lastIndex]['query'] = Utility::unparse_str($this->_parameters);

        // set the crumb text
        if (!is_null($text)) {
            $this->_breadcrumb[$this->_lastIndex]['text'] = $text;
        } elseif (!is_null($parameter)) {
            $this->_breadcrumb[$this->_lastIndex]['text'] = ucwords(str_replace('_', ' ', $this->_parameters[$parameter]));
        } else {
            $this->_breadcrumb[$this->_lastIndex]['text'] = $this->_userFriendlyNames[$this->_parameters['test_name']];
        }

        // set the next crumb's test name
        if (!is_null($testName)) {
            $this->_parameters['test_name'] = $testName;
        }

        // unset given parameter
        if (!is_null($unset)) {
            unset($this->_parameters[$unset]);
        }
    }

    /**
     * Makes a breadcrumb
     *
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function getBreadcrumb()
    {
        // set the parameters array
        $this->_parameters = array(
                                   'test_name' => $_REQUEST['test_name'],
                                   'subtest' => $_REQUEST['subtest'],
                                   'candID' => $_REQUEST['candID'],
                                   'sessionID' => $_REQUEST['sessionID'],
                                   'commentID' => $_REQUEST['commentID'],
                                   'identifier' => $_REQUEST['identifier']
                                   );

        // check if test name is empty
        if (empty($this->_parameters['test_name'])) {
            return null;
        }

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // set the 'instrument list' crumb text
        if (!empty($_REQUEST['sessionID'])) {
            $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
            if (Utility::isErrorX($timePoint)) {
                return PEAR::raiseError("TimePoint Error (".$_REQUEST['sessionID']."): ".$timePoint->getMessage());
            }
            $this->_userFriendlyNames['instrument_list'] = 'TimePoint '.$timePoint->getVisitLabel().' Details';
        }

        // set the 'timepoint list' crumb text
        if (!empty($_REQUEST['candID'])) {
            $candidate =& Candidate::singleton($_REQUEST['candID']);
            if (Utility::isErrorX($candidate)) {
                return PEAR::raiseError("Candidate Error (".$_REQUEST['candID']."): ".$candidate->getMessage());
            }
            $this->_userFriendlyNames['timepoint_list'] = 'Candidate Profile '.$candidate->getData('CandID').' / '.$candidate->getData('PSCID');
        }

        // add a crumb for subtests
        if (!empty($this->_parameters['subtest'])) {
            $params = array(
                'PTestname' => $this->_parameters['test_name'],
                'PSubtest'  => $this->_parameters['subtest']
            );
            $result = $DB->pselectOne("SELECT Description FROM instrument_subtests WHERE Test_name = :PTestname 
                AND Subtest_name = :PSubtest", $params);
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            if (empty($result)) {
                $this->_addCrumb(null, 'subtest', null, 'subtest');
            } else {
                $this->_addCrumb(null, 'subtest', $result);
            }
        }

        // add a crumb for instruments
        if (!empty($this->_parameters['commentID'])) {
            $params = array(
                'PTestname' => $this->_parameters['test_name']
            );
            $result = $DB->pselectOne("SELECT Full_name FROM test_names WHERE Test_name = :PTestname", $params);
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            if (empty($result)) {
                $this->_addCrumb('instrument_list', 'commentID', null, 'test_name');
            } else {
                $this->_addCrumb('instrument_list', 'commentID', $result);
            }
        }

        // set the order of the crumbs
        $crumbOrder = array('next_stage'       => array('next'  => 'instrument_list',
                                                        'unset' => 'identifier'),
                            'create_timepoint' => array('next'  => 'timepoint_list',
                                                        'unset' => 'identifier'),
                            'instrument_list'  => array('next'  => 'timepoint_list',
                                                        'unset' => 'sessionID'),
                            'timepoint_list'   => array('next'  => 'candidate_list',
                                                        'unset' => 'candID'),
                            'candidate_list'   => array('next'  => '')
                            );

        // loop through the crumbs according to the order above, or just make one crumb
        if (array_key_exists($this->_parameters['test_name'], $crumbOrder)) {
            while (!empty($this->_parameters['test_name'])) {
                $this->_addCrumb($crumbOrder[$this->_parameters['test_name']]['next'], $crumbOrder[$this->_parameters['test_name']]['unset']);
            }
        } else {
            $this->_addCrumb(null, null, null, 'test_name');
        }

        // reverse the breadcrumb, because crumbs are added in reverse order
        return array_reverse($this->_breadcrumb);
    }
}
