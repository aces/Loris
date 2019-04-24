<?php
/**
 * Form_genomic_browser class file
 *
 * PHP version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
*/
namespace LORIS\genomic_browser;

/**
 * Vie_Genomic_File Class
 *
 * This class is a Form to present Genomic_file data
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Christine Rogers <rogers@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
*/

class View_Genomic_File extends \NDB_Form
{
    /**
     * Variables to store the DCCID, genomic file ID
    */
    var $candID;
    var $genomic_file_ID;

    /**
    * Determine whether the user has permission to view this page
    *
    * @param \User $user The user whose access is being checked
    *
    * @return bool whether the user has access
    */
    function _hasAccess(\User $user): bool
    {
        // Add site control? See Imaging Browser example
        return ($user->hasPermission('genomic_browser_view_allsites') ||
                $user->hasPermission('genomic_browser_view_site'));
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $this->genomic_file_id = $_REQUEST['GenomicFileID'] ?? null;
        $this->candID          = $_REQUEST['candID'] ?? null;

        if (!empty($this->candID) || !empty($this->genomic_file_id) ) {
            $this->_setFileData();
            $user = \User::singleton();
            $this->tpl_data['has_permission'] = $this->_hasAccess($user);
        }
    }

    /**
    * Populates tpl form data using values from a Genomic_File object.
    *
    * @param ?string $category type of data: raw,cleaned,gwas
    *
    * @return void
    */
    private function _setFileData(?string $category = null): void
    {
        if (empty($this->genomic_file_id)) {
            $files = \Database::singleton()->pselect(
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
            $FileObj = new Genomic_File(intval($fileRow['GenomicFileID']));

            // Get a few parameters
            $paramFilename         = basename($FileObj->getParameter('FileName'));
            $paramNormalization    = $FileObj->getParameter('Normalization');
            $paramAnalysisProtocol = $FileObj->getParameter('AnalysisProtocol');
            $paramFileInsertDate   = $FileObj->getParameter('Date_inserted');
            $paramQCDate           = $FileObj->getParameter('QCLastChangeTime');

            // load $file array
            $file = array(
                     'FileID'           => $fileRow['GenomicFileID'],
                     'Filename'         => $paramFilename,
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
                     'AnalysisDate'     => $FileObj->getParameter('Date_taken'),
                     'FileInsertDate'   => $paramFileInsertDate,
                     'Selected'         => $FileObj->getParameter('Selected'),
                     'QCStatus'         => $FileObj->getParameter('QCStatus'),
                     'QCDate'           => $paramQCDate,
                    );

            $this->tpl_data['files'][] = $file;
        }
    }
}

