<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Genomic_Browser
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\genomic_browser\Models;

/**
 * A FilesDTO represents an Files in the genomic browser module.
 * It is doing the mapping between the profile table columns
 * and the JSON object properties returned to the frontend.
 *
 * Additionally, it implements the DataInstance interface so it can be used by
 * a Database Provisioner.
 *
 * @category Genomic_Browser
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class FilesDTO implements \LORIS\Data\DataInstance
{
    /**
     * The GenomicFileID
     *
     * @var string
     */
    private $_GenomicFileID = "";

    /**
     * The FileName
     *
     * @var string
     */
    private $_File_Name = "";

    /**
     * The Description
     *
     * @var string
     */
    private $_Description = "";

    /**
     * The FileType
     *
     * @var string
     */
    private $_FileType = "";

    /**
     * The Date_inserted
     *
     * @var string
     */
    private $_Date_inserted = "";

    /**
     * The InsertedByUserID
     *
     * @var string
     */
    private $_InsertedByUserID = "";

    /**
     * The Caveat
     *
     * @var string
     */
    private $_Caveat = "";

    /**
     * The Notes
     *
     * @var string
     */
    private $_Notes = "";

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'GenomicFileID'    => $this->_GenomicFileID,
            'FileName'         => $this->_File_Name,
            'Description'      => $this->_Description,
            'FileType'         => $this->_FileType,
            'Date_inserted'    => $this->_Date_inserted,
            'InsertedByUserID' => $this->_InsertedByUserID,
            'Caveat'           => $this->_Caveat,
            'Notes'            => $this->_Notes,
        ];
    }
}
