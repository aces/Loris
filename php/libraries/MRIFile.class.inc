<?php declare(strict_types=1);

/**
 * Contains the MRIFile class used for NeuroDB imaging
 *
 * PHP Version 8
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * This object represents an imaging file in the files table.
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class MRIFile
{
    public $fileData    = [];
    public $parameters  = [];
    public $QCData      = [];
    public $intermFiles = [];
    public $protFiles   = [];

    /**
     * Construct an MRIFile
     *
     * @param integer $fileID The FileID to be loaded
     */
    function __construct(int $fileID)
    {
        $db     = \NDB_Factory::singleton()->database();
        $params = ['FID' => $fileID];

        $query    = "SELECT * FROM files WHERE FileID=:FID";
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
        $query      = "SELECT * FROM files_intermediary WHERE Output_FileID=:FID";
        $intermFile = $db->pselectRow($query, $params);
        if (!empty($intermFile)) {
            foreach ($intermFile AS $key=>$value) {
                $this->intermFiles[$key] = $value;
            }
        }
        $query    = "SELECT ProtocolFile
            FROM files as f, mri_processing_protocol as mpp
            WHERE f.ProcessProtocolID=mpp.ProcessProtocolID AND FileID=:FID";
        $protFile = $db->pselectRow($query, $params);
        if (!empty($protFile)) {
            foreach ($protFile AS $key=>$value) {
                $this->protFiles[$key] = $value;
            }
        }
    }

    /**
     * Gets a parameter for this file from the appropriate place
     *
     * @param string $parameterName The parameter to be retrieved
     *
     * @return ?string The value of the parameter
     */
    function getParameter(string $parameterName): ?string
    {
        if (isset($this->QCData[$parameterName])) {
            return strval($this->QCData[$parameterName]);
        }
        if (isset($this->intermFiles[$parameterName])) {
            return strval($this->intermFiles[$parameterName]);
        }
        if (isset($this->protFiles[$parameterName])) {
            return strval($this->protFiles[$parameterName]);
        }

        if (isset($this->fileData[$parameterName])) {
            return strval($this->fileData[$parameterName]);
        } elseif (isset($this->parameters[$parameterName])) {
            return strval($this->parameters[$parameterName]);
        } else {
            return null;
        }
    }

    /**
     * Gets the AcquisitionProtocol for this file
     *
     * @return ?string the type of scan
     */
    function getAcquisitionProtocol(): ?string
    {
        if (is_null($this->fileData['MriScanTypeID'])) {
            return null;
        }

        return \NDB_Factory::singleton()->database()->pselectOne(
            'SELECT MriScanTypeName FROM mri_scan_type
             WHERE MriScanTypeID=:ID',
            ['ID' => $this->fileData['MriScanTypeID']]
        );
    }
}
