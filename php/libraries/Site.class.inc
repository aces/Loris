<?php declare(strict_types=1);
/**
 * This file contains the class for the Site object
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
    static function &singleton(int $centerID)
    {
        static $siteList = array();
        if (!isset($siteList[$centerID])) {
            try {
                $siteList[$centerID] = new Site();
                $siteList[$centerID]->select($centerID);
            } catch(Exception $e) {
                $message = $e->getMessage();
                unset($siteList[$centerID]);
                throw new Exception("Could not select site ($message)", 0, $e);

            }
        }

        return $siteList[$centerID];
    }

    /**
     * Select basic Site information and stores it into the object property
     *
     * @param int $centerID The CenterID to load data for
     *
     * @return void
     */
    function select(int $centerID): void
    {
        $this->_siteInfo['CenterID'] = $centerID;

        // make a local reference to the Database object
        $db = \Database::singleton();

        $query  = "SELECT Name, PSCArea, Alias, MRI_alias, Account, Study_site
                      FROM psc
                   WHERE CenterID = :CID";
        $result = $db->pselectRow($query, array('CID' => $centerID));

        //store site data in the object property
        if (is_array($result) && count($result) > 0) {
            foreach ($result as $key=>$value) {
                $this->_siteInfo[$key] = strval($value);
            }
        } else {
            throw new Exception("Invalid site");
        }
    }

    /**
     * Gets the full name of this site
     *
     * @return string The full name of site
     */
    function getCenterName(): string
    {
        return strval($this->_siteInfo['Name']);
    }

    /**
     * Gets the ID of this site
     *
     * @return integer ID of this site
     */
    function getCenterID(): int
    {
        return $this->_siteInfo['CenterID'];
    }

    /**
     * Gets the alias used for this site across Loris.
     *
     * @return string alias representing this site
     */
    function getSiteAlias(): string
    {
        return strval($this->_siteInfo['Alias']);
    }

    /**
     * Gets the alias used for this site in MRI scripts
     *
     * @return string alias representing this site
     */
    function getSiteMRIAlias(): string
    {
        return strval($this->_siteInfo['MRI_alias']);
    }

    /**
     * Gets the account for this site
     *
     * @return string account name for this site
     */
    function getSiteAccount(): string
    {
        return strval($this->_siteInfo['Account']);
    }

    /**
     * Returns true if this is a study site
     *
     * @return boolean true if a study site
     */
    function isStudySite(): bool
    {
        return ($this->_siteInfo['Study_site'] == 'Y');
    }
}

