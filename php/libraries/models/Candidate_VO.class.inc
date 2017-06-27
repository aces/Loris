<?php
/**
 * Candidate Value Object (VO).
 * This class contains all database handling that is needed to
 * permanently store and retrieve Candidate object instances.
 */
namespace LORIS\Models;

class Candidate_VO
{
    /**
     * Persistent Instance variables. This data is directly
     * mapped to the columns of database table.
     */
    private $_ID;
    private $_CandID;
    private $_PSCID;
    private $_ExternalID;
    private $_DoB;
    private $_EDC;
    private $_Gender;
    private $_CenterID;
    private $_ProjectID;
    private $_Ethnicity;
    private $_Active;
    private $_Date_active;
    private $_RegisteredBy;
    private $_UserID;
    private $_Date_registered;
    private $_flagged_caveatemptor;
    private $_flagged_reason;
    private $_flagged_other;
    private $_flagged_other_status;
    private $_Testdate;
    private $_Entity_type;
    private $_ProbandGender;
    private $_ProbandDoB;

    public function getID() {return $this->_ID;}
    public function setID($ID) {$this->_ID = $ID;}
    public function getCandID() {return $this->_CandID;}
    public function setCandID($CandID) {$this->_CandID = $CandID;}
    public function getPSCID() {return $this->_PSCID;}
    public function setPSCID($PSCID) {$this->_PSCID = $PSCID;}
    public function getExternalID() {return $this->_ExternalID;}
    public function setExternalID($ExternalID) {$this->_ExternalID = $ExternalID;}
    public function getDoB() {return $this->_DoB;}
    public function setDoB($DoB) {$this->_DoB = $DoB;}
    public function getEDC() {return $this->_EDC;}
    public function setEDC($EDC) {$this->_EDC = $EDC;}
    public function getGender() {return $this->_Gender;}
    public function setGender($Gender) {$this->_Gender = $Gender;}
    public function getCenterID() {return $this->_CenterID;}
    public function setCenterID($CenterID) {$this->_CenterID = $CenterID;}
    public function getProjectID() {return $this->_ProjectID;}
    public function setProjectID($ProjectID) {$this->_ProjectID = $ProjectID;}
    public function getEthnicity() {return $this->_Ethnicity;}
    public function setEthnicity($Ethnicity) {$this->_Ethnicity = $Ethnicity;}
    public function getActive() {return $this->_Active;}
    public function setActive($Active) {$this->_Active = $Active;}
    public function getDate_active() {return $this->_Date_active;}
    public function setDate_active($Date_active) {$this->_Date_active = $Date_active;}
    public function getRegisteredBy() {return $this->_RegisteredBy;}
    public function setRegisteredBy($RegisteredBy) {$this->_RegisteredBy = $RegisteredBy;}
    public function getUserID() {return $this->_UserID;}
    public function setUserID($UserID) {$this->_UserID = $UserID;}
    public function getDate_registered() {return $this->_Date_registered;}
    public function setDate_registered($Date_registered) {$this->_Date_registered = $Date_registered;}
    public function getFlagged_caveatemptor() {return $this->_flagged_caveatemptor;}
    public function setFlagged_caveatemptor($flagged_caveatemptor) {$this->_flagged_caveatemptor = $flagged_caveatemptor;}
    public function getFlagged_reason() {return $this->_flagged_reason;}
    public function setFlagged_reason($flagged_reason) {$this->_flagged_reason = $flagged_reason;}
    public function getFlagged_other() {return $this->_flagged_other;}
    public function setFlagged_other($flagged_other) {$this->_flagged_other = $flagged_other;}
    public function getFlagged_other_status() {return $this->_flagged_other_status;}
    public function setFlagged_other_status($flagged_other_status) {$this->_flagged_other_status = $flagged_other_status;}
    public function getTestdate() {return $this->_Testdate;}
    public function setTestdate($Testdate) {$this->_Testdate = $Testdate;}
    public function getEntity_type() {return $this->_Entity_type;}
    public function setEntity_type($Entity_type) {$this->_Entity_type = $Entity_type;}
    public function getProbandGender() {return $this->_ProbandGender;}
    public function setProbandGender($ProbandGender) {$this->_ProbandGender = $ProbandGender;}
    public function getProbandDoB() {return $this->_ProbandDoB;}
    public function setProbandDoB($ProbandDoB) {$this->_ProbandDoB = $ProbandDoB;}

    public function setAll(array &$allVals) {
        $this->_ID = $allVals['ID'];
        $this->_CandID = $allVals['CandID'];
        $this->_PSCID = $allVals['PSCID'];
        $this->_ExternalID = $allVals['ExternalID'];
        $this->_DoB = $allVals['DoB'];
        $this->_EDC = $allVals['EDC'];
        $this->_Gender = $allVals['Gender'];
        $this->_CenterID = $allVals['CenterID'];
        $this->_ProjectID = $allVals['ProjectID'];
        $this->_Ethnicity = $allVals['Ethnicity'];
        $this->_Active = $allVals['Active'];
        $this->_Date_active = $allVals['Date_active'];
        $this->_RegisteredBy = $allVals['RegisteredBy'];
        $this->_UserID = $allVals['UserID'];
        $this->_Date_registered = $allVals['Date_registered'];
        $this->_flagged_caveatemptor = $allVals['flagged_caveatemptor'];
        $this->_flagged_reason = $allVals['flagged_reason'];
        $this->_flagged_other = $allVals['flagged_other'];
        $this->_flagged_other_status = $allVals['flagged_other_status'];
        $this->_Testdate = $allVals['Testdate'];
        $this->_Entity_type = $allVals['Entity_type'];
        $this->_ProbandGender = $allVals['ProbandGender'];
        $this->_ProbandDoB = $allVals['ProbandDoB'];
    }

}
