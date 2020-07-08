<?php
/**
 * Contains the Genomic_File class used for LORIS Genomic data
 *
 * PHP Version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser;
/**
 * This object represents a genomic file in the genomic_files table.
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Genomic_File
{
    var $fileData   = array();
    var $parameters = array();
    var $QCData     = array();

    /**
     * Construct a GenomicFile
     *
     * @param integer $fileID The FileID to be loaded
     *
     * @return void
     */
    function __construct(int $fileID)
    {
        $db     =& \Database::singleton();
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
     * Gets a parameter for this file from the appropriate place.
     *
     * @param string $parameterName The parameter to be retrieved.
     *
     * @return ?string The value of the requested parameter. All values will be
     * represented as strings even if they are e.g. ints or dates.
     */
    public function getParameter(string $parameterName): ?string
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
}
