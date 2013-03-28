<?php
/**
 * @package mri
 */
class MRIFile
{
    var $fileData = array();
    var $parameters = array();
    var $QCData = array();
    
    function MRIFile($fileID)
    {
        $db =& Database::singleton();
        $params = array('FID' => $fileID);
        
        $query = "SELECT * FROM files WHERE FileID=:FID";
        $fileData = $db->pselectRow($query, $params);
        foreach($fileData AS $key=>$value) {
            $this->fileData[$key] = $value;
        }
        
        $query = "SELECT * FROM files_qcstatus WHERE FileID=:FID";
        $qcData = $db->pselectRow($query, $params);
        if(!empty($qcData)) {
            foreach($qcData AS $key=>$value) {
                $this->QCData[$key] = $value;
            }
        }
        $query = "SELECT Name, Value FROM parameter_file as p, parameter_type as f WHERE f.ParameterTypeID=p.ParameterTypeID AND FileID=:FID";
        $parameterRaw = $db->select($query, $params);
        foreach($parameterRaw AS $row) {
            $this->parameters[$row['Name']] = $row['Value'];
        }
    }
    
    function getParameter($parameterName)
    {
        if(isset($this->QCData[$parameterName]))       return $this->QCData[$parameterName];
        if(isset($this->fileData[$parameterName]))       return $this->fileData[$parameterName];
        elseif(isset($this->parameters[$parameterName])) return $this->parameters[$parameterName];
        else return null;
    }
    
    function getAcquisitionProtocol()
    {
        $db =& Database::singleton();
        
        if(is_null($this->fileData['AcquisitionProtocolID'])) return null;
        
        $query = "SELECT Scan_type FROM mri_scan_type WHERE ID=:ProtoID";
        $acquisitionProtocol = $db->pselectOne($query, array('ProtoID' => $this->fileData['AcquisitionProtocolID']));
        return $acquisitionProtocol;
    }
}
