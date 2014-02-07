<?php
/**
 * This file contains a class which is a wrapper around the concept
 * of a candidate in Loris.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once "PEAR.php";

/* Define constants used by the file */
// error codes
define('CANDIDATE_INVALID', 1);
define('PSCID_NOT_SPECIFIED', 2);
define('PSCID_NOT_UNIQUE', 3);
define('PSCID_INVALID_STRUCTURE', 4);

// id ranges...
define('CANDIDATE_MIN_CANDID', 100000);
define('CANDIDATE_MAX_CANDID', 999999);
define('CANDIDATE_MIN_PSCID', 1000);
define('CANDIDATE_MAX_PSCID', 9999);

/**
 * Wrapper around a candidate in Loris. Mostly, it gets information
 * from the candidate table, but this class is abstract enough that
 * it could get information from other places too such as parameter_candidate
 * if relevent.
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Candidate
{
    var $candidateInfo;
    var $listOfTimePoints;

    /**
     * This returns a single Candidate object for the given
     * candID, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param integer $candID A 6 digit Loris CandID that matches
     *                        a candidate in the candidate table
     * 
     * @return Candidate the Candidate object
     */
    static function &singleton($candID)
    {
        $candidateList =& $GLOBALS['__candidateObjects'];
        if (!isset($candidateList[$candID])) {
            $candidateList[$candID] = new Candidate();
            $success = $candidateList[$candID]->select($candID);

            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }

        return $candidateList[$candID];
    }
    
    /**
     * This does the work of selecting the candidate and related
     * information from the database and populating it into the
     * Candidate object. Used by singleton method.
     *
     * @param integer $candID The 6 digit Loris CandID
     *
     * @return null As a side-affect loads candidate into current
     *              object
     */
    function select($candID)
    {
        $config = NDB_Config::singleton();
        // right off, set the candID
        $candID = trim($candID);
        $CandArray = array('Candidate' => $candID);

        // make a local reference to the Database object
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }

        // get candidate data from database
        $query = "SELECT c.CenterID, c.CandID, c.PSCID, c.DoB, c.EDC, c.Gender,
            p.Name AS PSC, c.Ethnicity, c.ZIP, c.Sibling1, c.Sibling2, c.Sibling3,
            c.Active, u1.Real_name as RegisteredBy, c.UserID, c.ProjectID 
            FROM candidate as c 
                LEFT JOIN psc as p USING (CenterID) 
                LEFT JOIN users as u1 ON (u1.UserID = c.RegisteredBy) 
            WHERE c.CandID=:Candidate AND c.Active = 'Y'";
        $row = array();
        $row = $db->pselectRow($query, $CandArray);
        
        if (Utility::isErrorX($row)) {
            return PEAR::raiseError("DB Error: " . $row->getMessage());
        }

        if (!is_array($row) || sizeof($row) == 0) {
            return PEAR::raiseError(
                "Could not select Candidate data from the database (DCCID: $candID)",
                CANDIDATE_INVALID
            );
        }

        // store user data in object property
        foreach ($row AS $key=>$value) {
            $this->candidateInfo[$key] = $value;
        }

        if ($config->getSetting('useProjects') === 'true') {
            $this->candidateInfo['ProjectTitle'] = $this->getProjectTitle();
        }

        $headerSetting = $config->getSetting('HeaderTable');
        if (!empty($headerSetting)) {
            $params = array();
            $parameterCandSettings = $headerSetting['parameter_candidate'];
            if (!is_array($parameterCandSettings)) {
                $parameterCandSettings= array($parameterCandSettings);
            }
            foreach ($parameterCandSettings as $parameter_type) {
                $row = $db->pselectRow(
                    "SELECT Value, pt.Description 
                    FROM candidate c 
                        JOIN parameter_candidate pc ON (pc.CandID=c.CandID)
                        LEFT JOIN parameter_type pt ON 
                            (pc.ParameterTypeID=pt.ParameterTypeID)
                    WHERE c.CandID=:Candidate AND pt.Name=:PTName", 
                    array(
                        'Candidate' => $candID,
                        'PTName' => $parameter_type
                    )
                );
                if (!empty($row['Value'])) {
                    $params[$row['Description']] = $row['Value'];
                }
            }
            $this->candidateInfo['DisplayParameters'] = $params;
        }

        // checK PSCID - only if it's passed by the open profile form
        if (isset($_REQUEST['PSCID'])) {
            if (strtolower(
                trim($_REQUEST['PSCID'])
            ) != strtolower($this->getPSCID())
            ) {
                return (PEAR::raiseError("IDs do not match"));
            }
        }
        
        // get Time Point SessionIDs for the $candID
        // select ALL of them - later you can filter out cancelled and inactive ones
        $query = "SELECT s.ID FROM session as s 
            WHERE s.CandID=:Candidate AND s.Active='Y'
            ORDER BY ID";
        $row = $db->pselect($query, $CandArray);

        if (Utility::isErrorX($row)) {
            return PEAR::raiseError(
                "Could not retrieve candidate/timepoint data from database"
            );
        }

        // store user data in object property
        foreach ($row AS $value) {
            $this->listOfTimePoints[] = $value["ID"];
        }
   }
   
   /**
   * creates a new candidate, assigning CandID and PSCID - MUST be called statically
   *
   * @param int    $centerID    centerID of the site to which the candidate will belong
   * @param string $dateOfBirth date of birth written as YYYY-MM-DD
   * @param string $edc         estimated date of confinement written as YYYY-MM-DD
   * @param string $gender      gender, either 'Male' or 'Female'
   * @param string $PSCID       PSCID specified by the user, if available
   * @return int   $candID      candidate id of the new candidate
   * @throws PEAR::Error
   * @static
   */
   function createNew($centerID, $dateOfBirth, $edc, $gender, $PSCID=null)
   {
       if(!empty($this->candidateInfo['candID'])) {
           return PEAR::raiseError("createNew must be called statically");
       }
       
       $db =& Database::singleton();
       if(Utility::isErrorX($db)) {
           return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
       }
       
       $site =& Site::singleton($centerID);
       if(Utility::isErrorX($site)) {
           return PEAR::raiseError("Could not create a new candidate for site: (".$site->getMessage().")");
       }
       
       $user =& User::singleton($_SESSION['State']->getUsername());
       if(Utility::isErrorX($user)) {
           return PEAR::raiseError("Could not create a new candidate for user: (".$user->getMessage().")");
       }
       
       // generate candid
       $candID = Candidate::_generateCandID();
       if(Utility::isErrorX($candID)) return $candID;

       // figure out how to generate PSCID
       $config =& NDB_Config::singleton();
       $PSCIDSettings = $config->getSetting('PSCID');

       if($PSCIDSettings['generation'] == 'user') {
           // check pscid is specified
           if(empty($PSCID)) {
               return PEAR::raiseError("PSCID must be specified", PSCID_NOT_SPECIFIED);
           }

           // check pscid structure
           if(!Candidate::validatePSCID($PSCID, $site->getSiteAlias())) {
               return PEAR::raiseError("PSCID has an invalid structure", PSCID_INVALID_STRUCTURE);
           }

           // check pscid uniqueness
           if($db->pselectOne("SELECT count(PSCID) FROM candidate WHERE PSCID=:PID", array('PID' => $PSCID)) > 0) {
               return PEAR::raiseError("PSCID not unique", PSCID_NOT_UNIQUE);
           }
       } else {           
           $PSCID = Candidate::_generatePSCID($site->getSiteAlias());
           if(Utility::isErrorX($PSCID)) return $PSCID;
       }
       
       // insert the new candidate into the database
       $setArray = array('CandID'       => $candID,
                         'CenterID'     => $centerID,
                         'PSCID'        => $PSCID,
                         'DoB'          => $dateOfBirth,
                         'EDC'          => $edc,
                         'Gender'       => $gender,
                         'Date_active'  => date('Y-m-d'),
                         'Date_registered' => date('Y-m-d'),
                         'Entity_type'  => 'Human',
                         'RegisteredBy' => $user->getUsername(),
                         'UserID'       => $user->getUsername(),
                         );
       
       if($config->getSetting('useExternalID') === 'true') {
           $externalID = Candidate::_generateExternalID();
           $setArray['ExternalID'] = $externalID;
       } 

       $db->insert('candidate', $setArray);
       
       // return the new candid
       return $candID;
   }

    /**
     * creates a new candidate, assigning CandID and PSCID - MUST be called 
     * statically
     *
     * @param int    $centerID    centerID of the site to which the candidate 
     *                            will belong
     * @param string $dateOfBirth date of birth written as YYYY-MM-DD
     * @param string $edc         estimated date of confinement written as YYYY-MM-DD
     * @param string $gender      gender, either 'Male' or 'Female'
     * @param string $PSCID       PSCID specified by the user, if available
     *
     * @return int   $candID      candidate id of the new candidate
     */
    static function createNew($centerID, $dateOfBirth, $edc, $gender, $PSCID=null)
    {
        if (!empty($this->candidateInfo['candID'])) {
            return PEAR::raiseError("createNew must be called statically");
        }

        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }

        $site =& Site::singleton($centerID);
        if (Utility::isErrorX($site)) {
            return PEAR::raiseError(
                "Could not create a new candidate for site: ("
                .$site->getMessage()
                .")"
            );
        }

        $user =& User::singleton($_SESSION['State']->getUsername());
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError(
                "Could not create a new candidate for user: ("
                .$user->getMessage()
                .")"
            );
        }

        // generate candid
        $candID = Candidate::_generateCandID();
        if (Utility::isErrorX($candID)) {
            return $candID;
        }

        // figure out how to generate PSCID
        $config =& NDB_Config::singleton();
        $PSCIDSettings = $config->getSetting('PSCID');

        if ($PSCIDSettings['generation'] == 'user') {
            // check pscid is specified
            if (empty($PSCID)) {
                return PEAR::raiseError(
                    "PSCID must be specified", PSCID_NOT_SPECIFIED
                );
            }

            // check pscid structure
            if (!Candidate::validatePSCID($PSCID, $site->getSiteAlias())) {
                return PEAR::raiseError(
                    "PSCID has an invalid structure", PSCID_INVALID_STRUCTURE
                );
            }

            // check pscid uniqueness
            if ($db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:PID",
                array('PID' => $PSCID)
            ) > 0) {
                return PEAR::raiseError(
                    "PSCID not unique", PSCID_NOT_UNIQUE
                );
            }
        } else {           
            $PSCID = Candidate::_generatePSCID($site->getSiteAlias());
            if (Utility::isErrorX($PSCID)) {
                return $PSCID;
            }
        }

        // insert the new candidate into the database
        $setArray = array(
            'CandID'       => $candID,
            'CenterID'     => $centerID,
            'PSCID'        => $PSCID,
            'DoB'          => $dateOfBirth,
            'EDC'          => $edc,
            'Gender'       => $gender,
            'Date_active'  => date('Y-m-d'),
            'Date_registered' => date('Y-m-d'),
            'Entity_type'  => 'Human',
            'RegisteredBy' => $user->getUsername(),
            'UserID'       => $user->getUsername(),
        );

        $db->insert('candidate', $setArray);

        // return the new candid
        return $candID;
    }

    /**
     * Get a list of timepoints that this Candidate has registered
     *
     * @return array Non-associative array of SessionIDs 1st Time Point 
     *               indexed to 0
     */
    function getListOfTimePoints()
    {
        return $this->listOfTimePoints;
    }

    /**
     * Returns the sessionID for this Candidate's nth visit
     *
     * @param integer $visitNo The visit number for which you
     *                         want the SessionID
     *
     * @return integer SessionID of candidate's nth visit
     */
    function getSessionID($visitNo)
    {
        return $this->listOfTimePoints[$visitNo-1];
    }

    /**
     * Return a piece of data about this candidate 
     *
     * @param string $var The type of data about the Candidate
     *                    to be returned
     *
     * @return mixed The info requested 
     */
    function getData($var = null)
    {
        if (is_null($var)) {
            return $this->candidateInfo;
        } else {
            return $this->candidateInfo[$var];
        }
    }

    /**
     * Sets some data about the candidate and saves it into the
     * database
     *
     * @param string $var   The variable to be set
     * @param any    $value The value to be set to
     *
     * @return true on success, PEAR Error otherwise
     */
    function setData($var, $value=null)
    {
        if (!is_array($var)) {
            $setData = array($var=>$value);
        } else {
            $setData = $var;
        }

        $this->candidateInfo = array_merge($this->candidateInfo, $setData);

        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }
        $success = $db->update(
            'candidate',
            $setData,
            array(
                'CandID'=>$this->getData('CandID')
            )
        );
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "Candidate::setData: ".$success->getMessage()
            );
        }
        return true;
    }


    /**
     * Returns the ProjectID for the current candidate
     *
     * @return integer CandID of candidate
     */
    function getProjectID()
    {
        return $this->candidateInfo["ProjectID"];
    }

    /**
     * Returns the name of the candidate's project from the
     * config file
     *
     * @return string Project name
     */
    function getProjectTitle()
    {
        $ProjectList = Utility::getProjectList();
        return $ProjectList[$this->getProjectID()];
    }

    /**
     * Returns the CandID of this candidate
     *
     * @return integer 6 digit CandID
     */
    function getCandID()
    {
        return $this->candidateInfo["CandID"];
    }


    /**
     * Returns the PSCID of this candidate
     *
     * @return string The PSCID identifier for candidate
     */
    function getPSCID()
    {
        return $this->candidateInfo["PSCID"];
    }

    /**
     * Returns the site of this candidate
     *
     * @return string Site name of this candidate's site
     */
    function getCandidateSite()
    {
        return $this->candidateInfo["PSC"];
    }
    

    /**
     * Returns the ID of this candidate's site
     *
     * @return integer The numeric ID of the candidate's site
     */
    function getCenterID()
    {
        return $this->candidateInfo["CenterID"];
    }

    /**
     * Returns the date of birth of this candidate
     *
     * @return string The DoB in YYYY-MM-DD format
     */
    function getCandidateDoB()
    {
        return $this->candidateInfo["DoB"];
    }

    /**
     * Returns the expect date of confinement (due date)
     * of this candidate.
     *
     * @return string The DoB in YYYY-MM-DD format
     */
    function getCandidateEDC()
    {
        return $this->candidateInfo["EDC"];
    }

    /**
     * Return the candidate's gender
     *
     * @return Male|Female String describing the gender
     */
    function getCandidateGender()
    {
        return $this->candidateInfo["Gender"];
    }

    /**
     * Return the candidate's ethnicity
     *
     * @return string The ethnicity of candidate
     * @deprecated
     */
    function getCandidateEthnicity()
    {
        return $this->candidateInfo["Ethnicity"];
    }

    /**
     * Return the candidate's zip code
     *
     * @return string The zip code of the candidate
     * @deprecated
     */
    function getCandidateZIP()
    {
        return $this->candidateInfo["ZIP"];
    }

    /**
     * Return whether the candidate is active
     *
     * @return Y|N|null Active flag for this candidate
     */
    function isActive()
    {
        return $this->candidateInfo["Active"];
    }

    /**
     * Return the user that registered (created) this candidate
     *
     * @return string UserID of user who created this candidate.
     */
    function registeredBy()
    {
        return $this->candidateInfo["RegisteredBy"];
    }

    /**
     * Return the user who last changed this candidate
     *
     * @return string UserID of user who last changed this candidate
     */
    function lastRecordChangeBy()
    {
        return $this->candidateInfo["UserID"];
    }
    
    /**
     * Returns the list of visit labels w/ corresponding SessionID as key
     * 
     *@return array Associative array in the format SessionID=>Visit_label
     *@throws PEAR:Error
     */
    function getListOfVisitLabels()
    {
        //make sure it returns an array
        $visitLabelArray = array();

        $candID=$this->getCandID();
        // make a local reference to the Database object
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }

        $query  = "SELECT ID, Visit_label FROM session 
            WHERE CandID=:Candidate AND Active='Y' ORDER BY ID";
        $result = $db->pselect($query, array('Candidate' => $candID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Could not retrieve existing data for session");
        }

        // map the array [VisitNo]=>Visit_label
        foreach ($result as $row) {
            $visitLabelArray[$row["ID"]] = $row["Visit_label"];
        }
        return $visitLabelArray;
    }

    /**
     * return the next visit number for the time point you are
     * trying to register can be called statically
     *
     * @return integer Next visit number for candidate
     * @deprecated
     *@throws PEAR:Error
     */
    function getNextVisitNo()
    {
        $candID=$this->getCandID();
        // make a local reference to the Database object
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }

        $query  = "SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitNo 
            FROM session 
            WHERE CandID=:CaID AND (Active='Y' OR Active is null)
            GROUP BY CandID";
        $result = $db->pselectRow($query, array('CaID' => $candID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Could not retrieve existing data for session");
        }
        
        //return the next visit No
        return $result["nextVisitNo"];
    }

    /**
     * return the suggested visit label for the time point you are
     * trying to register
     * can be called statically
     *
     * @return string Next suggested visit label
     * @throws PEAR:Error
     */
    function getNextVisitLabel()
    {
        $config =& NDB_Config::singleton();
        $visitLabelSettings = $config->getSetting('visitLabels');
        
        $candID=$this->getCandID();
        // make a local reference to the Database object
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }

        if ($visitLabelSettings['generation'] == 'user' 
            && !empty($visitLabelSettings['suggest'])
        ) {
            $existingVisitLabels = $this->getListOfVisitLabels();
            $query  = "SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitLabel 
                FROM session 
                WHERE CandID=:CaID AND (Active='Y' OR Active is null)
                GROUP BY CandID";
            $result = $db->pselectRow($query, array('CaID' => $candID));
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError(
                    "Could not retrieve existing data for session"
                );
            }
    
            $nextVisitLabel = $result['nextVisitLabel'];
            if (!empty($existingVisitLabels)) {
                while (in_array($nextVisitLabel, $existingVisitLabels)) {
                    $nextVisitLabel++;
                }
            } else {
                // display V1 as a suggested visit label when starting
                // the 1st timepoint
                $nextVisitLabel = '1';
            }
            
            $nextVisitLabel = str_replace(
                '%value%',
                $nextVisitLabel,
                $visitLabelSettings['suggest']
            );
        }
        
        //return the next visit No
        return $nextVisitLabel;
    }
    
    /**
     * Generates list of valid subprojects for a the selected Candidate's
     * project
     *
     * @return array Array of the form SubprojectID => SubprojectID
     * @throws PEAR::Error
     */
    function getValidSubprojects()
    {
        $projID = $this->getProjectID();
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }
        $query  = "SELECT SubprojectID from project_rel where ProjectID = :prj";
        $params = array('prj'=>$projID);
        $subproj   = $db->pselect($query, $params);
        if (Utility::isErrorX($subproj)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$subproj->getMessage()
            );
        }
        foreach ($subproj as $row) {
            foreach ($row as $key =>$val) {
                if ($key == 'SubprojectID') {
                    $subprojList[$val] = $val;
                }
            }
        }
        return $subprojList;
    }
    /**
     * Returns first visit for a candidate based on Date_visit
     *
     * @return string The visit label for the candidate's first visit
     */
    function getFirstVisit()
    {
        $candID = $this->getCandID();
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$db->getMessage()
            );
        }
    
        $query  = "SELECT Visit_label
            FROM session s JOIN candidate c ON (c.CandID = s.CandID) 
            WHERE c.CandID=:cid ORDER BY Date_Visit";
        $where  = array('cid'=>$candID);
        $vLabel = $db->pselectOne($query, $where);
        if (Utility::isErrorX($vLabel)) {
            return PEAR::raiseError(
                "Could not connect to database: " . $vLabel->getMessage()
            );
        }

        return $vLabel;
    }


    /**
    * Generates a new random CandID
    *
    * @return integer An unused random 6 digit candidate id
    * @throws PEAR::Error
    */
    static function _generateCandID()
    {
        // get a database connection
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return $db;
        }
        
        // generate a candidate id
        $candID = rand(CANDIDATE_MIN_CANDID, CANDIDATE_MAX_CANDID);
        
        // make sure the cand id is not used
        while ($db->pselectOne(
            "SELECT count(CandID) FROM candidate WHERE CandID=:CaID",
            array('CaID' => $candID)
        ) > 0) {
            // pick a new candidate id
            $candID = rand(CANDIDATE_MIN_CANDID, CANDIDATE_MAX_CANDID);
        }
        
        return $candID;
    }  

    /**
    * Generates a new PSCID in the format defined by the config file
    *
    * @param string $prefix The prefix to use for the PSCID
    *
    * @return string Project candidate id in format defined by config.xml
    * @throws PEAR::Error
    */
    static function _generatePSCID($prefix)
    {
        // get a database connection
        $db =& Database::singleton();
        if (Utility::isErrorX($db)) {
            return $db;
        }
        
        $config =& NDB_Config::singleton();
        $PSCIDSettings = $config->getSetting('PSCID');
        $pscidArrays = Candidate::generateArrays($PSCIDSettings, $prefix);

        // run one first time, then loop until the pscid is not used
        do {
            // pick a new pscid
            if ($PSCIDSettings['generation'] == 'sequential') {
                if (!empty($pscid)) {
                    $pscid++;
                } else {
                    $pscid = Candidate::generateFirstStringFromArrays($pscidArrays);
                }
            } else {
                $pscid = Candidate::generateRandomStringFromArrays($pscidArrays);
            }

            // check if the pscid is used
        } while($db->pselectOne("SELECT count(PSCID) FROM candidate WHERE PSCID=:PID", array('PID' => $pscid)) > 0);

        return $pscid;
    }

    function _generateExternalID() {
        $config =& NDB_Config::singleton();
        $ExternalIDSettings = $config->getSetting('ExternalID');
        $ExternalIDArrays = Candidate::generateArrays($ExternalIDSettings);

        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return $db;
        }

        do {
            // genereate a new external ID
            if($ExternalIDSettings['generation'] == 'sequential') {
                if(!empty($externalID)) {
                    $externalID++;
                } else {
                    $externalID = Candidate::generateFirstStringFromArrays($ExternalIDArrays);
                }
            } else {
                $externalID = Candidate::generateRandomStringFromArrays($ExternalIDArrays);
            }

            // check if the external ID is used
        } while($db->pselectOne("SELECT count(ExternalID) FROM candidate WHERE ExternalID=:EID", array('EID'=>$externalID))  > 0);

        return $externalID;
    }

    /**
     * Validate's that a PSCID matches the format defined by project
     * config
     *
     * @param string $PSCID      The PSCID to validate
     * @param string $siteAbbrev (optional) The site of the candidate
     *                           being validated to check against appropriate
     *                           parts of PSCID definition
     *
     * @return boolean True if PSCID is valid
     */
    static function validatePSCID($PSCID, $siteAbbrev=null)
    {
        $config =& NDB_Config::singleton();
        $PSCIDSettings = $config->getSetting('PSCID');
        $regex = Utility::structureToPCRE(
            $PSCIDSettings['structure'], 
            $siteAbbrev
        );
        return preg_match($regex, $PSCID);
    }


    /**
     * Helper function used to generate PSCID. This generates a random
     * number if generation is not "sequential"
     *
     * @param array $arrays Array specifying format of random
     *                      string to be generated
     *
     * @return string A random string matching format from arrays
     */
    static function generateRandomStringFromArrays($arrays)
    {
        $string = "";
        foreach ($arrays AS $array) {
            if (is_array($array)) {
                $string .= $array[array_rand($array)];
            } else {
                $string .= $array;
            }
        }
        return $string;
    }

    /**
     * Helper function used to generate PSCID. Generate the string for the first
     * numeric part of the PSCID if generation type is "sequential" and pads with
     * an appropriate numbers.
     *
     * @param array $arrays An array config file specifying format of number
     *
     * @return string The first string to be used for the PSCID
     */
    static function generateFirstStringFromArrays($arrays)
    {
        $string = "";
        foreach ($arrays AS $array) {
            $string .= array_shift($array);
        }
        return $string;
    }

    /**
     * Helper function used for generating PSCID.
     * This parses the PSCID format in the config file into a format that
     * can be converted into a regex for validation.
     *
     * @param array  $idStructure The structure defined in the config file in the
     *                            array format returned by NDB_Config.
     * @param string $siteAbbrev  The candidate being validate's site abbreviation,
     *                            so that it can be inserted into relevant "site"
     *                            parts of the regex generated.
     *
     * @return array An array of regular expressions defining each section of
     *               the PSCID as defined in config.xml
     */
    static function generateArrays($idStructure, $siteAbbrev=null)
    {
        $idStructure = $idStructure['structure']['seq'];

        $arrays = array();
        foreach ($idStructure AS $seq) {
            if (isset($seq['@']['length'])) {
                $length = $seq['@']['length'];
            } elseif (isset($seq['@']['minLength'])) {
                $length = $seq['@']['minLength'];
            } else {
                $length = 1;
            }

            for ($i=0; $i<$length; $i++) {
                switch($seq['@']['type']) {
                case 'alpha':
                    $arrays[] = range('a', 'z');
                    break;
                
                case 'alphanumeric':
                    $arrays[] = array_merge(range(0, 9), range('a', 'z'));
                    break;
                
                case 'numeric':
                    $arrays[] = range(0, 9);
                    break;
                
                case 'static':
                    $arrays[] = array($seq['#']);
                    break;

                case 'set':
                    if (strpos($seq['#'], '|') !== false) {
                        $arrays[] = explode('|', $seq['#']);
                    } else {
                        $arrays[] = str_split($seq['#']);
                    }
                    break;

                case 'siteAbbrev':
                    $arrays[] = array($siteAbbrev);
                    break;
                }
            }
        }

        return $arrays;
    }

}
?>
