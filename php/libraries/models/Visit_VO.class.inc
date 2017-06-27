<?php
/**
 * Timepoint Value Object (VO).
 * This class contains all database handling that is needed to
 * permanently store and retrieve Timepoint object instances.
 */
namespace LORIS\Models;

class Visit_VO
{
    /**
     * Persistent Instance variables. This data is directly
     * mapped to the columns of database table.
     */
    private $_ID;
    private $_CandID;
    private $_CenterID;
    private $_VisitNo;
    private $_Visit_label;
    private $_SubprojectID;
    private $_Submitted;
    private $_Current_stage;
    private $_Date_stage_change;
    private $_Screening;
    private $_Date_screening;
    private $_Visit;
    private $_Date_visit;
    private $_Approval;
    private $_Date_approval;
    private $_Active;
    private $_Date_active;
    private $_RegisteredBy;
    private $_UserID;
    private $_Date_registered;
    private $_Testdate;
    private $_Hardcopy_request;
    private $_BVLQCStatus;
    private $_BVLQCType;
    private $_BVLQCExclusion;
    private $_QCd;
    private $_Scan_done;
    private $_MRIQCStatus;
    private $_MRIQCPending;
    private $_MRIQCFirstChangeTime;
    private $_MRIQCLastChangeTime;
    private $_MRICaveat;

    public function getID() {return $this->_ID;}
    public function getCandID() {return $this->_CandID;}
    public function getCenterID() {return $this->_CenterID;}
    public function getVisitNo() {return $this->_VisitNo;}
    public function getVisit_label() {return $this->_Visit_label;}
    public function getSubprojectID() {return $this->_SubprojectID;}
    public function getSubmitted() {return $this->_Submitted;}
    public function getCurrent_stage() {return $this->_Current_stage;}
    public function getDate_stage_change() {return $this->_Date_stage_change;}
    public function getScreening() {return $this->_Screening;}
    public function getDate_screening() {return $this->_Date_screening;}
    public function getVisit() {return $this->_Visit;}
    public function getDate_visit() {return $this->_Date_visit;}
    public function getApproval() {return $this->_Approval;}
    public function getDate_approval() {return $this->_Date_approval;}
    public function getActive() {return $this->_Active;}
    public function getDate_active() {return $this->_Date_active;}
    public function getRegisteredBy() {return $this->_RegisteredBy;}
    public function getUserID() {return $this->_UserID;}
    public function getDate_registered() {return $this->_Date_registered;}
    public function getTestdate() {return $this->_Testdate;}
    public function getHardcopy_request() {return $this->_Hardcopy_request;}
    public function getBVLQCStatus() {return $this->_BVLQCStatus;}
    public function getBVLQCType() {return $this->_BVLQCType;}
    public function getBVLQCExclusion() {return $this->_BVLQCExclusion;}
    public function getQCd() {return $this->_QCd;}
    public function getScan_done() {return $this->_Scan_done;}
    public function getMRIQCStatus() {return $this->_MRIQCStatus;}
    public function getMRIQCPending() {return $this->_MRIQCPending;}
    public function getMRIQCFirstChangeTime() {return $this->_MRIQCFirstChangeTime;}
    public function getMRIQCLastChangeTime() {return $this->_MRIQCLastChangeTime;}
    public function getMRICaveat() {return $this->_MRICaveat;}

    public function setID($value) {$this->_ID = $value;}
    public function setCandID($value) {$this->_CandID = $value;}
    public function setCenterID($value) {$this->_CenterID = $value;}
    public function setVisitNo($value) {$this->_VisitNo = $value;}
    public function setVisit_label($value) {$this->_Visit_label = $value;}
    public function setSubprojectID($value) {$this->_SubprojectID = $value;}
    public function setSubmitted($value) {$this->_Submitted = $value;}
    public function setCurrent_stage($value) {$this->_Current_stage = $value;}
    public function setDate_stage_change($value) {$this->_Date_stage_change = $value;}
    public function setScreening($value) {$this->_Screening = $value;}
    public function setDate_screening($value) {$this->_Date_screening = $value;}
    public function setVisit($value) {$this->_Visit = $value;}
    public function setDate_visit($value) {$this->_Date_visit = $value;}
    public function setApproval($value) {$this->_Approval = $value;}
    public function setDate_approval($value) {$this->_Date_approval = $value;}
    public function setActive($value) {$this->_Active = $value;}
    public function setDate_active($value) {$this->_Date_active = $value;}
    public function setRegisteredBy($value) {$this->_RegisteredBy = $value;}
    public function setUserID($value) {$this->_UserID = $value;}
    public function setDate_registered($value) {$this->_Date_registered = $value;}
    public function setTestdate($value) {$this->_Testdate = $value;}
    public function setHardcopy_request($value) {$this->_Hardcopy_request = $value;}
    public function setBVLQCStatus($value) {$this->_BVLQCStatus = $value;}
    public function setBVLQCType($value) {$this->_BVLQCType = $value;}
    public function setBVLQCExclusion($value) {$this->_BVLQCExclusion = $value;}
    public function setQCd($value) {$this->_QCd = $value;}
    public function setScan_done($value) {$this->_Scan_done = $value;}
    public function setMRIQCStatus($value) {$this->_MRIQCStatus = $value;}
    public function setMRIQCPending($value) {$this->_MRIQCPending = $value;}
    public function setMRIQCFirstChangeTime($value) {$this->_MRIQCFirstChangeTime = $value;}
    public function setMRIQCLastChangeTime($value) {$this->_MRIQCLastChangeTime = $value;}
    public function setMRICaveat($value) {$this->_MRICaveat = $value;}

    public function setAll(array &$allVals)
    {
        $this->_ID = $allVals['ID'];
        $this->_CandID = $allVals['CandID'];
        $this->_CenterID = $allVals['CenterID'];
        $this->_VisitNo = $allVals['VisitNo'];
        $this->_Visit_label = $allVals['Visit_label'];
        $this->_SubprojectID = $allVals['SubprojectID'];
        $this->_Submitted = $allVals['Submitted'];
        $this->_Current_stage = $allVals['Current_stage'];
        $this->_Date_stage_change = $allVals['Date_stage_change'];
        $this->_Screening = $allVals['Screening'];
        $this->_Date_screening = $allVals['Date_screening'];
        $this->_Visit = $allVals['Visit'];
        $this->_Date_visit = $allVals['Date_visit'];
        $this->_Approval = $allVals['Approval'];
        $this->_Date_approval = $allVals['Date_approval'];
        $this->_Active = $allVals['Active'];
        $this->_Date_active = $allVals['Date_active'];
        $this->_RegisteredBy = $allVals['RegisteredBy'];
        $this->_UserID = $allVals['UserID'];
        $this->_Date_registered = $allVals['Date_registered'];
        $this->_Testdate = $allVals['Testdate'];
        $this->_Hardcopy_request = $allVals['Hardcopy_request'];
        $this->_BVLQCStatus = $allVals['BVLQCStatus'];
        $this->_BVLQCType = $allVals['BVLQCType'];
        $this->_BVLQCExclusion = $allVals['BVLQCExclusion'];
        $this->_QCd = $allVals['QCd'];
        $this->_Scan_done = $allVals['Scan_done'];
        $this->_MRIQCStatus = $allVals['MRIQCStatus'];
        $this->_MRIQCPending = $allVals['MRIQCPending'];
        $this->_MRIQCFirstChangeTime = $allVals['MRIQCFirstChangeTime'];
        $this->_MRIQCLastChangeTime = $allVals['MRIQCLastChangeTime'];
        $this->_MRICaveat = $allVals['MRICaveat'];
    }
}
