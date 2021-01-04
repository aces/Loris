<?php

/**
 * IBIS module.
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Parent Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\parent_portal;
/**
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Parent_Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Parent_Portal extends \NDB_Form
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */


    /**
     * CommonPageSetup sets up the common form elements which
     * are on the page, regardless of HTTP request method.
     *
     * @return none
     */
    function setup()
    {
        $this->tpl_data['page_title'] = 'Parent Portal';
        $this->addBasicText(
            "parentID",
            "ParentID",
            array("placeholder" => "")
        );


        $this->addBasicText(
            "email",
            "Email",
            array("placeholder" => "")
        );
        $this->form->addFormRule(array(&$this, '_validate'));
        $localDefaults = $this->_getDefaults();
        if(!is_array($localDefaults)) { $localDefaults = array(); }
        $this->form->setDefaults(array_merge($this->defaults, $localDefaults));


    }

    function _validate($values)
    {
        $errors = array();

         if (empty($values['parentID'])) {
            $errors['parentID'] = " ParentID is required!";
        }
        else if (empty($values['email'])  ) {
            $errors['email'] = " Email is required!";
        }
        else {
            $db = \Database::singleton();

            $numSurveys = $db->pselectOne(
                "SELECT COUNT(*) FROM participant_accounts p
                 JOIN session s ON (p.SessionID=s.ID)
                 JOIN candidate c ON (c.CandID=s.CandID)
                 WHERE p.Email=:surv_email AND c.ParentID=:pid",
                array(
                    'surv_email' => $values['email'],
                    'pid'        => $values['parentID'],
                )
            );
            if ($numSurveys == 0) {
                //As suggested by Pierre to deter malicious automated attempts to hack the portal.
                sleep(3);
                $errors['email'] = "Sorry, No Surveys Found With The Above Information.";
            }
        }

            return $errors;

    }
    function _getDefaults()
    {

        $sanitize = array_map('htmlentities', $_GET);
        $id = $sanitize['id'] ?? null;

        $defaults['parentID']=$id;
        return $defaults;
    }
    function _process($values)
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $_SESSION['pid'] = $_REQUEST['parentID'];
        $_SESSION['email'] = $_REQUEST['email'];
        header ("Location: $baseURL/parent_portal/view_surveys");
        exit;
    }
}

