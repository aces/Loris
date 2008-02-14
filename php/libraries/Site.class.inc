<?php
/**
 * @package main
 */
require_once "PEAR.php";
require_once "Database.class.inc";
require_once "User.class.inc";

class Site
{

    var $_siteInfo;
    //    var $user;
    //$this->user =& User::singleton($_SESSION["State"]->getUsername());

    /**
     * @note must be called statically
     */
    function singleton($centerID)
    {
        static $siteList = array();
        if(!isset($siteList[$centerID])) {
            $siteList[$centerID] = new Site();
            $error = $siteList[$centerID]->select($centerID);
            if(PEAR::isError($error)) {
                $message = $error->getMessage();
                unset($siteList[$centerID]);
                return PEAR::raiseError("Could not select site: ($message)");
            }
        }

        return $siteList[$centerID];
    }

    /**
     * select basic Site information and stores it into the object property
     * @param int $centerID, DB field psc.CenterID
     * $return void
     * @throws PEAR:Error
     * @access public
     */
    function select($centerID)
    {
        $this->_siteInfo['CenterID'] = $centerID;

        // make a local reference to the Database object
        $db =& Database::singleton();
        if (PEAR::isError($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }

        $query = "SELECT Name, PSCArea, Alias, MRI_alias, Account, Study_site FROM psc WHERE CenterID = '$centerID'";
        $db->selectRow($query, $result);

        if (PEAR::isError($result)) {
            return PEAR::raiseError("Could not retrieve site information form the Database");
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

    function getCenterName()
    {
        return $this->_siteInfo['Name'];
    }

    function getCenterID()
    {
        return $this->_siteInfo['CenterID'];
    }

    function getSiteAlias()
    {
        return $this->_siteInfo['Alias'];
    }

    function getSiteMRIAlias()
    {
        return $this->_siteInfo['MRI_alias'];
    }

    function getSiteAccount()
    {
        return $this->_siteInfo['Account'];
    }

    function isStudySite()
    {
        return ($this->_siteInfo['Study_site'] == 'Y');
    }

    
}
?>