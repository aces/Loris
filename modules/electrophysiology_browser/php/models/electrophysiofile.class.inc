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
    private $_fileData     = [];
    private $_parameters   = [];
    private $_chunksURLs   = [];
    private $_splitFileIDs = [];
    private \LORIS\LorisInstance $loris;


    /**
     * Construct a BIDSFile
     *
     * @param \LORIS\LorisInstance $loris               The LORIS instance that the
     *                                                  module is serving.
     * @param integer              $physiologicalFileID Electrophysiological File ID
     */
    function __construct(\LORIS\LorisInstance $loris, int $physiologicalFileID)
    {
        $this->loris = $loris;
        $db          = $this->loris->getDatabaseConnection();

        $query    = "SELECT
                       PhysiologicalFileID,
                       PhysiologicalModality as Modality,
                       PhysiologicalOutputTypeID,
                       SessionID,
                       InsertTime,
                       FileType,
                       AcquisitionTime,
                       InsertedByUser,
                       FilePath
                     FROM physiological_file
                       LEFT JOIN physiological_modality as pm
                       USING (PhysiologicalModalityID)
                     WHERE PhysiologicalFileID=:PFID";
        $fileData = $db->pselectRow($query, ['PFID' => $physiologicalFileID]);

        foreach ($fileData AS $key=>$value) {
            $this->_fileData[$key] = $value;
        }

        $query        = "SELECT
                           pt.Name,
                           ppf.Value
                         FROM physiological_parameter_file as ppf
                           LEFT JOIN parameter_type as pt USING (ParameterTypeID)
                         WHERE
                          PhysiologicalFileID=:PFID
                          AND pt.Name <> 'electrophysiology_chunked_dataset_path'";
        $parameterRaw = $db->pselect($query, ['PFID' => $physiologicalFileID]);

        foreach ($parameterRaw AS $row) {
            $this->_parameters[$row['Name']] = $row['Value'];
        }

        /*
         * Split files
         *
         * If the physiological file is the parent of a collection
         * set or override a few parameters
         */

        $query        = "SELECT PhysiologicalFileID
                                FROM `physiological_file`
                                WHERE ParentID=:PFID
                                ORDER BY `Index`";
        $splitFileIDs = $db->pselectCol(
            $query,
            ['PFID' => $physiologicalFileID]
        );

        $this->_splitFileIDs = array_combine(
            array_map('intval', array_keys($splitFileIDs)),
            array_values($splitFileIDs)
        );

        if (count($this->_splitFileIDs) > 0) {
            $this->_fileData['SplitCount'] = strval(count($this->_splitFileIDs));

            // Overrides Recording Duration
            $query = "SELECT SUM(ppf.Value)
                    FROM physiological_parameter_file as ppf
                      LEFT JOIN parameter_type as pt USING (ParameterTypeID)
                    WHERE PhysiologicalFileID IN ("
                    . join(',', $this->_splitFileIDs)
                    . ")
                      AND pt.Name = 'RecordingDuration'";
            $this->_parameters['RecordingDuration'] = $db->pselectOne($query, []);

            // Set chunk paths
            $query = "SELECT ppf.Value
                    FROM physiological_parameter_file as ppf
                      LEFT JOIN parameter_type as pt USING (ParameterTypeID)
                    WHERE PhysiologicalFileID IN ("
                    . join(',', $this->_splitFileIDs)
                    . ")
                      AND pt.Name = 'electrophysiology_chunked_dataset_path'";
            $this->_chunksURLs = $db->pselectCol($query, []);
        } else {
            $this->_fileData['SplitCount'] = 'n/a';

            $query = "SELECT ppf.Value
                    FROM physiological_parameter_file as ppf
                      LEFT JOIN parameter_type as pt USING (ParameterTypeID)
                    WHERE PhysiologicalFileID=:PFID
                      AND pt.Name = 'electrophysiology_chunked_dataset_path'";
            $this->_chunksURLs = $db->pselectCol(
                $query,
                ['PFID' => $physiologicalFileID]
            );
        }
    }

    /**
     * Gets a parameter for this file from the appropriate place
     *
     * @param string $parameterName The parameter to be retrieved
     *
     * @return string The value of the parameter
     */
    function getParameter(string $parameterName) : string
    {
        $val = $this->_fileData[$parameterName] ??
            ($this->_parameters[$parameterName] ?? '');
        return strval($val);
    }

    /**
     * Gets the chunks URLs for this file
     *
     * @return array The list of URLs
     */
    function getChunksURLs() : array
    {
        return $this->_chunksURLs;
    }

    /**
     * Gets the split data for this file
     *
     * @param int $index The split index
     *
     * @return ?array The split data
     */
    function getSplitData(int $index) : ?array
    {
        if (count($this->_splitFileIDs) === 0) {

            return null;
        }

        return [
            'splitIndex'      => $index,
            'splitCount'      => intval($this->_fileData['SplitCount']),
            'splitPhysioFile' => new ElectrophysioFile(
                $this->loris,
                intval($this->_splitFileIDs[$index])
            ),
        ];
    }

    /**
     * Implements \LORIS\Data\DataInstance interface
     *
     * @return string which can be serialized by json_encode()
     */
    public function jsonSerialize() : string
    {
        return '';
    }
}
