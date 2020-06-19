<?php declare(strict_types=1);
/**
 * Contains the ElectrophysioFile class used for electrophysiological browser
 *
 * PHP Version 7
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\electrophysiology_browser\Models;

/**
 * This object represents an electrophysiology file in the physiological_file table.
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ElectrophysioFile implements \LORIS\Data\DataInstance
{
    private $_fileData   = [];
    private $_parameters = [];

    /**
     * Construct a BIDSFile
     *
     * @param integer $physiologicalFileID The PhysiologicalFileID to be loaded
     */
    function __construct(int $physiologicalFileID)
    {

        $db = \NDB_Factory::singleton()->database();

        $query    = "SELECT 
                       PhysiologicalFileID,
                       PhysiologicalModalityID,
                       PhysiologicalOutputTypeID,
                       SessionID,
                       InsertTime,
                       FileType,
                       AcquisitionTime,
                       InsertedByUser,
                       FilePath  
                     FROM physiological_file 
                     WHERE PhysiologicalFileID=:PFID";
        $params   = ['PFID' => $physiologicalFileID];
        $fileData = $db->pselectRow($query, $params);

        foreach ($fileData AS $key=>$value) {
            $this->_fileData[$key] = $value;
        }

        $query        = "SELECT 
                           pt.Name, 
                           ppf.Value
                         FROM physiological_parameter_file as ppf
                           LEFT JOIN parameter_type as pt USING (ParameterTypeID)
                         WHERE 
                          PhysiologicalFileID=:PFID";
        $parameterRaw = $db->pselect($query, $params);

        foreach ($parameterRaw AS $row) {
            $this->_parameters[$row['Name']] = $row['Value'];
        }
    }

    /**
     * Gets a parameter for this file from the appropriate place
     *
     * @param string $parameterName The parameter to be retrieved
     *
     * @return string The value of the parameter
     */
    function getParameter(string $parameterName): string
    {
        return $this->_fileData[$parameterName] ??
            ($this->_parameters[$parameterName] ?? '');
    }

    /**
     * Implements \LORIS\Data\DataInstance interface
     *
     * @return string
     */
    public function toJSON(): string
    {
        return '';
    }
}