<?php
/**
 * The welcome menu
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\statistics;

require_once __DIR__ . "/../../reliability/php/reliability.class.inc";
use LORIS\reliability\Reliability as Reliability;

/**
 * The welcome menu
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Stats_Reliability extends \NDB_Form
{
    protected $params = array();
    /**
     * Checking user's permission
     *
     * @return bool
     */
    function _hasAccess()
    {
        $user =& \User::singleton();
        return $user->hasPermission('data_entry');
    }

    /**
     * Reliability tab setup
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this     page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return void
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $DB          =& \Database::singleton();
        $config      = \NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        $this->tpl_data['useProjects'] = $useProjects;
        //PROJECTS
        $projects[null] = 'All Projects';
        foreach (\Utility::getProjectList() as $key => $value) {
            $projects[$key] = $value;
        }

        if ($_REQUEST['ReliabilityProject'] ?? ''
        ) {
            $currentProject = htmlspecialchars($_REQUEST['ReliabilityProject']);
            $this->tpl_data['CurrentProject']
                = array(
                   'ID'   => $currentProject,
                   'Name' => $projects[$currentProject],
                  );
            $Param_Project       ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] = htmlspecialchars($_REQUEST['ReliabilityProject']);
        } else {
            $Param_Project ='';
        }

        //SITES
        if ($_REQUEST['ReliabilitySite'] ?? ''
        ) {
            $Param_Site          ='AND (c.CenterID IS NULL OR c.CenterID=:sid) ';
            $this->params['sid'] = htmlspecialchars($_REQUEST['ReliabilitySite']);
        } else {
            $Param_Site = '';
        }
        $centers     = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    IFNULL(PSCArea,Name) as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                AND Study_site = 'Y'",
            array()
        );
        $sites[null] ="All sites";
        foreach ($centers as $row) {
            $sites[$row['NumericID']] = $row['ShortName'];
            if (($_REQUEST['ReliabilitySite'] ?? -1) == $row['NumericID']) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }
        }

        $this->tpl_data['Centers']  = $centers;
        $this->tpl_data['Projects'] = $projects;
        $this->tpl_data['Sites']    = $sites;

        $this->tpl_data['reliability_completion']
            = $this->getReliabilityData($Param_Project, $Param_Site);
    }

    /**
     * GetReliabilityData function
     *
     * @param string $Param_Project the value of Param_Project
     * @param string $Param_Site    the value of Param_Site
     *
     * @return void
     */
    function getReliabilityData($Param_Project, $Param_Site)
    {
        // Whether something is reliable or not isn't stored in the database,
        // but calculated on the fly.
        // As a result, we need to manually calculate it and maintain for each
        // type of thing.
        $thresholds = Reliability::getThreshholds();

        $config            = \NDB_Config::singleton();
        $reliabilityConfig = $config->getSetting("ReliabilityInstruments");
        $tests = array();

        foreach (\Utility::toArray($reliabilityConfig) AS $reliabilityInstrument) {
            $instrument_list = $reliabilityInstrument['Instrument'];
            foreach ($instrument_list AS $instrument) {
                $tests[$instrument['Testname']] = $instrument['Displayname'];
            }
        }

        $reliable = array();
        foreach ($tests as $inst => $name) {
            $reliable[] = $this->_getSingleReliabilityData(
                $Param_Project,
                $Param_Site,
                $name,
                $inst,
                $thresholds[$inst]
            );
        }

        return array_merge($reliable);
    }
    /**
     * GetSingleReliabilityData function
     *
     * @param string $Param_Project the value of Param_Project
     * @param string $Param_Site    the value of Param_Site
     * @param string $name          the value of name
     * @param string $inst_name     the value of inst_name
     * @param string $cutoff        the value of cutoff
     *
     * @return void
     */
    function _getSingleReliabilityData($Param_Project,
        $Param_Site,
        $name,
        $inst_name,
        $cutoff
    ) {

        $db          = \Database::singleton();
        $ret         = array();
        $ret['name'] = $name;
        $ret['complete'] = $db->pselectOne(
            "SELECT count(*)
                      FROM reliability r
                           JOIN flag f USING(CommentID)
                           JOIN session s ON (s.ID=f.SessionID)
                           JOIN candidate c ON (c.CandID=s.CandID)
                      WHERE Instrument='$inst_name'
                           AND Invalid <> 'yes'
                           AND Reliability_score IS NOT NULL
                           AND c.CenterID <> 1
                                $Param_Project
                                   $Param_Site",
            $this->params
        );

        $ret['reliable'] = $db->pselectOne(
            "SELECT count(*)
                      FROM reliability r
                           JOIN flag f USING(CommentID)
                           JOIN session s ON (s.ID=f.SessionID)
                           JOIN candidate c ON (c.CandID=s.CandID)
                      WHERE Instrument='$inst_name'
                           AND Invalid <> 'yes'
                           AND Reliability_score IS NOT NULL
                           AND Reliability_score > $cutoff
                           AND c.CenterID <> 1
                                $Param_Project
                                   $Param_Site",
            $this->params
        );

        $ret['total'] = $db->pselectOne(
            "SELECT count(*)
                     FROM reliability r
                          JOIN flag f USING(CommentID)
                          JOIN session s ON (s.ID=f.SessionID)
                          JOIN candidate c ON (c.CandID=s.CandID)
                     WHERE Instrument='$inst_name'
                          AND Invalid <> 'yes'
                          AND c.CenterID <> 1
                               $Param_Project
                                 $Param_Site",
            $this->params
        );

        if ($ret['total'] == 0) {
            // These should probably be indeterminate instead of 0, but 0
            // looks cleaner.
            $ret['percent_complete'] = '0';
            $ret['percent_reliable'] = '0';
        } else {
            $ret['percent_complete'] = round($ret['complete'] / $ret['total'] * 100);
            $ret['percent_reliable'] = round($ret['reliable'] / $ret['total'] * 100);
        }
        return $ret;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the statistics menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/statistics/js/form_stats_reliability.js",
            )
        );
    }
    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/statistics/css/statistics.css")
        );
    }
}

