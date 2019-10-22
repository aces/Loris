<?php
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
/**
 * This object represents an electrophysiology file in the physiological_file table.
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ElectrophysioFile
{
    var $fileData   = array();
    var $parameters = array();

    /**
     * Construct a BIDSFile
     *
     * @param integer $physiologicalFileID The PhysiologicalFileID to be loaded
     */
    function __construct(int $physiologicalFileID)
    {
        $db = \NDB_Factory::singleton()->database();

        $query    = "SELECT * 
                     FROM physiological_file 
                     WHERE PhysiologicalFileID=:PFID";
        $params   = array('PFID' => $physiologicalFileID);
        $fileData = $db->pselectRow($query, $params);

        foreach ($fileData AS $key=>$value) {
            $this->fileData[$key] = $value;
        }

        $query        = "SELECT 
                           Name, 
                           Value
                         FROM 
                           physiological_parameter_file as ppf, 
                           parameter_type as pt
                         WHERE 
                           ppf.ParameterTypeID=pt.ParameterTypeID 
                           AND PhysiologicalFileID=:PFID";
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
    function getParameter(string $parameterName)
    {
        return $this->fileData[$parameterName] ??
            ($this->parameters[$parameterName] ?? '');
    }
}