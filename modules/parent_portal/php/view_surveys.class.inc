<?php

/**
 * Parent Portal module.
 *
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Parent Portal - View Surveys
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\parent_portal;

/**
 * Parent Portal class
 *
 * PHP Version 7
 *
 * @category Module
 * @package  Main
 * @author   Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class View_Surveys extends \NDB_Form
{
    /**
     * Setup function provides the initial data from database
     *
     * @return void
     */
    function setup(): void
    {

        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        session_start();
        $email =$_SESSION['email'];
        $pid   =$_SESSION['pid'];
        if ((!isset($email)) && (!isset($pid)) ) {
            header("Location: $baseURL/parent_portal");
            exit;
        }
        $this->tpl_data['page_title'] = 'Welcome To Parent Portal! (ID:'.$pid.')';
        $survey_url = $baseURL. "/survey.php?key=";
        $this->tpl_data['survey_url'] =$survey_url;
        $DB       = \NDB_Factory::singleton()->database();
	$query =$DB->pselect(
            "select tn.Full_name,tn.Test_name,s.Visit_label, p.Status,
            p.OneTimePassword
            FROM participant_accounts p 
            JOIN session s ON (p.SessionID=s.ID)
            JOIN candidate c ON (c.CandID=s.CandID)
            JOIN flag f ON (f.CommentID =p.CommentID)
            JOIN test_names tn ON (tn.Test_name=f.Test_name)
            WHERE p.Email=:surv_email
            AND c.ParentID=:pid
            ORDER BY p.Status",
            [
                'surv_email' => $email,
                'pid'        => $pid

            ]
        );
        $this->tpl_data['survey_data'] = $query;

    }
    /**
     * Loading css dependencies.
     *
     * @return array
     */
    function getCSSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/parent_portal/css/parent_portal.css"]
        );
    }


}


