<?php
/**
* Contains the GenomicFile class used for LORIS Genomic data
*
* PHP Version 5
*
* @category   Genomic
* @package    Main
* @subpackage Genomic
* @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
* @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link       https://www.github.com/aces/Loris/
*/

/**
    * This object represents a genomic file in the genomic_files table.
    *
    * @category   Genomic
    * @package    Main
    * @subpackage Genomic
    * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
    * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
    * @link       https://www.github.com/aces/Loris/
*/
class GenomicFile
{
    var $fileData   = array();
    var $parameters = array();
    var $QCData     = array();

    /**
    * Construct a GenomicFile
    *
    * @param integer $fileID The FileID to be loaded
    */
    function __construct($fileID)
    {
        $db     =& Database::singleton();
        $params = array('FID' => $fileID);

        $query    = "SELECT * FROM genomic_files WHERE GenomicFileID=:FID";
        $fileData = $db->pselectRow($query, $params);
        foreach ($fileData AS $key=>$value) {
            $this->fileData[$key] = $value;
        }

        $query  = "SELECT * FROM files_qcstatus WHERE FileID=:FID";
        $qcData = $db->pselectRow($query, $params);
        if (!empty($qcData)) {
            foreach ($qcData AS $key=>$value) {
                $this->QCData[$key] = $value;
            }
        }
        $query        = "SELECT Name, Value
        FROM parameter_file as p, parameter_type as f
          WHERE f.ParameterTypeID=p.ParameterTypeID AND FileID=:FID";
        $parameterRaw = $db->pselect($query, $params);
        foreach ($parameterRaw AS $row) {
            $this->parameters[$row['Name']] = $row['Value'];
        }
    }

    /**
    * Gets a parameter for this file from the appropriate place
    *
    * @param string $parameterName The parameter to be retrieved
    *
    * @return mixed The value of the parameter
    */
    function getParameter($parameterName)
    {
        if (isset($this->QCData[$parameterName])) {
            return $this->QCData[$parameterName];
        }
        if (isset($this->fileData[$parameterName])) {
            return $this->fileData[$parameterName];
        } elseif (isset($this->parameters[$parameterName])) {
            return $this->parameters[$parameterName];
        } else {
            return null;
        }
    }

    /**
    * Gets the AnalysisProtocol for this file
    *
    * @return String from the file properties
    */
    function getAnalysisProtocol()
    {
        if (is_null($this->fileData['AnalysisProtocol'])) {
            return null;
        }
        return $this->fileData['AnalysisProtocol'];
    }

}
