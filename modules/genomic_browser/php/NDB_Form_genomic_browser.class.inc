<?php

/**
 * Form_genomic_browser class file
 *
 * PHP version 5
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
*/

require_once "NDB_BVL_Battery.class.inc";
require_once 'NDB_Form.class.inc';
require_once 'GenomicFile.class.inc';
/**
 * NDB_Form_Genomic_Browser Class
 *
 * This class is genomic_browser Form
 *
 * @category   Genomic
 * @package    Main
 * @subpackage Genomic
 * @author     Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
*/

class NDB_Form_Genomic_Browser extends NDB_Form
{
    /**
     * Variables to store the DCCID, genomic file ID
    */
    var $candID;
    var $genomic_file_ID;

    /**
    * Determine whether the user has permission to view this page
    *
    * @return bool whether the user has access
    */
    function _hasAccess()
    {
        $user =& User::singleton();

        // Add site control? See Imaging Browser example
        return ($user->hasPermission('genomic_browser_view_allsites') ||
                $user->hasPermission('genomic_browser_view_site'));
    }

    /**
    * Sets up main parameters given one GenomicFileID
    * Visit Label or SessionID not required
    *
    * @return NULL
    */
    function viewGenomicFile()
    {
        $this->DB = Database::singleton();

        $this->genomic_file_id = $_REQUEST['GenomicFileID'];
        $this->candID          = $_REQUEST['candID'];

        if (!empty($this->candID) || !empty($this->genomic_file_id) ) {
            $this->_setFileData();
            $this->tpl_data['has_permission'] = ($this->_hasAccess()) ? true : false;
        }
    }

    /**
    * Sets values for Genomic data files
    *
    * @param string $category type of data: raw,cleaned,gwas
    *
    * @return NULL
    */
    function _setFileData($category = null)
    {
        if (empty($this->genomic_file_id)) {
            $files = $this->DB->pselect(
                "SELECT g.GenomicFileID
                FROM genomic_candidate_files_rel g WHERE g.CandID=:cid ",
                array('cid' => $this->candID)
            );
        } else {
            $files = array(
                      array('GenomicFileID' => $this->genomic_file_id),
                     );
        }
        $this->tpl_data['files'] = array();
        foreach ($files as $fileRow) {
            $FileObj = new GenomicFile($fileRow['GenomicFileID']);

            // Get a few parameters
            $paramFilename         = basename($FileObj->getParameter('FileName'));
            $paramNormalization    = $FileObj->getParameter('Normalization');
            $paramAnalysisProtocol = $FileObj->getParameter('AnalysisProtocol');
            $paramFileInsertDate   = $FileObj->getParameter('Date_inserted');
            $paramQCDate           = $FileObj->getParameter('QCLastChangeTime');

            // load $file array
            $file = array(
                     'FileID'           => $fileRow['GenomicFileID'],
                     'Filename'         => $paramFileName,
                     'FullFilename'     => $FileObj->getParameter('FileName'),
                     'FilePackage'      => $FileObj->getParameter('FilePackage'),
                     'FileType'         => $FileObj->getParameter('FileType'),
                     'FileSize'         => $FileObj->getParameter('FileSize'),
                     'Description'      => $FileObj->getParameter('Description'),
                     'Category'         => $FileObj->getParameter('Category'),
                     'Pipeline'         => $FileObj->getParameter('Pipeline'),
                     'Algorithm'        => $FileObj->getParameter('Algorithm'),
                     'Normalization'    => $paramNormalization,
                     'SampleID'         => $FileObj->getParameter('SampleID'),
                     'Caveat'           => $FileObj->getParameter('Caveat'),
                     'Notes'            => $FileObj->getParameter('Notes'),
                     'AnalysisProtocol' => $paramAnalysisProtocol,
                     'AnalysisModality' => $FileObj->getParameter(
                         'AnalysisModality'
                     ),
                     'AnalysisDate'     => $this->_getDate(
                         $FileObj,
                         'Date_taken',
                         $analysisDate
                     ),
                     'SampleDate'       => $this->_getDate(
                         $FileObj,
                         'Date_sample',
                         $sampleDate
                     ),
                     'FileInsertDate'   => $paramFileInsertDate,
                     'Selected'         => $FileObj->getParameter('Selected'),
                     'QCStatus'         => $FileObj->getParameter('QCStatus'),
                     'QCDate'           => $paramQCDate,
                    );

            $this->tpl_data['files'][] = $file;
        }
    }
    /**
    * Gets the date according to the type
    *
    * @param GenomicFile $file  file object
    * @param string      $type  type of the date
    * @param array       $array array containing the date
    *
    * @return date if exists, if not an empty string
    */
    function _getDate($file, $type, $array)
    {
        $pattern  = "/(\d{4})-?(\d{2})-?(\d{2})/";
        $fileType = $file->getParameter($type);
        if (preg_match($pattern, $fileType, $array)) {
            return (mktime(12, 0, 0, $array[2], $array[3], $array[1]));
        } else {
            return "";
        }
    }

}
?>
