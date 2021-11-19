<?php declare(strict_types=1);
/**
 * A site object represents a site in the PSC table of
 * Loris.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Site implements
    \LORIS\StudyEntities\SiteHaver,
    \LORIS\StudyEntities\AccessibleResource
{
    var $_siteInfo;

    /**
     * Gets an instance of this Site
     *
     * @param CenterID $centerID The ID of the site to load
     *
     * @return Site An object representing this site
     */
    static function &singleton(CenterID $centerID)
    {
        static $siteList = [];
        $cidS            = $centerID->__toString();
        if (!isset($siteList[$cidS])) {
            try {
                $siteList[$cidS] = new Site();
                $siteList[$cidS]->select($centerID);
            } catch (Exception $e) {
                $message = $e->getMessage();
                unset($siteList[$cidS]);
                throw new Exception("Could not select site ($message)", 0, $e);

            }
        }

        return $siteList[$cidS];
    }

    /**
     * Select basic Site information and stores it into the object property
     *
     * @param CenterID $centerID The CenterID to load data for
     *
     * @return void
     */
    function select(CenterID $centerID): void
    {
        $this->_siteInfo['CenterID'] = $centerID;

        // make a local reference to the Database object
        $db = \Database::singleton();

        $query  = "SELECT Name, PSCArea, Alias, MRI_alias, Account, Study_site
                      FROM psc
                   WHERE CenterID = :CID";
        $result = $db->pselectRow($query, ['CID' => $centerID]);

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
     * @return CenterID
     */
    function getCenterID(): CenterID
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

    /**
     * Implements the AccessibleResource interface for Sites
     *
     * @param \User $user The User whose access is being checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
           return $user->hasCenter($this->getCenterID());
    }
}

