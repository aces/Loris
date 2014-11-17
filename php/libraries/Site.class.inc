<?php
/**
 * This file contains the class for the Site object
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once "PEAR.php";
require_once "Database.class.inc";
require_once "User.class.inc";

/**
 * A site object represents a site in the PSC table of
 * Loris.
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Site
{

    var $_siteInfo;

    /**
     * Gets an instance of this Site
     *
     * @param integer $centerID The ID of the site to load
     *
     * @return Site An object representing this site
     */
    static function &singleton($centerID)
    {
        static $siteList = array();
        if (!isset($siteList[$centerID])) {
            $siteList[$centerID] = new Site();
            $error = $siteList[$centerID]->select($centerID);
            if (Utility::isErrorX($error)) {
                $message = $error->getMessage();
                unset($siteList[$centerID]);
                return PEAR::raiseError("Could not select site: ($message)");
            }
        }

        return $siteList[$centerID];
    }

    /**
     * Select basic Site information and stores it into the object property
     *
     * @param int $centerID The CentreID to load data for
     *
     * @return none
     */
    function select($centerID)
    {
        $this->_siteInfo['CenterID'] = $centerID;

        // make a local reference to the Database object
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }

        $query  = "SELECT Name, PSCArea, Alias, MRI_alias, Account, Study_site
                      FROM psc
                   WHERE CenterID = :CID";
        $result = $db->pselectRow($query, array('CID' => $centerID));

        if (Utility::isErrorX($result)) {
            return PEAR::raiseError(
                "Could not retrieve site information form the Database"
            );
        }

        //store site data in the object property
        if (is_array($result) && count($result) > 0) {
            foreach ($result as $key=>$value) {
                $this->_siteInfo[$key] = $value;
            }
        } else {
            return PEAR::raiseError("Invalid site\n");
        }
    }

    /**
     * Gets the full name of this site
     *
     * @return string The full name of site
     */
    function getCenterName()
    {
        return $this->_siteInfo['Name'];
    }

    /**
     * Gets the ID of this site
     *
     * @return integer ID of this site
     */
    function getCenterID()
    {
        return $this->_siteInfo['CenterID'];
    }

    /**
     * Gets the alias used for this site across Loris.
     *
     * @return string alias representing this site
     */
    function getSiteAlias()
    {
        return $this->_siteInfo['Alias'];
    }

    /**
     * Gets the alias used for this site in MRI scripts
     *
     * @return string alias representing this site
     */
    function getSiteMRIAlias()
    {
        return $this->_siteInfo['MRI_alias'];
    }

    /**
     * Gets the account for this site
     *
     * @return string account name for this site
     */
    function getSiteAccount()
    {
        return $this->_siteInfo['Account'];
    }

    /**
     * Returns true if this is a study site
     *
     * @return boolean true if a study site
     */
    function isStudySite()
    {
        return ($this->_siteInfo['Study_site'] == 'Y');
    }


}
?>
